/** Default is plan-only. Execution is restricted to explicitly confirmed isolated schemas. */
import mysql from 'mysql2/promise';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { buildSchema, ident } from './schema.mjs';
import { rows, decodeCell, mysqlCell, canonical, validateExport } from './data.mjs';
import { poolOptions } from '../../lib/database/mysql.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const stateTable='__sqlite_import_state';
const schemaHash=ddl=>sha(JSON.stringify(ddl.map(s=>s.replace(/ AUTO_INCREMENT=\d+/g,''))));
async function verifyRows(c,manifest) {
  const verified=[];
  for(const t of manifest.tables){
    const pk=t.primaryKey.length?t.primaryKey:t.columns.map(c=>c.name);
    const [data]=await c.query('SELECT '+t.columns.map(c=>ident(c.name)).join(',')+' FROM '+ident(t.name)+' ORDER BY '+pk.map(ident).join(','));
    const h=createHash('sha256');for(const row of data)h.update(canonical(t.columns.map(column=>mysqlCell(row[column.name],column))));
    if(data.length!==t.rows||h.digest('hex')!==t.sha256)throw Error('Target count or full typed-content hash mismatch: '+t.name);
    verified.push({table:t.name,rows:data.length,fullHashMatched:true});
  }
  return verified;
}
async function verifyRelationships(c,schema) {
  for(const fk of schema.foreignKeys){const join=fk.columns.map((col,i)=>'c.'+ident(col)+'=p.'+ident(fk.parentColumns[i])).join(' AND '),notnull=fk.columns.map(col=>'c.'+ident(col)+' IS NOT NULL').join(' AND ');
    const [r]=await c.query('SELECT COUNT(*) n FROM '+ident(fk.table)+' c LEFT JOIN '+ident(fk.parent)+' p ON '+join+' WHERE '+notnull+' AND p.'+ident(fk.parentColumns[0])+' IS NULL');
    if(BigInt(r[0].n)!==0n)throw Error('Target foreign-key mismatch: '+fk.table);
  }
}
export async function prepare(exportRoot,output) {
  const plans=[];
  for(const scope of ['results','students']){
    const folder=join(exportRoot,scope),raw=await readFile(join(folder,'manifest.json'),'utf8'),manifest=JSON.parse(raw),schema=buildSchema(manifest);
    for(const t of manifest.tables){if(!/^[A-Za-z_][A-Za-z0-9_]*\.jsonl$/.test(t.dataFile))throw Error('Unsafe export path');await validateExport(t,join(folder,t.dataFile));}
    plans.push({scope,manifest,schema,manifestHash:sha(raw),folder});
  }
  if(output){await mkdir(output,{recursive:false,mode:0o700});for(const p of plans){await writeFile(join(output,p.scope+'-schema.sql'),p.schema.tables.map(t=>t.sql+';').concat(p.schema.foreignKeys.map(f=>f.sql+';')).join('\n\n'),{flag:'wx'});}
    await writeFile(join(output,'plan.json'),JSON.stringify(plans.map(p=>({scope:p.scope,manifestHash:p.manifestHash,tables:p.manifest.tables.map(t=>({name:t.name,rows:t.rows})),notes:p.schema.notes})),null,2),{flag:'wx'});
  }
  return plans;
}
export async function migrateScope(plan,env=process.env) {
  if(env.MYSQL_MIGRATION_CONFIRM_ISOLATED!=='YES')throw Error('Explicit isolated-test confirmation is required');
  const options=poolOptions(env,plan.scope);
  if(!/(?:test|sandbox|staging|migration)/i.test(options.database))throw Error('Target schema must have an unmistakable test/sandbox/staging/migration name');
  // No URL or raw MySQL errors are printed. DDL is not transactional in MySQL.
  const {connectionLimit:_limit,maxIdle:_idle,idleTimeout:_idleTimeout,waitForConnections:_wait,queueLimit:_queue,...connectionOptions}=options;
  void _limit;void _idle;void _idleTimeout;void _wait;void _queue;
  const c=await mysql.createConnection(connectionOptions);let locked=false,inTransaction=false,foreignKeysOff=false;
  try {
    await c.query('SET NAMES utf8mb4 COLLATE utf8mb4_0900_bin');
    const [v]=await c.query('SELECT VERSION() version');const version=String(v[0].version),match=/^(\d+)\.(\d+)\.(\d+)/.exec(version);
    if(/mariadb/i.test(version)||!match||Number(match[1])<8||Number(match[1])===8&&Number(match[2])===0&&Number(match[3])<30)throw Error('Verified target must be MySQL 8.0.30+; MariaDB is not implicitly interchangeable');
    await c.query("SET SESSION sql_mode='STRICT_ALL_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION,NO_AUTO_VALUE_ON_ZERO',time_zone='+00:00'");
    const [got]=await c.query('SELECT GET_LOCK(?,0) ok',['sqlite-migration:'+options.database]);if(Number(got[0].ok)!==1)throw Error('Another importer owns this target');locked=true;
    const [existing]=await c.query('SELECT TABLE_NAME name FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()');
    let phase;
    if(existing.length){
      if(!existing.some(t=>t.name===stateTable))throw Error('Refusing to overwrite or adopt an existing target schema');
      const [state]=await c.query('SELECT * FROM '+ident(stateTable)+' WHERE id=1');
      if(state.length!==1||state[0].manifest_hash!==plan.manifestHash||state[0].scope!==plan.scope)throw Error('Target provenance differs from this export');
      phase=state[0].phase;
      if(phase==='creating')throw Error('An interrupted DDL setup needs a new empty isolated schema; no existing objects will be replaced');
      if(existing.length!==plan.manifest.tables.length+1||existing.some(t=>t.name!==stateTable&&!plan.manifest.tables.some(p=>p.name===t.name)))throw Error('Target table set changed');
      const fingerprints=[];for(const table of plan.manifest.tables){const [ddl]=await c.query('SHOW CREATE TABLE '+ident(table.name));fingerprints.push(ddl[0]['Create Table']);}
      if(schemaHash(fingerprints)!==state[0].schema_hash)throw Error('Target schema changed since setup');
      if(phase==='complete'){const verified=await verifyRows(c,plan.manifest);await verifyRelationships(c,plan.schema);return {scope:plan.scope,alreadyImported:true,verified};}
      if(phase!=='ready')throw Error('Unrecognised import phase');
      for(const table of plan.manifest.tables){const [n]=await c.query('SELECT COUNT(*) n FROM '+ident(table.name));if(BigInt(n[0].n))throw Error('Refusing a nonempty incomplete target');}
    }else{
      await c.query('CREATE TABLE '+ident(stateTable)+"(id BIGINT PRIMARY KEY,manifest_hash VARCHAR(64) NOT NULL,scope VARCHAR(16) NOT NULL,phase VARCHAR(16) NOT NULL,schema_hash VARCHAR(64)) ENGINE=InnoDB");
      await c.query('INSERT INTO '+ident(stateTable)+" VALUES(1,?,?,'creating',NULL)",[plan.manifestHash,plan.scope]);
      for(const table of plan.schema.tables)await c.query(table.sql);
      for(const fk of plan.schema.foreignKeys)await c.query(fk.sql);
      const fingerprints=[];for(const table of plan.manifest.tables){const [ddl]=await c.query('SHOW CREATE TABLE '+ident(table.name));fingerprints.push(ddl[0]['Create Table']);}
      await c.query('UPDATE '+ident(stateTable)+" SET phase='ready',schema_hash=? WHERE id=1",[schemaHash(fingerprints)]);
    }
    await c.query('SET SESSION FOREIGN_KEY_CHECKS=0');foreignKeysOff=true;await c.beginTransaction();inTransaction=true;
    for(const table of plan.manifest.tables){
      let batch=[],bytes=0;
      async function flush(){if(!batch.length)return;const placeholder='('+table.columns.map(()=>'?').join(',')+')';const [result]=await c.query('INSERT INTO '+ident(table.name)+' ('+table.columns.map(c=>ident(c.name)).join(',')+') VALUES '+batch.map(()=>placeholder).join(','),batch.flat());if(result.warningStatus)throw Error('Target import produced a warning; refusing possible data alteration');batch=[];bytes=0;}
      for await(const row of rows(join(plan.folder,table.dataFile))){const values=row.map(decodeCell),size=Buffer.byteLength(canonical(row));if(batch.length>=50||bytes+size>512000)await flush();batch.push(values);bytes+=size;}await flush();
    }
    await verifyRelationships(c,plan.schema);const verified=await verifyRows(c,plan.manifest);
    await c.query('UPDATE '+ident(stateTable)+" SET phase='complete' WHERE id=1");await c.commit();inTransaction=false;
    await c.query('SET SESSION FOREIGN_KEY_CHECKS=1');foreignKeysOff=false;
    return {scope:plan.scope,alreadyImported:false,verified};
  }finally{
    if(inTransaction)try{await c.rollback();}catch{/* unconfirmed commit requires provenance verification on a new connection */}
    if(foreignKeysOff)try{await c.query('SET SESSION FOREIGN_KEY_CHECKS=1');}catch{/* isolated connection is closed below */}
    if(locked)try{await c.query('SELECT RELEASE_LOCK(?)',['sqlite-migration:'+options.database]);}catch{/* connection close releases advisory lock */}
    await c.end();
  }
}
export async function main(args=process.argv.slice(2)) {
  const exportRoot=args[0];if(!exportRoot)throw Error('Usage: node scripts/mysql/migrate.mjs EXPORT_DIR [--plan NEW_OUTPUT_DIR | --execute-isolated]');
  const planIndex=args.indexOf('--plan'),execute=args.includes('--execute-isolated');if(planIndex<0&&!execute)throw Error('Choose --plan or --execute-isolated');
  const plans=await prepare(resolve(exportRoot),planIndex>=0?resolve(args[planIndex+1]):undefined);
  if(execute){const a=poolOptions(process.env,'results'),b=poolOptions(process.env,'students');if(a.host===b.host&&a.port===b.port&&a.database===b.database)throw Error('Results and students require distinct target schemas');
    const reports=[];for(const plan of plans)reports.push(await migrateScope(plan));console.log(JSON.stringify({isolatedImport:true,reports}));
  }else console.log(JSON.stringify({planOnly:true,scopes:plans.map(p=>({scope:p.scope,tables:p.manifest.tables.length,records:p.manifest.tables.reduce((n,t)=>n+t.rows,0)}))}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(JSON.stringify({migrationFailed:true,errorClass:error.name,code:/^[A-Z0-9_]+$/.test(error.code||'')?error.code:'MIGRATION_NOT_COMPLETED'}));process.exitCode=1;});
