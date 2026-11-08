/* eslint-disable @typescript-eslint/no-require-imports -- Standalone route verification using the existing TypeScript loader. */
const assert = require('node:assert/strict');
const { load } = require('./test-support/mysql-regression.cjs');

// Parsing never needs a database. Only authentication and its rate-limit write are
// stubbed; the route, bounded body reader, parser and error response are real.
const permissions = load('lib/learning/permissions.ts');
const security = load('lib/student/security.ts');
let allowed = true;
permissions.learningAdmin = async () => {
    if (!allowed) security.fail(403, 'Administrator access is required.');
    return { id: 'json-import-fixture', role: 'admin' };
};
security.rateLimit = async () => {};
const { POST } = load('app/api/admin/learning/[resource]/route.ts');
const { parseImport } = load('lib/learning/imports.ts');
const encode = text => Buffer.from(text).toString('base64');
async function request(text, filename = 'questions.json', raw = false) {
    return POST(new Request('http://localhost:3000/api/admin/learning/import', {
        method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
        body: raw ? text : JSON.stringify({ action: 'parse', filename, base64: encode(text) }),
    }), { params: Promise.resolve({ resource: 'import' }) });
}
(async () => {
    let groups = 0;
    for (const malformed of ['{', '[{"prompt":"Question",}]', '[', 'not json', '   ', '[{"prompt":"private-invalid-content"]']) {
        const response = await request(malformed);
        assert.equal(response.status, 400);
        assert.deepEqual(await response.json(), { error: 'Invalid JSON file. Check the JSON syntax and upload it again.' });
        assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    groups++;
    const rows = [{ prompt: 'Question', accepted: ['B'], options: [{ id: 'B', text: 'Answer' }] }];
    for (const prefix of ['', '\uFEFF']) {
        const response = await request(prefix + JSON.stringify(rows), 'QUESTIONS.JSON');
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { headers: ['prompt', 'accepted', 'options'], rows });
    }
    groups++;
    assert.deepEqual(await (await request('[]')).json(), { headers: [], rows: [] });
    for (const wrongShape of ['null', '{}', '123', '"text"', '[null]', '[[]]', '[1]', JSON.stringify(Array(1001).fill({}))]) {
        const response = await request(wrongShape);
        assert.equal(response.status, 400);
        assert.equal(typeof (await response.json()).error, 'string');
    }
    groups++;
    const response = await request('{', 'questions.json', true);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Invalid JSON.' });
    groups++;
    assert.throws(() => parseImport('large.json', encode(' '.repeat(4 * 1024 * 1024 + 1))), e => e.status === 413);
    assert.throws(() => parseImport('large.json', 'A'.repeat(6 * 1024 * 1024 + 1)), e => e.status === 413);
    groups++;
    assert.equal((await request('anything', 'questions.txt')).status, 400);
    assert.deepEqual(parseImport('questions.csv', encode('prompt,correct_answer\nQuestion,B')).rows, [{ prompt: 'Question', correct_answer: 'B' }]);
    groups++;
    allowed = false;
    assert.equal((await request('{')).status, 403);
    groups++;
    console.log(`PASS: ${groups} CMS JSON import regression groups (actual route/parser; no database access).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
