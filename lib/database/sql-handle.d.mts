export type Row=Record<string,unknown>;
export type SqlChange={changes:number;lastInsertRowid:number};
export type SqlStatement={all(...params:unknown[]):Promise<Row[]>;get(...params:unknown[]):Promise<Row|undefined>;run(...params:unknown[]):Promise<SqlChange>};
export type SqlHandle={scope:'results'|'students';prepare(sql:string):SqlStatement;close():void};
export function createSqlHandles(stores:unknown):{results:SqlHandle;students:SqlHandle};
