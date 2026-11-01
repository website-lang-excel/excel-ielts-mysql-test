import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {normalize,join} from 'node:path';
import {localMetadata} from './local-env.mjs';
import {poolOptions} from '../../lib/database/mysql.mjs';
const meta=localMetadata(),env=parseEnv(await readFile(meta.shutdownEnvironment,'utf8')),options=poolOptions(env,'results');
if(options.host!=='127.0.0.1'||options.port!==meta.mysqlPort)throw Error('Refusing to stop a nonlocal database.');
for(const key of ['connectionLimit','maxIdle','idleTimeout','waitForConnections','queueLimit'])delete options[key];
let c;
try {
 c=await mysql.createConnection(options);
 const [rows]=await c.query('SELECT @@datadir directory');
 if(normalize(rows[0].directory).replace(/[\\/]+$/,'').toLowerCase()!==normalize(meta.dataDirectory).replace(/[\\/]+$/,'').toLowerCase())throw Error('Refusing to stop a different MySQL instance.');
 const pid=Number((await readFile(join(meta.dataDirectory,'../mysql.pid'),'utf8')).trim());
 if(!Number.isSafeInteger(pid)||pid<1)throw Error('Invalid local MySQL process ID.');
 await c.query('SHUTDOWN');await c.end();c=null;
 for(let i=0;i<300;i++){
  try{process.kill(pid,0);}catch(error){if(error.code==='ESRCH'){console.log('Local MySQL stopped safely. No database files were deleted.');process.exit(0);}throw error;}
  await new Promise(r=>setTimeout(r,100));
 }
 throw Error('MySQL is still shutting down. Do not start another instance yet.');
}finally{if(c)await c.end();}
