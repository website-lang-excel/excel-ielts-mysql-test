# Mock Test 30 local import

10 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock test 30.docx` after approval of screenshot transcription, exact source-image crops, private answer keys, the existing band conversion and preservation of inactive test IDs.

## Content and source handling

- Listening: four parts and 40 unique answer slots, using existing form/notes, three-selection checkbox, radio, diagram-label and table controls. Data: `app/listening/listening-test-30.json`.
- Reading: The CT Scanner (1–13), Nineteenth-Century Paperback Literature (14–27), and Cosmic Black Holes (28–40). Screenshot text was transcribed into 20 body paragraphs plus three footnote blocks. Data: `app/test/test30-import.json`.
- Reading reuses existing draggable headings, multiple-answer choices, matching, sentence endings and truth controls. Section labels, Roman numerals, word limits, options, instructions and source spelling/footnotes are retained. The source's repeated event descriptions for options C and D are preserved rather than silently corrected. Supplied source keys are used as approved; this import does not independently certify their factual correctness.
- Writing: the National University degree charts (1995/2005/2015) and early foreign-language education essay prompt. Data: `app/test/writing/test30-writing.json`.
- Exactly two cropped PNG assets are public: `public/images/listening-test-30-map.png` (510 × 235) and `public/images/writing-test-30-task-1.png` (500 × 220). Both were visually inspected; decoded crop pixels exactly match the source screenshot rectangles. No resampling or AI redrawing was used. Rectangles and sources are recorded privately in `private/mock-test-30-source/crops.json`.
- Answer-key screenshot and private configurations are excluded from public assets/Git. Listening choices are keyed to the letters stored by the existing controls, and completion alternatives preserve the supplied optional forms. Reading headings store Roman numerals; matching/sentence endings store letters.

## Integration and records

Available IDs are 1–24, 27 and 30. Tests 25–26, 28–29 and 31–40 remain inactive. Test 30 is added to catalogue availability, login/access/API validation, Listening audio mapping/dispatch, Reading dispatch, Writing prompts and admin selectors/readiness. Empty Writing indexes for the skipped IDs are preserved; no fallback or invented prompts were introduced.

Existing renderers, components and design are reused. No timing, audio-progress validation, autosave/recovery, leases/authentication, scoring algorithms, submission, manual marking or result-release mechanisms were changed. Existing test content and legacy saved values were not migrated.

Only the disposable loopback manual-acceptance results schema was updated. Its two test-ID CHECK constraints were extended to permit exactly ID 30 alongside the existing 1–24 and 27. All 11 table counts and full-record fingerprints were unchanged. Verified private snapshot and original definitions: `private/mock-test-30-source/local-schema-1794301567812/`. The corresponding portable schema definitions were updated; startup still does not provision/migrate storage.

Both 40-rule keys were approved and installed via the existing `saveConfig` helper with the owner-approved existing band conversion. Backup/readback evidence: `private/mock-test-30-source/key-backup-1794301569262/`. All other test keys and non-audit records retained their full-record fingerprints. No submitted Test 30 attempts existed; no results were rescored. Standard private revision/update audit entries were recorded.

## Verification

- Exactly 40 unique rendered Listening anchors and 40 Reading anchors within their part/passage ranges.
- Transcribed paragraphs/footnotes match the saved private transcription, reviewed against the supplied images. This is manual screenshot transcription, not independent OCR certification. Both image crops preserve source pixels and were visually reviewed.
- All 58 affected existing screens render identically before/after: 28 Listening parts (12/16/21/22/23/24/27) and 30 Reading passages (16–24/27). Writing entries through index 26, including empty skipped indexes, and all previous Reading option conversions remain unchanged.
- Both installed configurations pass existing validation and exact readback. Supplied answer sets score 40/40, alternatives pass, blank/incorrect sets score zero, all valid multiple-answer permutations pass and duplicate credit is rejected. These checks verify key behavior, not independent correctness of supplied answers.
- A separate fresh MySQL fixture passed Reading/Writing draft save/restore, original one-hour deadlines, duplicate Start preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational integrity. It also verified database rejection of IDs 25/26/28/29. This separate fixture deliberately omitted keys to verify pending scoring independently of local installed keys.
- All 81 existing regression groups passed: 16 Listening, 19 recovery, 13 leases, 23 autosave and 10 exam-client. Evidence: `private/regression-fix-20261108/run-1794301584445/summary.json`.
- TypeScript, full ESLint with zero warnings, whitespace checks and production build passed. The existing parent-directory lockfile warning remains unchanged.
- Local site restarted at `http://127.0.0.1:3307`. Live HTTP checks confirmed catalogue links only for 1–24/27/30, Test 30 login and exact delivery of both cropped assets.

No recording is supplied. Its matching path is `public/audio/listening-test-30.mp3`; existing missing/invalid-recording rejection remains. No full-duration browser exam or matching-audio playback was performed.

No commit, push, deployment or production database change performed.
