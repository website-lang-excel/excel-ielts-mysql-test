import {asciiLowerSql} from '../../scripts/mysql/schema.mjs';
export function splitSqlArgs(value) {const out=[];let start=0,depth=0,quote=false;for(let i=0;i<value.length;i++){const ch=value[i];if(ch==="'"){if(quote&&value[i+1]==="'"){i++;continue;}quote=!quote;}else if(!quote){if(ch==='(')depth++;else if(ch===')')depth--;else if(ch===','&&!depth){out.push(value.slice(start,i).trim());start=i+1;}}}out.push(value.slice(start).trim());return out;}
function functions(sql,convert){let out='';for(let i=0;i<sql.length;){if(sql[i]==="'"){let j=i+1;for(;j<sql.length;j++)if(sql[j]==="'"){if(sql[j+1]==="'"){j++;continue;}break;}out+=sql.slice(i,j+1);i=j+1;continue;}const found=/^([A-Za-z_][A-Za-z0-9_]*)\s*\(/.exec(sql.slice(i));if(found){let j=i+found[0].length,depth=1,quote=false;for(;j<sql.length&&depth;j++){if(sql[j]==="'"){if(quote&&sql[j+1]==="'"){j++;continue;}quote=!quote;}else if(!quote){if(sql[j]==='(')depth++;if(sql[j]===')')depth--;}}if(depth)throw Error('Unbalanced SQL function');const inside=functions(sql.slice(i+found[0].length,j-1),convert);out+=convert(found[1],splitSqlArgs(inside))??(found[1]+'('+inside+')');i=j;}else out+=sql[i++];}return out;}
function moment(args){let result=args[0]==="'now'"?'UTC_TIMESTAMP()':`STR_TO_DATE(LEFT(REPLACE(${args[0]},'T',' '),19),'%Y-%m-%d %H:%i:%s')`;for(const a of args.slice(1)){const m=/^'([+-]?\d+) (hours|days)'$/.exec(a);if(!m)throw Error('Unsupported date modifier');result=`DATE_ADD(${result},INTERVAL ${Number(m[1])} ${m[2]==='hours'?'HOUR':'DAY'})`;}return result;}
export function translateSql(sql) {
 let value=sql.replace(/u\.name\s*\|\|\s*' '\s*\|\|\s*u\.registration_id/gi,"CONCAT(u.name,' ',u.registration_id)");
 value=functions(value,(name,args)=>{switch(name.toLowerCase()){
  case 'json_extract':return `(JSON_UNQUOTE(JSON_EXTRACT(${args.join(',')})) COLLATE utf8mb4_0900_bin)`;
  case 'json_type':return asciiLowerSql(`(JSON_TYPE(JSON_EXTRACT(${args.join(',')})) COLLATE utf8mb4_0900_bin)`);
  case 'lower':return asciiLowerSql(args[0]);
  case 'date':return 'DATE('+moment(args)+')';
  case 'datetime':return "DATE_FORMAT("+moment(args)+",'%Y-%m-%d %H:%i:%s')";
  case 'strftime':if(args[0]!=="'%Y-%m-%d'")throw Error('Unsupported date format');return "DATE_FORMAT("+moment(args.slice(1))+",'%Y-%m-%d')";
  default:return undefined;
 }});
 // All current LIKE operands are a column and a bound parameter or literal.
 value=value.replace(/\b([A-Za-z_][\w.]*)\s+LIKE\s+(\?|'(?:[^']|'')*')/gi,(_,a,b)=>`${asciiLowerSql(a)} LIKE ${asciiLowerSql(b)} ESCAPE ''`);
 value=value.replace(/\bkey\b(?=\s*(?:=|,|FROM))/gi,'`key`');
 // Preserve the SQLite ASCII NOCASE email column's equality semantics.
 if(/\bFROM\s+students\b/i.test(value))value=value.replace(/\bemail\s*=\s*\?/gi,'__email_ascii_nocase='+asciiLowerSql('?'));
 return value;
}
export function insertParts(sql,params,columnNames) {
 const match=/^INSERT\s+(?:OR\s+IGNORE\s+)?INTO\s+([\w]+)\s*(?:\(([^)]*)\))?\s*VALUES\s*\(/i.exec(sql.trim());if(!match)throw Error('Unsupported INSERT form');
 const table=match[1],columns=match[2]?match[2].split(',').map(s=>s.trim().replaceAll('`','')):columnNames[table];if(!columns)throw Error('Unknown INSERT table');
 let depth=1,quote=false,end=match[0].length;for(;end<sql.trim().length&&depth;end++){const ch=sql.trim()[end];if(ch==="'"){if(quote&&sql.trim()[end+1]==="'"){end++;continue;}quote=!quote;}else if(!quote){if(ch==='(')depth++;if(ch===')')depth--;}}
 const values=splitSqlArgs(sql.trim().slice(match[0].length,end-1));if(values.length!==columns.length)throw Error('INSERT column/value mismatch');let i=0;/** @type {Record<string,unknown>} */ const bindings={};for(let n=0;n<values.length;n++){const v=values[n];if(v==='?')bindings[columns[n]]=params[i++];else if(/^NULL$/i.test(v))bindings[columns[n]]=null;else if(/^'/.test(v))bindings[columns[n]]=v.slice(1,-1).replaceAll("''","'");else if(/^-?\d+(?:\.\d+)?$/.test(v))bindings[columns[n]]=Number(v);else throw Error('Unsupported INSERT value');}
 const tail=sql.trim().slice(end),base='INSERT INTO `'+table+'` ('+columns.map(s=>'`'+s+'`').join(',')+') VALUES ('+values.join(',')+')';
 return {table,columns,bindings,base,tail,insertParams:params.slice(0,i),updateParams:params.slice(i)};
}
