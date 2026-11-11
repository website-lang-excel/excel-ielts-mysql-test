# Mock Test 21 local import

9 November 2026, Asia/Dhaka. Owner-approved import from `C:/Users/Asus/Downloads/mock test 21.docx`. The source file was read without modification. No online content, replacement questions, recording, answer keys or grades were invented.

## Imported content

- Listening: four parts, 40 answer slots, school excursion notes, nationality table, tour-company choices, office-plan matching, university timetable, style-guide diagram and parks completions. Data: `app/listening/listening-test-21.json`.
- Reading: three passages and 40 answer slots: Andrea Palladio (1–13), The future never dies? (14–26), and Pottery production in ancient Akrotiri (27–40). Data: `app/test/test21-import.json`.
- Writing: original urban-population chart prompt and young people's happiness essay prompt. Data: `app/test/writing/test21-writing.json`, appended to `writing-prompts.ts` without changing the first 20 entries.
- Four embedded source images copied without modification: `public/images/listening-test-21-office-plan.jpeg`, `listening-test-21-style-guide.jpeg`, `reading-test-21-volcano.png`, and `writing-test-21-task-1.jpeg`. The volcano image is retained within labelled paragraph D of Passage 2.

Original wording, including source spelling/grammar and spacing quirks, is preserved. Numbered blanks are represented using the existing renderer tokens. Test 21 Reading multiple-choice questions 26–28 and 39–40 save letters. Truth responses retain TRUE/FALSE/NOT GIVEN versus YES/NO/NOT GIVEN. Sentence endings reuse the existing drag/drop and select/place component; the timetable and office plan save option labels.

## Integration and protection

Test 21 is enabled in the Full Mock Test catalogue, login selection, test access, API ID validation, Reading/Listening dispatch, Writing selection, admin assignment/profile selectors, keys, results filtering and readiness listing. IDs 22–40 remain empty inactive entries.

Existing Reading and Listening grouped renderers gained Test 21 data mappings. The style-guide diagram and letter-valued timetable branches apply only to the new content. Reading gained optional per-passage instructions/images; existing data has neither property and its rendered output is preserved.

No changes to lifecycle timing, autosave scheduling, request/recovery handling, leases, authentication, exposure policies, audio-duration validation, scoring algorithms, result release or marking. No existing question content, media or keys were replaced. No configuration was saved through the key-rescoring API.

## Local database update

Only the disposable loopback manual-acceptance results schema was altered. A private verified portable results snapshot and the original MySQL table definitions/checks were saved under `private/mock-test-21-source/local-schema-1794218867123/`. The two existing test-ID CHECK constraints on `attempts` and `test_assignments` were extended from 20 to 21. All 11 application tables retained identical row counts and sorted full-record SHA-256 fingerprints before/after.

The results portion of `lib/database/source-schemas.json` has the same two constraint updates for future isolated schema creation and portable backup compatibility. Application startup still does not migrate or initialize schemas. Production/Railway databases and historical isolated schemas were not altered. Production deployment will require separately authorized, backed-up constraint changes at the approved destination.

## Verification

- Exactly 40 unique Listening and 40 unique Reading answer anchors, with passage ranges 1–13, 14–26 and 27–40.
- All 26 source passage body paragraphs and all four source image hashes preserved.
- Before/after rendered HTML identical for all 8 Listening parts of Tests 12/16 and all 15 Reading passages of Tests 16–20 (23 affected legacy screens). All first 20 Writing entries and legacy option conversions unchanged.
- New Reading choices save letters. Missing keys retain pending marks.
- Five existing MySQL regression runners passed: Listening 16, recovery 19, leases 13, autosave 23, client recovery 10 groups (81 total).
- Separate fresh MySQL fixture: Test 21 Reading draft save/restore, Writing Task 1/2 draft save/restore, unchanged one-hour deadlines, duplicate Start deadline preservation, wrong-tab rejection, independent full/module attempts, no Test 21 keys inserted, missing-recording rejection and relational/table integrity passed.
- TypeScript and full ESLint with zero warnings passed. Diff whitespace checks passed.

- Production build passed. The existing parent-directory lockfile warning remains; project configuration was not changed for it.
- The local website was restarted on `http://127.0.0.1:3307`. Live HTTP checks passed for the enabled Test 21 catalogue link, selected Test 21 candidate login, all four exact image assets, authenticated empty Listening/Reading key configurations, readiness page and role-specific logout. Catalogue IDs 22–40 remain inactive.

Real-browser/full-duration examination and recording-content verification are not certified by component/API fixtures.

## Pending owner materials

The catalogue entry is active as requested. The Listening recording is still absent: add the matching recording at `public/audio/listening-test-21.mp3`. In production-mode local startup, the existing server rejects starting Listening while this file is missing or invalid. That protection was not bypassed.

The owner subsequently supplied and approved both private Listening/Reading keys and use of the site's existing band conversion. Both keys are now active in the disposable local manual-acceptance database. Writing continues to use the existing manual-marking process.

## Approved local key provisioning, 9 November 2026

Installed all 40 Listening and 40 Reading rules through the existing `saveConfig` helper, preserving source word limits and supplied optional-word/plural/alternative forms. Reading Q12 uses the expressly approved three-word apostrophe form. Keys and source answers remain private; no candidate UI, content, scoring mechanism or shared behavior was changed.

Private backup and verification: `private/mock-test-21-source/key-backup-1794238421454/`. Both answer sets score 40/40, every accepted alternative passes, and blank/incorrect answer sets score zero. Configuration readback matches both installed keys. These checks verify configuration behavior, not independent correctness of the supplied source. All other keys (including Test 22) and all existing non-audit records retained full-record fingerprints. No submitted Test 21 attempts were present; no submissions were rescored. Standard private key audit entries were recorded. No build, deployment or production database update was required.

No Git commit, push, production deployment or production database change performed.
