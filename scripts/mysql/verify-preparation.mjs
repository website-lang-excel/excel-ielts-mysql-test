import assert from 'node:assert/strict';
import { mkdtemp,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join,resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createMysqlDatabase,createMysqlStores,poolOptions,MysqlOperationError } from '../../lib/database/mysql.mjs';
import { buildSchema,asciiLowerSql,checks } from './schema.mjs';
import { canonical,decodeCell,mysqlCell,validateExport } from './data.mjs';
import { prepare,migrateScope } from './migrate.mjs';
const env={RESULTS_DATABASE_URL:'mysql://fixture:private-placeholder@localhost/exam_migration_test',STUDENT_DATABASE_URL:'mysql://fixture:private-placeholder@localhost/student_migration_test',MYSQL_TLS_MODE:'disabled'};
const cases=[];
async function test(name,fn){await fn();cases.push(name);console.log('PASS '+name);}
function fixture(){const log=[],connections=[];const pool={async getConnection(){const c={async query(q){const sql=typeof q==='string'?q:q.sql;log.push({connection:connections.indexOf(c),sql});if(sql==='FAIL')throw Object.assign(Error('sensitive SQL must not escape'),{code:'ER_LOCK_DEADLOCK'});if(sql==='COMMIT'&&c.failCommit)throw Error('lost commit reply');return [sql.startsWith('SELECT')?[{id:'fixture'}]:{affectedRows:1}];},release(){c.released=true;},destroy(){c.destroyed=true;}};connections.push(c);return c;},async end(){log.push({sql:'POOL END'});}};return {log,connections,pool};}
await test('configuration, separate schemas, parameter protection, TLS verification',async()=>{
 assert.throws(()=>poolOptions({},'results'),e=>e.code==='MYSQL_CONFIGURATION_REQUIRED');
 assert.throws(()=>poolOptions({...env,RESULTS_DATABASE_URL:'mysql://u:p@remote.example/db'},'results'),e=>e.code==='MYSQL_TLS_REQUIRED');
 const config=poolOptions({...env,MYSQL_TLS_MODE:'required'},'results');assert.equal(config.ssl.rejectUnauthorized,true);assert.equal(config.multipleStatements,false);assert.equal(config.connectionLimit,5);
 assert.throws(()=>createMysqlStores({...env,STUDENT_DATABASE_URL:env.RESULTS_DATABASE_URL}),e=>e.code==='MYSQL_SEPARATE_SCHEMAS_REQUIRED');
 assert.throws(()=>poolOptions({...env,DATABASE_URL:'bad',RESULTS_DATABASE_URL:'invalid'},'results'));assert.equal(JSON.stringify(new MysqlOperationError('MYSQL_TEST',Object.assign(Error('password=secret'),{code:'ER_BAD_DB_ERROR'}))).includes('secret'),false);
});
await test('transaction connection pinning, row lock, commit before return',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await d.transaction(async()=>{await d.lockAttempt('fixture');await d.query('SELECT 1');});
 assert.equal(f.connections.length,1);assert.ok(f.log.some(r=>r.sql.includes('FOR UPDATE')));assert.equal(f.log.at(-1).sql,'COMMIT');assert.ok(f.connections[0].released);await d.close();
});
await test('concurrent transactions do not share connections or context',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await Promise.all([d.transaction(async()=>{await new Promise(r=>setTimeout(r,10));await d.query('SELECT first');}),d.transaction(async()=>{await d.query('SELECT second');})]);assert.equal(f.connections.length,2);assert.notEqual(f.log.find(r=>r.sql==='SELECT first').connection,f.log.find(r=>r.sql==='SELECT second').connection);await d.close();
});
await test('failure rolls back; caught query errors cannot accidentally commit',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await assert.rejects(d.transaction(async()=>{try{await d.query('FAIL');}catch{/* caller incorrectly catches it */}}),e=>e.code==='MYSQL_TRANSACTION_ABORTED');assert.equal(f.log.at(-1).sql,'ROLLBACK');assert.ok(!f.log.some(r=>r.sql==='COMMIT'));await d.close();
});
await test('unconfirmed commit never returns success or retries writes',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await assert.rejects(d.transaction(async()=>{f.connections[0].failCommit=true;await d.query('SELECT 1');}),e=>e.code==='MYSQL_COMMIT_UNCONFIRMED');assert.equal(f.log.filter(r=>r.sql==='COMMIT').length,1);assert.ok(f.connections[0].destroyed);await d.close();
});
await test('unsafe bindings and locks outside transactions rejected',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await assert.rejects(d.lockAttempt('fixture'));await assert.rejects(d.query('SELECT ?',[{sql:'injection'}]));await d.close();await assert.rejects(d.query('SELECT 1'),e=>e.code==='MYSQL_POOL_CLOSED');
});
await test('nested transactions rejected without a second connection',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',env,()=>f.pool);await assert.rejects(d.transaction(()=>d.transaction(()=>Promise.resolve())),e=>e.code==='MYSQL_NESTED_TRANSACTION');assert.equal(f.connections.length,1);await d.close();
});
await test('bounded pool acquisition releases late connections',async()=>{
 let released=false;const d=createMysqlDatabase('results',{...env,MYSQL_ACQUIRE_TIMEOUT_MS:'500'},()=>({getConnection:()=>new Promise(r=>setTimeout(()=>r({release(){released=true;}}),550)),end:async()=>{}}));await assert.rejects(d.query('SELECT 1'),e=>e.code==='MYSQL_POOL_TIMEOUT');await new Promise(r=>setTimeout(r,100));assert.ok(released);await d.close();
});
await test('transaction deadline destroys connection and prevents delayed commit',async()=>{
 const f=fixture(),d=createMysqlDatabase('results',{...env,MYSQL_TRANSACTION_TIMEOUT_MS:'500'},()=>f.pool);await assert.rejects(d.transaction(async()=>{await new Promise(r=>setTimeout(r,550));}),e=>e.code==='MYSQL_TRANSACTION_TIMEOUT');await new Promise(r=>setTimeout(r,100));assert.ok(f.connections[0].destroyed);assert.ok(!f.log.some(r=>r.sql==='COMMIT'));await d.close();
});
await test('typed value codec retains int64, Unicode, whitespace, NULL and IEEE double',async()=>{
 assert.equal(decodeCell(['integer','9223372036854775807']),'9223372036854775807');assert.equal(decodeCell(['text',' বাংলা 😀  ']),' বাংলা 😀  ');assert.deepEqual(mysqlCell(1.5,{type:'REAL'}),['real','3ff8000000000000']);assert.equal(decodeCell(['real','3ff8000000000000']),1.5);assert.deepEqual(mysqlCell(null,{type:'TEXT'}),['null',null]);assert.deepEqual(decodeCell(['blob','AAEC']),Buffer.from([0,1,2]));assert.throws(()=>decodeCell(['real','7ff0000000000000']));
});
await test('CHECK parser and ASCII-only casefold plan',async()=>{
 assert.deepEqual(checks("CREATE TABLE x(a TEXT CHECK(a IN ('x(y)','z')),b INT CHECK(b>0))"),["a IN ('x(y)','z')",'b>0']);assert.ok(asciiLowerSql('`email`').startsWith('REPLACE('));assert.ok(!asciiLowerSql('`email`').includes('LOWER('));
});
await test('invalid export hashes, types and truncation rejected',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'mysql-export-verify-')),file=join(dir,'fixture.jsonl'),body=canonical([['text','x'.repeat(192)]]),table={name:'fixture',columns:[{name:'id',type:'TEXT',pk:1,notnull:1}],rows:1,sha256:createHash('sha256').update(body).digest('hex')};await writeFile(file,body);await assert.rejects(validateExport(table,file),/bound/);await writeFile(file,canonical([['null',null]]));await assert.rejects(validateExport(table,file),/NULL/);
});
await test('isolated import execution fails closed without explicit confirmation',async()=>{await assert.rejects(migrateScope({scope:'results'},{}),/confirmation/);});
const root=process.argv[2];
if(root)await test('all 37 actual exported table files pass counts, types and full hashes',async()=>{
 const plans=await prepare(resolve(root));assert.equal(plans.reduce((n,p)=>n+p.manifest.tables.length,0),37);for(const p of plans){const schema=buildSchema(p.manifest);assert.equal(schema.tables.length,p.manifest.tables.length);assert.ok(schema.tables.every(t=>t.sql.includes('ENGINE=InnoDB')));}
 const result=plans.find(p=>p.scope==='results');assert.ok(result.schema.tables.find(t=>t.name==='attempts').sql.includes('__active_assignment_id'));
 const student=plans.find(p=>p.scope==='students');assert.ok(student.schema.tables.find(t=>t.name==='students').sql.includes('__email_ascii_nocase'));
});
console.log(JSON.stringify({preparationGroupsPassed:cases.length,realMysqlIntegrationExecuted:false,cases}));
