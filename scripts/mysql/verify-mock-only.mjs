import assert from 'node:assert/strict';
import {createMysqlStores} from '../../lib/database/mysql.mjs';

// No database connection or records: exercise pool creation/closure boundaries.
const env={RESULTS_DATABASE_URL:'mysql://fixture:fixture@127.0.0.1:33326/results_test',MYSQL_TLS_MODE:'disabled'};
let created=[],closed=[];
const factory=options=>{created.push(options.database);return {end:async()=>{closed.push(options.database);}};};
let stores=createMysqlStores(env,factory);
assert.deepEqual(created,['results_test']);
assert.throws(()=>stores.students,error=>error.code==='MYSQL_CONFIGURATION_REQUIRED');
await stores.close();
assert.deepEqual(closed,['results_test']);

created=[];closed=[];
stores=createMysqlStores({...env,STUDENT_DATABASE_URL:'invalid-unused-portal-url'},factory);
await stores.close();
assert.deepEqual(created,['results_test']);
assert.deepEqual(closed,['results_test']);

created=[];closed=[];
stores=createMysqlStores({...env,STUDENT_DATABASE_URL:env.RESULTS_DATABASE_URL},factory);
assert.throws(()=>stores.students,error=>error.code==='MYSQL_SEPARATE_SCHEMAS_REQUIRED');
await stores.close();
assert.deepEqual(created,['results_test']);

created=[];closed=[];
stores=createMysqlStores({...env,STUDENT_DATABASE_URL:'mysql://fixture:fixture@127.0.0.1:33326/students_test'},factory);
assert.deepEqual(created,['results_test']);
assert.equal(stores.students,stores.students);
assert.deepEqual(created,['results_test','students_test']);
await stores.close();
assert.deepEqual(closed,['results_test','students_test']);
console.log('PASS: 4 mock-only/explicit archive pool configuration groups; no database accessed.');
