import {DatabaseSync} from 'node:sqlite';
import {createMysqlStores} from './mysql.mjs';
import schemas from './source-schemas.json' with {type:'json'};
import columns from './source-columns.json' with {type:'json'};
export async function createSqliteSnapshot(scope,target,providedStore) {
 if(!['results','students'].includes(scope))throw Error('Invalid snapshot scope');
 const owned=providedStore?undefined:createMysqlStores({...process.env,MYSQL_NORMALIZE_NUMBERS:'true'}),store=providedStore||owned[scope];
 const output=new DatabaseSync(target);let begun=false;
 try {
  output.exec('PRAGMA foreign_keys=OFF; BEGIN IMMEDIATE');begun=true;
  for(const sql of schemas[scope].ddl)output.exec(sql);
  await store.readSnapshot(async()=>{
   for(const table of schemas[scope].tables){const fields=columns[scope][table],q=s=>'"'+s.replaceAll('"','""')+'"';
    const insert=output.prepare('INSERT INTO '+q(table)+' ('+fields.map(q).join(',')+') VALUES ('+fields.map(()=>'?').join(',')+')');
    const data=await store.query('SELECT '+fields.map(c=>'`'+c+'`').join(',')+' FROM `'+table+'`');
    for(const row of data)insert.run(...fields.map(c=>row[c]));
   }
  });
  output.exec('PRAGMA user_version='+schemas[scope].userVersion+'; COMMIT');begun=false;
  if(output.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||output.prepare('PRAGMA foreign_key_check').all().length)throw Error('MySQL-to-SQLite backup integrity verification failed');
  return target;
 }finally{if(begun)output.exec('ROLLBACK');output.close();if(owned)await owned.close();}
}
