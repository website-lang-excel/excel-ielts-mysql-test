# Mock Test 24 local import

10 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock test 24.docx` after approval of the content, private keys, existing band conversion, and local test-ID constraint update. The owner explicitly approved Listening Q7 as 575 from the answer table despite its conflicting 175 explanation.

## Content and source handling

- Listening: four parts and 40 unique answer slots, using existing schedule/notes, table, map and matching controls. Data: `app/listening/listening-test-24.json`.
- Reading: Odonata (1–13), History of Fire Fighting and Prevention (14–26), and The Luddites (27–40). All 18 passage body paragraphs are preserved. Data: `app/test/test24-import.json`.
- The eight embedded Reading-question screenshots were transcribed into existing interactive matching, summary-with-clues, table, choice and truth controls. Screenshot website controls and decorative input-box images were not imported as candidate content. Summary Q7–13 stores the existing option letters, matching the supplied key.
- Writing: the supplied waste-disposal chart (2005–2008) and physical-exercise-in-cities essay prompt. Data: `app/test/writing/test24-writing.json`.
- Only two exact source images were added publicly: `public/images/listening-test-24-map.jpeg` (565 × 400) and `public/images/writing-test-24-task-1.jpeg` (1390 × 790). Keys, explanations and source inspection files remain private.
- Duplicated Listening source blocks and nested copied text were represented once, preserving the original question wording and 1–40 numbering. The original map instruction permits A–J while the supplied map shows A–I; the source instruction and map were retained without inventing a location.

## Integration and records

Test 24 is enabled locally in the Full Mock Test catalogue, test-ID/login/access validation, Listening mapping/dispatch, Reading dispatch, Writing prompts and admin selectors/readiness. Tests 25–40 remain empty inactive catalogue entries. The source uses the existing grouped renderers and components; Reading Q21–23 stores letters through the established option-value helper.

No timer, autosave/recovery, lease, authentication, audio-progress validation, scoring algorithm, submission, marking or release mechanism was changed. Existing test data and answer formats remain untouched.

Only the disposable loopback manual-acceptance results schema was changed. The two existing test-ID CHECK constraints were extended from 23 to 24 after a verified snapshot; all 11 table counts and full-record fingerprints remained identical. Backup: `private/mock-test-24-source/local-schema-1794294029761/`. The corresponding two portable schema definitions were extended; startup still does not provision/migrate storage.

Both 40-question keys were installed using the existing `saveConfig` helper, source word limits/alternatives and the owner-approved existing band table. Backup and readback evidence: `private/mock-test-24-source/key-backup-1794294031583/`. All non-audit records and other test keys retained their full-record fingerprints. No submitted Test 24 attempts existed, so no results were rescored. Standard private key revision/update audit entries were recorded.

## Verification

- Exactly 40 unique rendered Listening anchors and 40 Reading anchors, within their part/passage ranges.
- All 18 passage body paragraphs and both public image byte hashes match the source.
- All 44 affected legacy screens render identically before/after: 20 Listening parts (12/16/21/22/23) and 24 Reading passages (16–23). First 23 Writing entries and all previous Reading option conversions are unchanged.
- Both key configurations pass existing validation and exact database readback. Complete supplied answer sets score 40/40; every accepted alternative passes; blank and incorrect sets score zero. These checks verify transcription/configuration behavior, not an independent audit of the source answers.
- A separate fresh MySQL fixture passed Test 24 Reading/Writing save/restore, original one-hour deadlines, duplicate Start deadline preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational integrity. This fixture deliberately had no keys to verify pending-score behavior separately.
- All 81 existing regression groups passed: 16 Listening, 19 recovery, 13 leases, 23 autosave and 10 exam-client. Evidence: `private/regression-fix-20261108/run-1794294045515/summary.json`.
- TypeScript, full ESLint with zero warnings, whitespace checks and production build passed. The existing parent-directory lockfile warning remains unchanged.
- The local server restarted at `http://127.0.0.1:3307`. Live HTTP checks passed for catalogue links 1–24, inactive entries 25–40, the Test 24 login route and byte-identical map/chart delivery.

No recording is embedded. Its matching path is `public/audio/listening-test-24.mp3`; existing missing/invalid-recording rejection remains. No full-duration browser exam or matching-audio playback was performed.

No commit, push, deployment or production database change performed.
