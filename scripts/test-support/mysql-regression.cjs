/* eslint-disable @typescript-eslint/no-require-imports -- Node-only isolated test fixture. */
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = process.cwd(), ts = require('typescript'), mysql = require('mysql2/promise'), { DatabaseSync } = require('node:sqlite');
const { poolOptions } = require('../../lib/database/mysql.mjs'), { buildSchema, ident } = require('../mysql/schema.mjs');
const cache = new Map(), pending = new Set();
let fixture, owner;
function track(p) { pending.add(p); p.then(() => pending.delete(p), () => pending.delete(p)); return p; }
async function drain() { for (let i = 0; i < 4; i++) {
    await new Promise(setImmediate);
    if (pending.size)
        await Promise.allSettled([...pending]);
} }
function load(file, jar) {
    file = path.resolve(root, file);
    if (cache.has(file))
        return cache.get(file).exports;
    if (!/\.tsx?$/.test(file))
        return Module.createRequire(file)(file);
    const mod = new Module(file);
    cache.set(file, mod);
    mod.filename = file;
    mod.paths = Module._nodeModulePaths(path.dirname(file));
    const native = Module.createRequire(file);
    mod.require = name => { if (name === 'server-only')
        return {}; if (name === 'next/headers')
        return { cookies: async () => jar }; if (name === 'next/navigation')
        return { redirect: destination => { throw Object.assign(Error('REDIRECT ' + destination), { destination }); } }; if (name.startsWith('.') || name.startsWith('@/')) {
        const p = name.startsWith('@/') ? path.resolve(root, name.slice(2)) : path.resolve(path.dirname(file), name);
        for (const candidate of [p, p + '.ts', p + '.tsx', p + '.mjs', p + '.json'])
            if (fs.existsSync(candidate) && fs.statSync(candidate).isFile())
                return /\.tsx?$/.test(candidate) ? load(candidate, jar) : native(candidate);
    } return native(name); };
    mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file);
    for (const key of Object.keys(mod.exports))
        if (typeof mod.exports[key] === 'function' && (file.includes(path.join('app', 'api')) || mod.exports[key].constructor.name === 'AsyncFunction')) {
            const original = mod.exports[key];
            mod.exports[key] = (...args) => track(Promise.resolve(original(...args)));
        }
    return mod.exports;
}
async function integrity() { const violations = []; for (const db of Object.values(fixture.schemas)) {
    const [tables] = await owner.query('SELECT TABLE_NAME n FROM information_schema.tables WHERE table_schema=?', [db]);
    for (const t of tables) {
        const [checked] = await owner.query('CHECK TABLE ' + ident(db) + '.' + ident(t.n));
        assert.ok(checked.every(r => r.Msg_type !== 'error'));
    }
    const [keys] = await owner.query('SELECT TABLE_NAME t,COLUMN_NAME c,REFERENCED_TABLE_NAME p,REFERENCED_COLUMN_NAME pc FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=? AND REFERENCED_TABLE_NAME IS NOT NULL', [db]);
    for (const k of keys) {
        const [bad] = await owner.query('SELECT COUNT(*) n FROM ' + ident(db) + '.' + ident(k.t) + ' c LEFT JOIN ' + ident(db) + '.' + ident(k.p) + ' p ON c.' + ident(k.c) + '=p.' + ident(k.pc) + ' WHERE c.' + ident(k.c) + ' IS NOT NULL AND p.' + ident(k.pc) + ' IS NULL');
        if (Number(bad[0].n))
            violations.push(k);
    }
} return violations; }
async function ready() {
    if (fixture)
        return fixture;
    if (process.env.MYSQL_REGRESSION_ISOLATED !== 'YES' || !process.env.MYSQL_REGRESSION_OWNER_FILE || !process.env.MYSQL_REGRESSION_APP_FILE)
        throw Error('Run through scripts/mysql/verify-regressions.mjs with explicit isolated local environment files.');
    const env = JSON.parse(fs.readFileSync(process.env.MYSQL_REGRESSION_OWNER_FILE)), app = JSON.parse(fs.readFileSync(process.env.MYSQL_REGRESSION_APP_FILE)), opts = poolOptions(env, 'results');
    if (opts.host !== '127.0.0.1' || opts.port !== 33326)
        throw Error('Regression tests refuse remote or unexpected MySQL endpoints');
    delete opts.database;
    for (const k of ['connectionLimit', 'maxIdle', 'idleTimeout', 'waitForConnections', 'queueLimit'])
        delete opts[k];
    owner = await mysql.createConnection(opts);
    const [identity] = await owner.query('SELECT @@datadir d,@@port p');
    if (!path.resolve(identity[0].d).startsWith(path.resolve(root, 'private') + path.sep))
        throw Error('Regression server must own a data directory inside this project private folder');
    for (const scope of ['results']) {
        const a = poolOptions(app, scope);
        if (a.host !== opts.host || a.port !== opts.port)
            throw Error('Application fixture must use the same isolated local server');
    }
    const id = crypto.randomBytes(6).toString('hex'), schemas = { results: 'reg_' + id + '_results_test' };
    fixture = { schemas, schemaVersion: 5 };
    const source = JSON.parse(fs.readFileSync(path.join(root, 'lib/database/source-schemas.json')));
    for (const scope of ['results']) {
        const sqlite = new DatabaseSync(':memory:');
        sqlite.exec(source[scope].ddl.join(';\n'));
        const tables = sqlite.prepare("SELECT name,sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(t => ({ ...t, columns: sqlite.prepare('PRAGMA table_info(' + JSON.stringify(t.name) + ')').all(), foreignKeys: sqlite.prepare('PRAGMA foreign_key_list(' + JSON.stringify(t.name) + ')').all(), indexes: sqlite.prepare('PRAGMA index_list(' + JSON.stringify(t.name) + ')').all().map(i => ({ ...i, columns: sqlite.prepare('PRAGMA index_xinfo(' + JSON.stringify(i.name) + ')').all() })) }));
        for (const table of tables)
            table.primaryKey = table.columns.filter(c => c.pk).sort((a, b) => a.pk - b.pk).map(c => c.name);
        const schema = buildSchema({ tables, objects: [] });
        sqlite.close();
        await owner.query('CREATE DATABASE ' + ident(schemas[scope]) + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_bin');
        await owner.query('USE ' + ident(schemas[scope]));
        for (const t of schema.tables)
            await owner.query(t.sql);
        for (const f of schema.foreignKeys)
            await owner.query(f.sql);
        const u = new URL(app.RESULTS_DATABASE_URL);
        if (!/^[a-zA-Z0-9_]+$/.test(u.username))
            throw Error('Unexpected fixture account');
        await owner.query('GRANT SELECT,INSERT,UPDATE,DELETE ON ' + ident(schemas[scope]) + ".* TO '" + u.username + "'@'127.0.0.1'");
    }
    for (const scope of ['results']) {
        const key = scope === 'results' ? 'RESULTS_DATABASE_URL' : 'STUDENT_DATABASE_URL', u = new URL(app[key]);
        u.pathname = '/' + schemas[scope];
        process.env[key] = u.href;
    }
    process.env.DB_BACKEND = 'mysql';
    process.env.MYSQL_TLS_MODE = 'disabled';
    await owner.query('USE ' + ident(schemas.results));
    return fixture;
}
async function close() { if (cache.has(path.join(root, 'lib/database/runtime.ts')))
    await load('lib/database/runtime.ts').closeMysql(); if (owner) {
    await owner.end();
    owner = null;
} }
module.exports = { load, ready: async () => { try {
        return await ready();
    }
    catch (error) {
        await close();
        throw error;
    } }, drain, close, integrity, executeResults: sql => owner.query(sql), get schemaVersion() { return fixture?.schemaVersion; } };
