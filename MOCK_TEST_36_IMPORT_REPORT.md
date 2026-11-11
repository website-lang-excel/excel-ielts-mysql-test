# Mock Test 36 local import

10 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock test 36.docx` after approval of the content, lossless chart crop, private keys and existing band conversion. The owner specifically approved clearing the prefilled “Manchester” response from Listening Q16; the candidate sees an empty field and the supplied key is private.

## Content

- Listening: four parts with 40 unique answer slots, using existing forms/notes, radio, multiple-selection, matching and table controls. Data: `app/listening/listening-test-36.json`.
- Reading: Candle Making in Colonial America (1–14), Caffeine (15–27), and Animal Camouflage (28–40). Screenshot text was transcribed into 29 body paragraphs and three footnote blocks. Data: `app/test/test36-import.json`.
- Reading reuses existing choice, matching, truth and summary-without-clues controls. Source wording and answer values were retained apart from the expressly approved Q16 clearing. Transcription checks do not independently certify the correctness of the source answers or factual claims.
- Writing: household Internet access (2011–2016) and children’s limited experience of nature. Data: `app/test/writing/test36-writing.json`.
- The only public image is `public/images/writing-test-36-task-1.png` (275 × 195). The crop was visually reviewed, and its decoded pixels exactly match the source rectangle. No resampling or AI redrawing was used. Rectangle/source evidence: `private/mock-test-36-source/crop.json`.
- Keys, full source screenshots, backups and private configurations remain outside public assets and Git. The existing two-word limit is retained for Listening Q36's calendar answer; no general word-count/scoring behavior was changed.

## Integration and records

Available IDs are 1–24, 27, 30, 33 and 36. All skipped IDs remain inactive. Test 36 is added to catalogue availability, login/access/API validation, audio mapping/dispatch, Reading dispatch, Writing prompts and admin selectors/readiness. Writing indexes 34–35 remain explicitly empty. No fallback test or fabricated skipped-test content is introduced.

Existing design, renderers, controls and exam mechanisms are reused. No timers, autosave/recovery schedules, audio-progress rules, leases/authentication, scoring algorithms, submission, manual marking or result-release behavior changed. Existing test data and legacy saved values were not migrated.

Only the disposable loopback manual-acceptance results schema was updated. Its two test-ID CHECK constraints now additionally permit exactly ID 36, preserving skipped-ID exclusions. All 11 table counts and full-record fingerprints were unchanged. Verified snapshot and original definitions: `private/mock-test-36-source/local-schema-1794328182627/`. Corresponding portable definitions were updated; startup still does not provision/migrate storage.

Both 40-rule keys were approved and installed via the existing `saveConfig` helper with source word limits and the approved existing band conversion. Backup/readback evidence: `private/mock-test-36-source/key-backup-1794328184013/`. All other keys and all non-audit records retained full-record fingerprints. No submitted Test 36 attempts existed; no results were rescored. Standard private key audit entries were recorded.

## Verification

- Exactly 40 unique rendered Listening anchors and 40 Reading anchors within their respective ranges. An explicit check confirms the approved Q16 field exists and the prefilled response is absent.
- All transcribed paragraphs/footnotes match the saved private transcription, reviewed against source images. This is manual screenshot transcription, not independent OCR certification. Chart crop pixels match the source and were visually reviewed.
- All 72 affected legacy screens render identically before/after: 36 Listening parts (12/16/21/22/23/24/27/30/33) and 36 Reading passages (16–24/27/30/33). Writing entries through index 32, including skipped indexes, and all previous Reading option conversions are unchanged.
- Both approved key configurations pass validation and exact database readback. Complete supplied answer sets score 40/40, alternatives pass, blank/incorrect sets score zero, valid multiple-answer permutations pass and duplicate credit is rejected. These checks verify key behavior, not independent correctness of supplied answers.
- A separate fresh MySQL fixture passed Reading/Writing draft save/restore, original one-hour deadlines, duplicate Start preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational integrity. It also verified rejection of skipped IDs 25/26/28/29/31/32/34/35. This fixture deliberately omitted keys to verify pending scoring separately from the installed local keys.
- All 81 existing regression groups passed: 16 Listening, 19 recovery, 13 leases, 23 autosave and 10 exam-client. Evidence: `private/regression-fix-20261108/run-1794328204451/summary.json`.
- TypeScript, full ESLint with zero warnings, whitespace checks and production build passed. The existing parent-directory lockfile warning remains unchanged.
- The local server restarted at `http://127.0.0.1:3307`. Live HTTP checks passed for the approved catalogue links, inactive skipped IDs, Test 36 login and exact chart delivery.

No recording is supplied. Its matching path is `public/audio/listening-test-36.mp3`; existing production-mode missing/invalid-recording rejection remains. No full-duration browser examination or matching-audio playback was performed.

No commit, push, deployment or production database change performed.
