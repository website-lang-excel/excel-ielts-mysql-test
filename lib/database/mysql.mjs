/** Opt-in asynchronous transport. Existing SQLite entry points do not import this module. */
import { AsyncLocalStorage } from 'node:async_hooks';
import { readFileSync } from 'node:fs';
import mysql from 'mysql2/promise';

export class MysqlOperationError extends Error {
  constructor(code, cause) { super('Database operation could not be confirmed. Retry through the existing application recovery policy.'); this.name='MysqlOperationError'; this.code=code; if(/^[A-Z0-9_]{1,64}$/.test(cause?.code||''))this.driverCode=cause.code; }
  toJSON() { return {name:this.name,code:this.code}; }
}
export function poolOptions(env, scope) {
  const value=scope==='results' ? (env.RESULTS_DATABASE_URL||env.DATABASE_URL) : env.STUDENT_DATABASE_URL;
  if (!value) throw new MysqlOperationError('MYSQL_CONFIGURATION_REQUIRED');
  let u; try {u=new URL(value);} catch {throw new MysqlOperationError('MYSQL_INVALID_CONFIGURATION');}
  if(u.protocol!=='mysql:'||!u.hostname||!u.pathname.slice(1)||u.search||u.hash) throw new MysqlOperationError('MYSQL_INVALID_CONFIGURATION');
  const local=['localhost','127.0.0.1','[::1]'].includes(u.hostname);
  const mode=env.MYSQL_TLS_MODE||'required';
  if(!['required','disabled'].includes(mode)||mode==='disabled'&&!local) throw new MysqlOperationError('MYSQL_TLS_REQUIRED');
  const integer=(key,fallback,min,max)=>{const n=Number(env[key]||fallback);if(!Number.isSafeInteger(n)||n<min||n>max)throw new MysqlOperationError('MYSQL_INVALID_CONFIGURATION');return n;};
  let ca;try {if(env.MYSQL_TLS_CA_FILE)ca=readFileSync(/*turbopackIgnore: true*/ env.MYSQL_TLS_CA_FILE,'utf8');}catch {throw new MysqlOperationError('MYSQL_INVALID_TLS_CONFIGURATION');}
  // The handshake collation occupies one byte; select the 0900 collation after connecting.
  return {host:u.hostname.replace(/^\[|\]$/g,''),port:u.port?Number(u.port):3306,user:decodeURIComponent(u.username),password:decodeURIComponent(u.password),database:decodeURIComponent(u.pathname.slice(1)),charset:'utf8mb4_unicode_ci',timezone:'Z',supportBigNumbers:true,bigNumberStrings:true,dateStrings:true,jsonStrings:true,multipleStatements:false,enableKeepAlive:true,waitForConnections:true,connectionLimit:integer('MYSQL_POOL_LIMIT',5,1,20),maxIdle:integer('MYSQL_POOL_LIMIT',5,1,20),idleTimeout:60000,queueLimit:integer('MYSQL_QUEUE_LIMIT',64,1,200),connectTimeout:integer('MYSQL_CONNECT_TIMEOUT_MS',3000,500,5000),...(env.MYSQL_NORMALIZE_NUMBERS==='true'?{typeCast(field,next){if(field.type==='LONGLONG'||field.type==='NEWDECIMAL'){const value=field.string();if(value===null)return null;const number=Number(value);if(!Number.isFinite(number)||field.type==='LONGLONG'&&!Number.isSafeInteger(number))throw new MysqlOperationError('MYSQL_NUMERIC_PRECISION');return number;}return next();}}:{}),...(mode==='required'?{ssl:{rejectUnauthorized:true,verifyIdentity:true,...(ca?{ca}:{})}}:{})};
}

