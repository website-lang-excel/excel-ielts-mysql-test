# Mock Test 27 local import

10 November 2026, Asia/Dhaka. Imported from the owner-supplied `C:/Users/Asus/Downloads/mock 27.docx` after approval of the content, private answer keys, existing band conversion and preservation of inactive Tests 25–26. The owner supplied the cropped Reading Q20 separately: “People with dysgraphia have difficulty with math.” The Writing Task 1 prompt was approved to use 1970–2000, matching the chart rather than the source prompt's 2015.

## Content

- Listening: four parts and 40 answer slots, transcribed from the supplied screenshots into existing table, notes, checkbox and radio controls. Data: `app/listening/listening-test-27.json`.
- Reading: The Vikings’ Wayfaring Ways (1–13), Dyslexia (14–26), and Catastrophe Theory (27–40). All 25 passage body paragraphs are preserved. Data: `app/test/test27-import.json`.
- The supplied question screenshots are transcribed into existing short-answer, summary-with-clues, truth, multiple-choice and paragraph-information controls. Screenshot website controls are excluded. The separately supplied Q20 is included exactly.
- Writing: the supplied crime chart and teacher-versus-other-sources essay prompt, using `app/test/writing/test27-writing.json`. Only the original chart is public: `public/images/writing-test-27-task-1.jpeg` (1390 × 693). It is copied byte-for-byte, without alteration. Source wording is otherwise preserved, including its grammar and original heading ranges.
- Both key screenshots and all private answer configurations remain outside public assets and Git. Listening text answers for choice groups are translated to the letters stored by the existing controls. Reading summary answers likewise retain the existing letter contract.

## Integration and preservation

Available mock IDs are 1–24 and 27. Tests 25–26 and 28–40 remain inactive. Test 27 is added to catalogue availability, login/access/API validation, Listening audio mapping and dispatch, Reading dispatch, Writing prompts and admin selectors/readiness. IDs 25–26 are excluded from validation/selectors. Writing indexes 25–26 are explicitly empty so Test 27 remains at index 26 without fabricated prompts or fallback content.

Existing grouped renderers, styles and controls are reused. Reading letter-value mapping is added only for Test 27 choices. No timers, autosave/recovery scheduling, lease/authentication rules, audio-progress validation, scoring algorithm, submission, manual marking or result-release behavior was changed. No existing test content or legacy answer values were migrated.

Only the disposable loopback manual-acceptance results schema was updated. Its two existing test-ID CHECK constraints now permit 1–24 or exactly 27, excluding 25–26. All 11 table counts and full-record fingerprints remained unchanged. A verified snapshot and original definitions are private at `private/mock-test-27-source/local-schema-1794300783477/`. Corresponding portable definitions were updated; startup still does not provision or migrate storage.

Both keys were installed through the existing `saveConfig` helper, with all 40 rules per skill, source word limits and the approved existing band conversion. Backup/readback evidence: `private/mock-test-27-source/key-backup-1794300784883/`. All other keys and all existing non-audit records retained full-record fingerprints. There were no submitted Test 27 attempts; no results were rescored. Standard private key audit entries were recorded.

## Verification

- Exactly 40 unique rendered Listening anchors and 40 Reading anchors within the correct ranges; Q20 matches the owner's continuation screenshot.
- All 25 passage paragraphs and the Writing chart bytes match the source. First 24 Writing entries and all existing Reading option conversions are unchanged.
- All 51 affected legacy screens render identically before/after: 24 Listening parts (12/16/21/22/23/24) and 27 Reading passages (16–24).
- Both approved key configurations pass validation and exact database readback. Supplied answer sets score 40/40; all alternatives pass; blank/incorrect sets score zero. All permutations of Listening groups 11–15 and 21–24, and Reading groups 21–23 and 24–26, pass. Duplicate selections cannot earn duplicate credit. These checks verify configuration behavior, not an independent audit of source correctness.
- A fresh separate MySQL fixture passed Reading/Writing draft save/restore, original one-hour deadlines, duplicate Start preservation, wrong-tab rejection, full/module isolation, missing-audio rejection and relational integrity. It also verified database rejection of Test 25/26 assignments. This separate fixture deliberately had no keys to verify pending scoring independently of installed local keys.
- All 81 existing regression groups passed: 16 Listening, 19 recovery, 13 leases, 23 autosave and 10 exam-client. Evidence: `private/regression-fix-20261108/run-1794300794886/summary.json`.
- TypeScript, full ESLint with zero warnings, whitespace checks and production build passed. The existing parent-directory lockfile warning remains unchanged.
- The local site restarted at `http://127.0.0.1:3307`. Live HTTP checks confirmed catalogue links only for 1–24 and 27, the Test 27 login route and byte-identical chart delivery.

No recording is supplied. Its matching path is `public/audio/listening-test-27.mp3`; existing production-mode missing/invalid-recording rejection remains. No full-duration browser examination or matching-audio playback was performed.

No commit, push, deployment or production database change performed.
