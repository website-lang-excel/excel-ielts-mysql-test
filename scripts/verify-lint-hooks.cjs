/* eslint-disable @typescript-eslint/no-require-imports -- Isolated deterministic hook verification. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const file = 'lib/results/client.ts';
const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
const declaration = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'useDraftAutosave');
assert.ok(declaration);
const refs = [], dependencies = new Map();
let cursor = 0, layout = [], passive = [], config, schedulers = 0;
function effect(queue, fn, deps) {
    const slot = cursor++, previous = dependencies.get(slot);
    if (!previous || deps.some((value, index) => !Object.is(value, previous[index])))
        queue.push(() => { dependencies.set(slot, deps); fn(); });
}
const context = {
    exports: {}, useRef: initial => { const slot = cursor++; return refs[slot] ?? (refs[slot] = { current: initial }); },
    useLayoutEffect: (fn, deps) => effect(layout, fn, deps), useEffect: (fn, deps) => effect(passive, fn, deps),
    createSaveScheduler: options => { config = options; schedulers++; return { tick() {}, resume() {}, changed() {}, stop() {} }; },
    captureDraft() {}, announceSave() {}, draftKey: () => 'fixture', localDrafts: new Map(),
    sessionStorage: { getItem: () => null }, RequestError: class extends Error {}, retryable: () => true,
    window: { setInterval: () => 1, clearInterval() {}, addEventListener() {}, removeEventListener() {} },
};
vm.runInNewContext(ts.transpileModule(declaration.getText(source), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const save = async () => {}, onError = () => {}, onSaved = () => {};
function render(value) { cursor = 0; layout = []; passive = []; context.exports.useDraftAutosave(1, 'reading', value, true, save, onError, onSaved); }
function commit() { for (const fn of layout) fn(); for (const fn of passive) fn(); }
render({ 1: 'A' }); commit();
assert.equal(schedulers, 1);
assert.equal(config.snapshot().value[1], 'A');
render({ 1: 'B' });
assert.equal(config.snapshot().value[1], 'A', 'An uncommitted render must not alter the active scheduler snapshot');
commit();
assert.equal(config.snapshot().value[1], 'B', 'Commit makes the latest answers visible before passive work');
assert.equal(schedulers, 1, 'Typing must not restart the save scheduler');
render({ 1: 'discarded' });
assert.equal(config.snapshot().value[1], 'B', 'Discarded render keeps the last committed answer');
render({ 1: 'C' }); commit();
assert.equal(config.snapshot().value[1], 'C');
assert.equal(schedulers, 1);
console.log('PASS: commit-phase autosave refs preserve current answers, ignore uncommitted renders and retain the existing scheduler.');