export function createMysqlDatabase(scope, env=process.env, factory=mysql.createPool) {
  if(!['results','students'].includes(scope))throw new MysqlOperationError('MYSQL_INVALID_SCOPE');
  const options=poolOptions(env,scope),context=new AsyncLocalStorage();
  const acquireMs=Number(env.MYSQL_ACQUIRE_TIMEOUT_MS||3000),queryMs=Number(env.MYSQL_QUERY_TIMEOUT_MS||7000),transactionMs=Number(env.MYSQL_TRANSACTION_TIMEOUT_MS||12000);
  if(!Number.isSafeInteger(acquireMs)||acquireMs<500||acquireMs>5000||!Number.isSafeInteger(queryMs)||queryMs<500||queryMs>10000||!Number.isSafeInteger(transactionMs)||transactionMs<500||transactionMs>12000)throw new MysqlOperationError('MYSQL_INVALID_CONFIGURATION');
  const pool=factory(options);
  let ending=false;
  async function acquire() {
    if(ending)throw new MysqlOperationError('MYSQL_POOL_CLOSED');
    let waiting,timer,expired=false;
    try{
      // Acquire before executing any SQL. Queue overflow and connection failures
      // must use the same bounded, retryable backpressure path as acquisition expiry.
      waiting=Promise.resolve(pool.getConnection());
      return await Promise.race([waiting,new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new MysqlOperationError('MYSQL_POOL_TIMEOUT'));},acquireMs);})]);
    }catch(error){
      if(error instanceof MysqlOperationError)throw error;
      throw new MysqlOperationError('MYSQL_POOL_UNAVAILABLE',error);
    }
    finally {clearTimeout(timer);if(expired)void waiting.then(c=>c.release(),()=>{});}
  }
  async function initialize(c) {
    await c.query({sql:'SET NAMES utf8mb4 COLLATE utf8mb4_0900_bin',timeout:queryMs});
    await c.query({sql:"SET SESSION sql_mode='STRICT_ALL_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION,NO_AUTO_VALUE_ON_ZERO', time_zone='+00:00', innodb_lock_wait_timeout=5",timeout:queryMs});
  }
  const bindings=params=>params.map(v=>{if(v===null||typeof v==='string'||Buffer.isBuffer(v))return v;if(typeof v==='bigint')return v.toString();if(typeof v==='number'&&Number.isFinite(v))return v;throw new MysqlOperationError('MYSQL_INVALID_BINDING');});
  async function on(c,sql,params=[]) {if(typeof sql!=='string'||!Array.isArray(params))throw new MysqlOperationError('MYSQL_INVALID_QUERY');return (await c.query({sql,values:bindings(params),timeout:queryMs}))[0];}
  async function query(sql,params=[],options={}) {
    const allowDuplicate=options.allowDuplicate===true;
    const current=context.getStore();if(current){if(current.poisoned)throw new MysqlOperationError('MYSQL_TRANSACTION_ABORTED');try{return await on(current.connection,sql,params);}catch(e){if(!(allowDuplicate&&e?.code==='ER_DUP_ENTRY'))current.poisoned=true;throw new MysqlOperationError('MYSQL_QUERY_UNCONFIRMED',e);}}
    const c=await acquire();let healthy=true;try {await initialize(c);return await on(c,sql,params);}catch(e){healthy=false;c.destroy();throw new MysqlOperationError('MYSQL_QUERY_UNCONFIRMED',e);}finally {if(healthy)c.release();}
  }
  async function transaction(fn,options={}) {
    if(context.getStore())throw new MysqlOperationError('MYSQL_NESTED_TRANSACTION');
    const c=await acquire();let committed=false,commitStarted=false,healthy=true,timer;
    const state={connection:c,poisoned:false,readOnly:options.readOnly===true};
    try {
      return await Promise.race([(async()=>{
        await initialize(c);await on(c,'SET TRANSACTION ISOLATION LEVEL '+(state.readOnly?'REPEATABLE READ':'READ COMMITTED'));await on(c,state.readOnly?'START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY':'START TRANSACTION');
        if(state.poisoned)throw new MysqlOperationError('MYSQL_TRANSACTION_ABORTED');
        const result=await context.run(state,fn);
        if(state.poisoned)throw new MysqlOperationError('MYSQL_TRANSACTION_ABORTED');
        commitStarted=true;await on(c,'COMMIT');committed=true;return result;
      })(),new Promise((_,reject)=>{timer=setTimeout(()=>{state.poisoned=true;healthy=false;c.destroy();reject(new MysqlOperationError(commitStarted?'MYSQL_COMMIT_UNCONFIRMED':'MYSQL_TRANSACTION_TIMEOUT'));},transactionMs);})]);
    }catch(e){try{if(!committed&&healthy)await on(c,'ROLLBACK');}catch{healthy=false;}if(commitStarted){healthy=false;throw new MysqlOperationError('MYSQL_COMMIT_UNCONFIRMED',e);}throw e;}
    finally{clearTimeout(timer);if(healthy)c.release();else c.destroy();}
  }
  async function lockAttempt(id) {if(!context.getStore())throw new MysqlOperationError('MYSQL_LOCK_REQUIRES_TRANSACTION');return (await query('SELECT * FROM attempts WHERE id=? FOR UPDATE',[id]))[0];}
  async function close(){ending=true;await pool.end();}
  return {query,transaction,readSnapshot:fn=>transaction(fn,{readOnly:true}),inTransaction:()=>!!context.getStore(),readOnlyTransaction:()=>!!context.getStore()?.readOnly,lockAttempt,close,scope};
}

/** A host shutdown integration must await this closure; no process handlers are added implicitly. */
export function createMysqlStores(env=process.env,factory=mysql.createPool) {
  const a=poolOptions(env,'results'),b=poolOptions(env,'students');
  if(a.host===b.host&&a.port===b.port&&a.database===b.database)throw new MysqlOperationError('MYSQL_SEPARATE_SCHEMAS_REQUIRED');
  const results=createMysqlDatabase('results',env,factory),students=createMysqlDatabase('students',env,factory);
  return {results,students,close:async()=>{await Promise.all([results.close(),students.close()]);}};
}
