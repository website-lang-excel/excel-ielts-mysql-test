# Mock Test 22 local import

9 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock test 22.docx`. The owner expressly authorized proceeding before the missing Reading matching option is supplied. No source wording, missing option, recording or replacement questions were invented.

## Content and remaining source issues

- Listening: four parts with 40 answer slots. Existing sentence completion, table, matching, flowchart, summary, choice and notes controls are used. Data: `app/listening/listening-test-22.json`.
- Reading: three passages with 40 answer slots and the source ranges 1–14, 15–27, 28–40. Titles: The Cacao: a Sweet History; Cosmetics in Ancient Past; The Secrets of Persuasion. Data: `app/test/test22-import.json`.
- Writing: the supplied UK marriages/divorces graph and fuel-cost/environment essay prompt. Data: `app/test/writing/test22-writing.json`; appended as the 22nd Writing entry. Chart: `public/images/writing-test-22-task-1.jpeg`, copied without alteration.
- The Word document's other two embedded images are answer-key screenshots. They remain under ignored private source storage and were not copied to public assets or candidate components. The owner subsequently approved provisioning both private keys; see the update below.
- Reading Q36–40: the owner supplied and explicitly approved the final option **E — Social Proof** on 9 November 2026. It has been appended to the existing A–D bank, so all five questions offer A–E through the unchanged matching controls. All other options and wording are preserved.
- Reading Q32–35 use TRUE/FALSE/NOT GIVEN in the paper, while the screenshot uses YES/NO/NOT GIVEN. The owner approved accepting YES/TRUE for Q32 and NO/FALSE for Q34 while preserving the controls. The site’s existing band conversion was approved for both keys.
- Existing Test 21 key clarification is untouched; no Test 21 key configuration was changed.

## Integration

Test 22 is enabled in the Full Mock Test catalogue and supported by login validation, access validation, API test-ID validation, Reading/Listening dispatch, Writing prompts, admin assignment/profile selection, key selection, result filters and readiness listing. IDs 23–40 remain empty inactive entries.

It reuses the existing grouped Reading and Listening shells, question components, navigation and persistence. Listening's new generic flow rendering copies the established flow style; letter-valued table handling additionally accepts Test 22's C/I/B source labels. Reading MCQ questions 28–31 save letters; chapter/paragraph matching and repeated category choices retain their established label values. No existing test data, question format or answer values were migrated.

No modifications to timers, deadlines, audio-progress validation, autosave/recovery scheduling, tab leases, authentication, exposure/assignment rules, submission, scoring algorithms, result release or manual Writing marking.

## Local database update

Only the disposable loopback manual-acceptance results schema was updated. Original table definitions/checks and a verified private portable data snapshot are at `private/mock-test-22-source/local-schema-1794220439812/`.

The existing CHECK constraints on `attempts.test_id` and `test_assignments.test_id` were extended from 21 to 22. All 11 tables retained identical counts and sorted full-record SHA-256 fingerprints before/after. The same two portable results-schema definitions were updated in `lib/database/source-schemas.json`; startup still does not initialize or migrate application storage. No production database, historical schema or old SQLite project was touched.

## Verification

- Exactly 40 Listening and 40 Reading answer anchors; all imported slots match their source passage/part ranges.
- All 25 passage body paragraphs preserved, including multi-paragraph chapters; Writing chart bytes match the source image.
- Before/after rendered HTML identical for all 12 Listening parts of Tests 12/16/21 and all 18 Reading passages of Tests 16–21 (30 affected legacy screens).
- First 21 Writing entries and all pre-existing Reading option conversions unchanged. Test 22 choices save letters; keys remain pending.
- Separate fresh MySQL fixture passed Test 22 Reading/Writing draft save/restore, original one-hour deadlines, duplicate Start deadline preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational/table integrity. No keys were inserted.

- All 81 existing regression groups passed (16 Listening, 19 recovery, 13 lease, 23 autosave and 10 exam-client groups). Evidence: `private/regression-fix-20261108/run-1794220523511/summary.json`.
- TypeScript, full ESLint and whitespace checks passed. The production build was generated and the local production server restarted successfully at `http://127.0.0.1:3307`.
- Live HTTP checks passed: catalogue links for Tests 1–22, inactive Tests 23–40, Test 22 login route and byte-identical Writing chart delivery.
- Component/API checks do not certify a full-duration browser exam or the correctness of unresolved source material. No full browser or matching-audio run was performed.

## Owner materials still needed

The missing Reading Q36–40 option and Q32–35 key-label mismatch are resolved with owner approval. No recording is embedded in the document: the matching audio file belongs at `public/audio/listening-test-22.mp3`. The existing production-mode missing-recording rejection remains in force.

## Approved local answer-key provisioning, 9 November 2026

Both Listening and Reading keys are approved and installed in the existing disposable local manual-acceptance database, using the existing `saveConfig` helper and band conversion. Each has 40 numbered rules, source word limits and explicitly supplied alternatives. No public key files or application mechanism changes were introduced.

Private backup and verification: `private/mock-test-22-source/key-backup-1794237994604/`. Both complete answer sets score 40/40; every accepted alternative passes, and blank/incorrect sets score zero. These checks verify transcription/configuration behavior, not an independent audit of the source answers. Database readback matches both approved configurations. All other answer keys and all existing non-audit records retained their full-record fingerprints. No existing Test 22 submissions were present, and no submissions were rescored. The standard private key revision/update audit entries were recorded. No production database changes or build/restart were required for key activation.

No commit, push, deployment or production database change performed.
