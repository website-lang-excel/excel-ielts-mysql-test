import assert from 'node:assert/strict';
import {createMysqlDatabase,poolOptions} from '../../lib/database/mysql.mjs';
const options=poolOptions(process.env,'results');
if(options.host!=='127.0.0.1'||options.port!==33326||options.database!=='queue_results_test')throw Error('Only the isolated local queue-test database is allowed');
const reports=[];
for(const [queue,expectedSuccess] of [[20,25],[64,50]]){
 const db=createMysqlDatabase('results',{...process.env,MYSQL_QUEUE_LIMIT:String(queue)});
 try{
  const outcomes=await Promise.all(Array.from({length:50},async()=>{try{await db.query('SELECT SLEEP(0.1) n');return {success:true};}catch(e){return {success:false,code:e.code};}}));
  const successes=outcomes.filter(x=>x.success).length,errors=outcomes.filter(x=>!x.success);assert.equal(successes,expectedSuccess);assert.ok(errors.every(x=>x.code==='MYSQL_POOL_UNAVAILABLE'));assert.equal(Number((await db.query('SELECT 1 n'))[0].n),1);
  reports.push({realMysql:true,noRecordsWritten:true,parallelRequests:50,poolLimit:options.connectionLimit,queueLimit:queue,successes,retryableRejections:errors.length,rawErrors:0,poolReusableAfterBurst:true});
 }finally{await db.close();}
}
console.log(JSON.stringify({realPoolRegressionPassed:true,reports},null,2));
