import { createHash } from 'node:crypto';
export const ident=name=>{if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))throw Error('Unsupported identifier');return '`'+name+'`';};
const hash=s=>createHash('sha256').update(s).digest('hex');
export function checks(sql) {
  const result=[];let position=0;
  while(true){const match=/\bCHECK\s*\(/ig;match.lastIndex=position;const found=match.exec(sql);if(!found)break;let depth=1,quote=false,i=match.lastIndex;
    for(;i<sql.length&&depth;i++){if(sql[i]==="'"){if(quote&&sql[i+1]==="'"){i++;continue;}quote=!quote;}else if(!quote){if(sql[i]==='(')depth++;if(sql[i]===')')depth--;}}
    if(depth)throw Error('Unbalanced CHECK');result.push(sql.slice(match.lastIndex,i-1));position=i;
  }return result;
}
export function columnType(table,column) {
  const t=column.type.toUpperCase(),n=column.name;
  if(t==='INTEGER')return 'BIGINT';if(t==='REAL')return 'DOUBLE';if(t==='BLOB')return 'LONGBLOB';if(t!=='TEXT')throw Error('Unsupported SQLite declared type: '+t);
  // Audit targets also contain structured diagnostic context, not only UUIDs.
  if((table==='audit'||table==='learning_audit')&&n==='target_id')return 'LONGTEXT';
  if(n==='email')return 'VARCHAR(254)';
  if(n==='scope'||n==='account')return 'VARCHAR(512)';
  if(n==='token_hash'||n==='sha256')return 'VARCHAR(64)';
  if(n==='kind'||n==='status'||n==='difficulty'||n==='module'||n==='mode'||n==='purpose'||n==='skill'||n==='role'||n==='certainty'||n==='source'||n==='pending_section')return 'VARCHAR(32)';
  if(n==='stage')return 'VARCHAR(40)';
  if(n.endsWith('_at')||n==='test_date'||n==='expires_at')return 'VARCHAR(40)';
  if(n==='id'||n.endsWith('_id')||n==='registration_id'||n==='slug'||n==='disk_name'||n==='key'||table==='results_migrations'&&n==='name')return 'VARCHAR(191)';
  return 'LONGTEXT';
}
export function asciiLowerSql(expression){return [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].reduce((s,c)=>`REPLACE(${s},'${c}','${c.toLowerCase()}')`,expression);}
export function buildSchema(manifest) {
  if(manifest.objects.some(o=>!['table','index'].includes(o.type)))throw Error('Views or triggers need explicit migration support');
  const tables=[],foreignKeys=[],notes=[];
  for(const table of manifest.tables){
    const fields=table.columns.map(c=>{const type=columnType(table.name,c);let def=ident(c.name)+' '+type+(c.notnull||c.pk?' NOT NULL':' NULL');if(c.pk&&c.type.toUpperCase()==='INTEGER'&&table.primaryKey.length===1)def+=' AUTO_INCREMENT';if(c.dflt_value!==null){let val=c.dflt_value;if(!/^(?:-?\d+(?:\.\d+)?|'(?:[^']|'')*'|NULL)$/.test(val))throw Error('Unsupported default');def+=' DEFAULT '+(type==='LONGTEXT'?'('+val+')':val);}return def;});
    if(table.primaryKey.length)fields.push('PRIMARY KEY ('+table.primaryKey.map(ident).join(',')+')');
    const extras=[];
    if(table.name==='students')extras.push(ident('__email_ascii_nocase')+` VARCHAR(254) GENERATED ALWAYS AS (${asciiLowerSql(ident('email'))}) STORED`);
    for(const index of table.indexes){
      if(index.origin==='pk')continue;
      const cols=index.columns.filter(c=>c.key);if(cols.some(c=>c.cid<0))throw Error('Expression index needs explicit adaptation');
      if(index.partial){
        if(table.name!=='attempts'||index.name!=='active_assignment_attempt')throw Error('Unknown partial index');
        extras.push('`__active_assignment_id` VARCHAR(191) GENERATED ALWAYS AS (CASE WHEN `submitted_at` IS NULL THEN `assignment_id` ELSE NULL END) STORED');
        fields.push('UNIQUE KEY '+ident(index.name)+' (`__active_assignment_id`)');notes.push('Partial active-assignment index preserved with generated nullable unique key.');continue;
      }
      const name=index.name.startsWith('sqlite_')?'uq_'+hash(table.name+index.name).slice(0,16):index.name;
      fields.push((index.unique?'UNIQUE KEY ':'KEY ')+ident(name)+' ('+cols.map(c=>ident(table.name==='students'&&c.name==='email'?'__email_ascii_nocase':c.name)+(c.desc?' DESC':'')).join(',')+')');
    }
    for(const [i,expression] of checks(table.sql).entries())fields.push('CONSTRAINT '+ident('ck_'+hash(table.name+':'+i).slice(0,18))+' CHECK ('+expression.replace(/\b(open|count|key)\b/g,'`$1`')+')');
    fields.unshift(...extras);
    tables.push({name:table.name,sql:'CREATE TABLE '+ident(table.name)+' (\n  '+fields.join(',\n  ')+'\n) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_bin'});
    const groups=new Map();for(const fk of table.foreignKeys){if(!groups.has(fk.id))groups.set(fk.id,[]);groups.get(fk.id).push(fk);}
    for(const [id,parts] of groups){parts.sort((a,b)=>a.seq-b.seq);const fk=parts[0],actions=['NO ACTION','RESTRICT','CASCADE','SET NULL'];if(!actions.includes(fk.on_update)||!actions.includes(fk.on_delete))throw Error('Unsupported FK action');
      foreignKeys.push({table:table.name,parent:fk.table,columns:parts.map(p=>p.from),parentColumns:parts.map(p=>p.to),sql:'ALTER TABLE '+ident(table.name)+' ADD CONSTRAINT '+ident('fk_'+hash(table.name+':'+id).slice(0,18))+' FOREIGN KEY ('+parts.map(p=>ident(p.from)).join(',')+') REFERENCES '+ident(fk.table)+' ('+parts.map(p=>ident(p.to)).join(',')+') ON UPDATE '+fk.on_update+' ON DELETE '+fk.on_delete});
    }
    if(table.columns.some(c=>c.pk&&!c.notnull))notes.push(table.name+': MySQL primary keys enforce NOT NULL; export preflight rejects NULL primary keys rather than changing records.');
  }
  notes.push('VARCHAR limits are explicit migration bounds, not a claim that SQLite had these limits. Every exported string is checked; no silent truncation.');
  notes.push('JSON and UTC ISO timestamps retain original text; no native JSON reserialization or timezone conversion.');
  notes.push('Student email uniqueness uses ASCII-only lowercase generated key to preserve SQLite NOCASE; future runtime email lookup must use the same expression/key.');
  return {tables,foreignKeys,notes};
}
