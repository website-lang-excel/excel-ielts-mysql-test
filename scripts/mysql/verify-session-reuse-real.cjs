/* eslint-disable @typescript-eslint/no-require-imports -- Isolated real-MySQL regression fixture. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const mysql=require('mysql2/promise'),fixture=require('../test-support/mysql-regression.cjs');
const folder=path.resolve('private/session-performance-20261108');
const calls=[];const nativePool=mysql.createPool;
function counted(options){const pool=nativePool(options),borrow=pool.getConnection.bind(pool);pool.getConnection=async()=>{const c=await borrow(),query=c.query.bind(c);c.query=(value,...args)=>{calls.push(typeof value==='string'?value:value.sql);return query(value,...args);};return c;};return pool;}
let stores=[];
(async()=>{try{
 await fixture.ready();
 const current=await import('../../lib/database/mysql.mjs');
 const baseline=await import(pathToFileURL(path.join(folder,'mysql-before.mjs')).href);
 const env={...process.env,MYSQL_POOL_LIMIT:'1'};
 for(const scope of ['results','students']){const o=current.poolOptions(env,scope);assert.equal(o.host,'127.0.0.1');assert.equal(o.port,33326);assert.match(o.database,/^reg_[a-f0-9]+_(results|students)_test$/);}
 const measurements=[];
 for(const [name,module]of [['before',baseline],['after',current]]){
  const d=module.createMysqlDatabase('results',env,counted);stores.push(d);await d.query('SELECT 1 n');calls.length=0;const started=performance.now();
  for(let i=0;i<30;i++)assert.equal(Number((await d.query('SELECT 1 n'))[0].n),1);
  const milliseconds=performance.now()-started;
  measurements.push({name,warmQueries:30,sqlCommands:calls.length,setupCommands:calls.filter(s=>/^SET NAMES|^SET SESSION/.test(s)).length,elapsedMs:Math.round(milliseconds*100)/100});
  await d.close();stores=stores.filter(s=>s!==d);
 }
 assert.equal(measurements[0].sqlCommands,90);assert.equal(measurements[1].sqlCommands,30);assert.equal(measurements[1].setupCommands,0);
 await fixture.executeResults('CREATE TABLE session_reuse_probe(id INT PRIMARY KEY,required_value INT NOT NULL,unicode_value LONGTEXT)');
 const d=current.createMysqlDatabase('results',env,counted);stores.push(d);
 const checkSettings=async()=>{const r=(await d.query('SELECT @@character_set_client charset,@@collation_connection collation_name,@@time_zone zone,@@innodb_lock_wait_timeout lock_wait,@@sql_mode modes'))[0];assert.equal(r.charset,'utf8mb4');assert.equal(r.collation_name,'utf8mb4_0900_bin');assert.equal(r.zone,'+00:00');assert.equal(Number(r.lock_wait),5);assert.ok(r.modes.includes('STRICT_ALL_TABLES'));};
 await checkSettings();await d.query('INSERT INTO session_reuse_probe VALUES(?,?,?)',[1,1,'বাংলা 😀']);assert.equal((await d.query('SELECT unicode_value value FROM session_reuse_probe WHERE id=?',[1]))[0].value,'বাংলা 😀');
 await assert.rejects(d.query('INSERT INTO session_reuse_probe VALUES(?,?,?)',[2,null,'invalid']),e=>e.code==='MYSQL_QUERY_UNCONFIRMED');await checkSettings();
 await d.query("SET SESSION time_zone='+01:00'");await checkSettings();await d.close();stores=stores.filter(s=>s!==d);
 mysql.createPool=counted;
 const jarValues=new Map(),jar={get:key=>jarValues.has(key)?{value:jarValues.get(key)}:undefined,set:(key,value)=>jarValues.set(key,value),delete:key=>jarValues.delete(key)};
 process.env.APP_ORIGIN='http://127.0.0.1:3307';process.env.CLASSROOM_HTTP='true';
 const auth=fixture.load('lib/results/auth.ts',jar),{db}=fixture.load('lib/results/db.ts',jar);
 const adminPassword=crypto.randomBytes(18).toString('base64url'),adminId=crypto.randomUUID();await db().prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(adminId,'session-perf-admin','Disposable admin','','admin',auth.passwordHash(adminPassword));
 const request=data=>new Request('http://127.0.0.1:3307/api/admin/students',{method:'POST',headers:{origin:process.env.APP_ORIGIN,'content-type':'application/json'},body:JSON.stringify(data)});
 const login=fixture.load('app/api/auth/login/route.ts',jar);assert.equal((await login.POST(request({username:'session-perf-admin',password:adminPassword,admin:true}))).status,200);
 const studentRoute=fixture.load('app/api/admin/students/route.ts',jar),candidatePassword=crypto.randomBytes(18).toString('base64url');calls.length=0;let started=performance.now();
 const created=await studentRoute.POST(request({name:'Disposable session probe',registrationId:'session-perf-candidate',contact:'',password:candidatePassword}));assert.equal(created.status,200);const createMetrics={sqlCommands:calls.length,setupCommands:calls.filter(s=>/^SET NAMES|^SET SESSION/.test(s)).length,elapsedMs:Math.round((performance.now()-started)*100)/100};
 const candidate=await db().prepare('SELECT * FROM users WHERE registration_id=?').get('session-perf-candidate');assert.equal(candidate.role,'student');assert.equal(auth.passwordMatches(candidatePassword,candidate.password_hash),true);
 const assignments=fixture.load('app/api/admin/assignments/route.ts',jar);calls.length=0;started=performance.now();const assigned=await assignments.POST(request({candidateId:candidate.id,testId:3,mode:'full',purpose:'fresh'}));assert.equal(assigned.status,200);const assignMetrics={sqlCommands:calls.length,setupCommands:calls.filter(s=>/^SET NAMES|^SET SESSION/.test(s)).length,elapsedMs:Math.round((performance.now()-started)*100)/100};
 const assignment=await db().prepare('SELECT * FROM test_assignments WHERE candidate_id=?').get(candidate.id);assert.equal(assignment.status,'ASSIGNED');assert.equal(assignment.mode,'full');assert.equal(Number(assignment.test_id),3);assert.equal((await db().prepare("SELECT count(*) n FROM audit WHERE actor_id=? AND event IN ('student.created','assignment.created')").get(adminId)).n,2);
 assert.equal(createMetrics.setupCommands,0);assert.equal(assignMetrics.setupCommands,0);assert.equal((await fixture.integrity()).length,0);
 const report={localMysqlOnly:true,productionWrites:false,measurements,createStudent:createMetrics,assignTest:assignMetrics,unicodeStrictModeReconnectAndSessionInvalidation:true,adminAuthenticationAndAudit:true,integrityPassed:true};fs.writeFileSync(path.join(folder,'real-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{mysql.createPool=nativePool;for(const store of stores)await store.close();await fixture.close();}})().catch(e=>{console.error('Isolated session verification failed:',e.name,e.code||'VERIFICATION_FAILED');process.exitCode=1;});
