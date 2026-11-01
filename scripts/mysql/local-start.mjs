import mysql from 'mysql2/promise';
import {spawn} from 'node:child_process';
import {resolve,normalize,join} from 'node:path';
import {localEnvironment,localMetadata} from './local-env.mjs';
import {poolOptions} from '../../lib/database/mysql.mjs';
const env=localEnvironment(),meta=localMetadata();
function config(){const c=poolOptions(env,'results');if(!['127.0.0.1','localhost'].includes(c.host)||c.port!==meta.mysqlPort)throw Error('Local startup refuses a remote or unexpected database endpoint.');for(const key of ['connectionLimit','maxIdle','idleTimeout','waitForConnections','queueLimit'])delete c[key];return c;}
async function probe(){let c;try{c=await mysql.createConnection(config());const [rows]=await c.query('SELECT @@datadir directory,VERSION() version');if(normalize(rows[0].directory).replace(/[\\/]+$/,'').toLowerCase()!==normalize(meta.dataDirectory).replace(/[\\/]+$/,'').toLowerCase())throw Error('A different MySQL data directory owns the configured port.');if(!/^8\./.test(rows[0].version)||/mariadb/i.test(rows[0].version))throw Error('Expected the local MySQL 8 server.');return true;}catch(error){if(['ECONNREFUSED','ETIMEDOUT','PROTOCOL_CONNECTION_LOST'].includes(error.code))return false;throw error;}finally{if(c)await c.end();}}
if(!await probe()){const child=spawn(join(meta.distribution,'bin/mysqld.exe'),['--defaults-file='+meta.config],{detached:true,windowsHide:true,stdio:'ignore'});child.unref();let ready=false;for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,200));if(await probe()){ready=true;break;}}if(!ready)throw Error('Local MySQL did not start; inspect its private error log. Do not reinitialize the data directory.');}
env.APP_ORIGIN='http://127.0.0.1:'+meta.websitePort;
console.log('Local MySQL verified. Website: '+env.APP_ORIGIN);
const child=spawn(process.execPath,[resolve('node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(meta.websitePort)],{cwd:process.cwd(),env,stdio:'inherit',windowsHide:true});child.once('exit',code=>{process.exitCode=code??1;});for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>child.kill(signal));
