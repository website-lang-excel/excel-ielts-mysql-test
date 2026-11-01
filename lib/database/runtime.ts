import 'server-only';
import {createMysqlStores,MysqlOperationError} from './mysql.mjs';
import {createSqlHandles} from './sql-handle.mjs';
type Scope='results'|'students';
export type Row=Record<string,unknown>;
type Stores=ReturnType<typeof createMysqlStores>;
const state=globalThis as typeof globalThis&{ieltsMysqlStores?:Stores;ieltsMysqlHandles?:ReturnType<typeof createSqlHandles>};
function connections(){if(process.env.DB_BACKEND!=='mysql')throw new MysqlOperationError('MYSQL_BACKEND_NOT_ENABLED');if(process.env.RAILWAY_ENVIRONMENT_NAME&&process.env.CLASSROOM_HTTP==='true')throw Error('CLASSROOM_HTTP must not be enabled on Railway.');return state.ieltsMysqlStores??=createMysqlStores({...process.env,MYSQL_NORMALIZE_NUMBERS:'true'});}
export function mysqlDatabase(scope:Scope){return (state.ieltsMysqlHandles??=createSqlHandles(connections()))[scope];}
export function mysqlTransaction<T>(scope:Scope,action:()=>T|Promise<T>):Promise<T>{return connections()[scope].transaction(action) as Promise<T>;}
export function mysqlReadSnapshot<T>(scope:Scope,action:()=>T|Promise<T>):Promise<T>{return connections()[scope].readSnapshot(action) as Promise<T>;}
export async function closeMysql(){const stores=state.ieltsMysqlStores;state.ieltsMysqlStores=undefined;state.ieltsMysqlHandles=undefined;if(stores)await stores.close();}
