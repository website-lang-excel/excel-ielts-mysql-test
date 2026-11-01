// Shared direct-SQL adapter for server and operator CLI; no application rules live here.
import {translateSql,insertParts} from './sql-dialect.mjs';
import columns from './source-columns.json' with {type:'json'};
export function createSqlHandles(stores) {
    function connections() { return stores; }
    function normalized(row) { return row; }
    function conflict(error) { return error?.driverCode === 'ER_DUP_ENTRY'; }
    class MysqlStatement {
        scope;
        sql;
        constructor(scope, sql) {
            this.scope = scope;
            this.sql = sql;
        }
        async select(params) { const d = connections()[this.scope]; let sql = translateSql(this.sql); if (d.inTransaction() && !d.readOnlyTransaction() && !/\b(?:COUNT|SUM|GROUP BY|DISTINCT|UNION)\b/i.test(sql))
            sql += ' FOR UPDATE'; const data = await d.query(sql, params); return data.map(normalized); }
        async all(...params) { return this.select(params); }
        async get(...params) { return (await this.select(params))[0]; }
        async run(...params) {
            const d = connections()[this.scope];
            const execute = async () => {
                if (/^INSERT\s+(?:OR\s+IGNORE\s+)?INTO\b/i.test(this.sql)) {
                    const p = insertParts(this.sql, params, columns[this.scope]);
                    const ignore = /^INSERT\s+OR\s+IGNORE/i.test(this.sql), upsert = /^\s*ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE SET\s+([\s\S]+)$/i.exec(p.tail);
                    try {
                        const result = await d.query(translateSql(p.base), p.insertParams, { allowDuplicate: !!upsert || ignore });
                        return { changes: result.affectedRows, lastInsertRowid: Number(result.insertId) || 0 };
                    }
                    catch (error) {
                        if (!conflict(error))
                            throw error;
                        if (ignore)
                            return { changes: 0, lastInsertRowid: 0 };
                        if (!upsert)
                            throw error;
                        const bindings = p.bindings, keys = upsert[1].split(',').map((v) => v.trim()), where = keys.map((k) => '`' + k + '`=?').join(' AND '), values = keys.map((k) => bindings[k]);
                        const found = await d.query('SELECT 1 FROM `' + p.table + '` WHERE ' + where + ' FOR UPDATE', values);
                        if (!found.length)
                            throw error;
                        const replacements = [];
                        let extra = 0;
                        const set = upsert[2].replace(/excluded\.([A-Za-z_][A-Za-z0-9_]*)|\?/g, (_, name) => { replacements.push(name ? bindings[name] : p.updateParams[extra++]); return '?'; });
                        if (extra !== p.updateParams.length)
                            throw Error('UPSERT binding count mismatch');
                        const result = await d.query(translateSql('UPDATE `' + p.table + '` SET ' + set + ' WHERE ' + where), [...replacements, ...values]);
                        return { changes: result.affectedRows, lastInsertRowid: 0 };
                    }
                }
                const result = await d.query(translateSql(this.sql), params);
                return { changes: result.affectedRows, lastInsertRowid: Number(result.insertId) || 0 };
            };
            if (/ON CONFLICT|INSERT\s+OR\s+IGNORE/i.test(this.sql) && !d.inTransaction())
                return d.transaction(execute);
            return execute();
        }
    }
    class MysqlHandle {
        scope;
        constructor(scope) {
            this.scope = scope;
        }
        prepare(sql) { return new MysqlStatement(this.scope, sql); }
        close() { }
    }
    return { results: new MysqlHandle('results'), students: new MysqlHandle('students') };
}
