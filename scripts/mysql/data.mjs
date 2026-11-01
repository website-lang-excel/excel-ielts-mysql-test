import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { columnType } from './schema.mjs';
export const canonical=row=>JSON.stringify(row)+'\n';
export function decodeCell([kind,value]) {
  if(kind==='null'&&value===null)return null;
  if(kind==='text'&&typeof value==='string')return value;
  if(kind==='integer'&&/^-?\d+$/.test(value))return BigInt(value).toString();
  if(kind==='real'&&/^[0-9a-f]{16}$/.test(value)){const n=Buffer.from(value,'hex').readDoubleBE();if(!Number.isFinite(n))throw Error('Nonfinite REAL cannot be migrated');return n;}
  if(kind==='blob'&&typeof value==='string')return Buffer.from(value,'base64');
  throw Error('Invalid tagged export value');
}
export function mysqlCell(value,column) {
  if(value===null)return ['null',null];
  switch(column.type.toUpperCase()) {
    case 'INTEGER':return ['integer',BigInt(value).toString()];
    case 'REAL':{const b=Buffer.alloc(8);b.writeDoubleBE(Number(value));return ['real',b.toString('hex')];}
    case 'BLOB':return ['blob',Buffer.from(value).toString('base64')];
    case 'TEXT':if(typeof value!=='string')throw Error('Unexpected MySQL text conversion');return ['text',value];
    default:throw Error('Unsupported type');
  }
}
export async function* rows(path) {const input=createReadStream(path,{encoding:'utf8'});const lines=createInterface({input,crlfDelay:Infinity});try{for await(const line of lines){if(line)yield JSON.parse(line);}}finally{lines.close();input.destroy();}}
export async function validateExport(table,path) {
  let count=0;const digest=createHash('sha256');
  for await(const row of rows(path)){
    if(!Array.isArray(row)||row.length!==table.columns.length)throw Error('Export row width mismatch: '+table.name);
    for(let i=0;i<row.length;i++){
      const c=table.columns[i],cell=row[i],type=columnType(table.name,c),kind=cell[0];decodeCell(cell);
      if(kind==='null'){if(c.notnull||c.pk)throw Error('NULL in required target column: '+table.name+'.'+c.name);continue;}
      const expected={INTEGER:'integer',REAL:'real',TEXT:'text',BLOB:'blob'}[c.type.toUpperCase()];
      if(kind!==expected)throw Error('SQLite dynamic type needs explicit review: '+table.name+'.'+c.name);
      const length=/^VARCHAR\((\d+)\)$/.exec(type);if(length&&[...cell[1]].length>Number(length[1]))throw Error('Value exceeds explicit target bound: '+table.name+'.'+c.name);
    }
    digest.update(canonical(row));count++;
  }
  if(count!==table.rows||digest.digest('hex')!==table.sha256)throw Error('Export count/hash mismatch: '+table.name);
  return count;
}
