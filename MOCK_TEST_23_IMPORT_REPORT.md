# Mock Test 23 local import

10 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock test 23.docx` after approval of the import, private answer keys, existing band conversion and local test-ID constraint update.

## Content

- Listening: four parts and 40 unique answer slots; existing form/notes, three-choice multiple selection, short answer, matching, radio and table controls. Data: `app/listening/listening-test-23.json`.
- Reading: Bondi Beach (1–13), Antarctica – in from the cold? (14–26), and Talc Powder (27–40). All 23 passage body paragraphs are preserved. Data: `app/test/test23-import.json`.
- Writing: the supplied overseas-visitor chart (1987–2007) and social-media/face-to-face-contact essay prompt. Data: `app/test/writing/test23-writing.json`. The source chart is copied unchanged to `public/images/writing-test-23-task-1.jpeg` (1225 × 595).
- Both embedded answer-key screenshots remain private, outside public assets and Git. The supplied keys were transcribed into 40 approved rules per skill, with source word limits, optional forms and the owner-approved existing band conversion. Listening Q8–10 is one existing unordered group; duplicate answers cannot earn duplicate credit.
- Source wording and supplied answers were retained. The source Passage 2 introductory time guidance refers to Q14–27, but its actual questions are Q14–26; the source also describes “seven paragraphs A–F” while supplying six. These wording inconsistencies were not silently rewritten. Verification is of source preservation and key behavior, not an independent answer audit.

## Integration and preservation

Test 23 is enabled in the Full Mock Test catalogue and added to existing test-ID/login/access validation, Listening audio mapping and dispatch, Reading dispatch, Writing prompts and admin selectors/readiness. Tests 24–40 remain empty inactive catalogue entries.

Existing grouped renderers and controls are reused. New Reading choices Q22–26 save letters. No new question mechanism, font, layout, timer, audio policy, autosave/recovery schedule, lease/authentication policy, scoring algorithm, submission flow or result-release behavior was introduced. Existing test content was not migrated.

Only the disposable loopback manual-acceptance results schema was updated. Its two test-ID CHECK constraints were extended from 22 to 23 after a verified private snapshot; all 11 table fingerprints/counts remained identical. Backup: `private/mock-test-23-source/local-schema-1794290643321/`. The corresponding two portable schema definitions were updated; startup still does not provision/migrate application storage.

Both keys were installed with the existing private `saveConfig` helper. Backup and exact readback evidence: `private/mock-test-23-source/key-backup-1794290644948/`. All non-audit records and other keys, including Tests 21 and 22, retained their full-record fingerprints. No submitted Test 23 attempts existed, so no results were rescored. Standard private revision/update audit entries were recorded.

## Verification

- Exactly 40 unique rendered Listening anchors and 40 Reading anchors, matching source part/passage ranges.
- All 23 passage paragraphs and Writing chart bytes match their source.
- All 37 affected legacy screens render identically before/after: 16 Listening parts (12/16/21/22) and 21 Reading passages (16–22). First 22 Writing entries and all previous Reading option conversions are unchanged.
- Both approved key configurations pass existing validation and exact database readback. Complete supplied answer sets score 40/40; accepted alternatives pass; blank/incorrect sets score zero. Listening Q8–10 passes all six valid permutations and rejects duplicate credit.
- A separate fresh MySQL fixture passed Test 23 Reading/Writing save/restore, original one-hour deadlines, duplicate Start deadline preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational integrity. Keys were deliberately absent in this separate fixture to verify pending scoring independently of the installed local keys.
- All 81 existing regression groups passed: 16 Listening, 19 recovery, 13 lease, 23 autosave and 10 exam-client. Evidence: `private/regression-fix-20261108/run-1794290654836/summary.json`.
- TypeScript, full ESLint with zero warnings, whitespace checks and production build passed. The local site restarted successfully at `http://127.0.0.1:3307`. Live HTTP checks confirmed catalogue links 1–23, inactive entries 24–40, the Test 23 login route and byte-identical chart delivery. The existing parent-directory lockfile warning remains unchanged.

No recording is embedded: the matching file belongs at `public/audio/listening-test-23.mp3`. Existing production-mode missing/invalid-audio rejection remains in force. No full-duration browser examination or matching-audio playback was performed.

No commit, push, deployment or production database change performed.
