# Application lint repair

Completed locally: 8 November 2026. No commit, push, Railway operation or production-data change.

## Result

The original application baseline was **12 errors and 29 warnings**. Full project ESLint now finishes with **0 errors and 0 warnings**, including `--max-warnings 0`. This includes reviewed, documented exceptions below; it is not a claim that every reported pattern was rewritten.

## Repairs and reviewed exceptions

- Removed 16 unused declarations: unreachable continuation handlers, unused question helpers, unused arrays/styles. Removed their now-unused imports, router hooks and transition state. The active navigation/submission paths were retained.
- Corrected two render-phase ref writes: Listening's latest answers and the autosave scheduler's latest callbacks/value now update in `useLayoutEffect`. Abandoned renders cannot replace the committed snapshot. Existing scheduler frequency, persistence, acknowledgements, retry and deadline policies remain unchanged.
- Stabilized audio diagnostics with `useCallback`, using the existing test/retry identities, and included that callback in both effects' dependency lists. The restoration effect still intentionally samples lifecycle stage: adding stage as a restart trigger would pause and seek on lifecycle changes. A narrow dependency-rule exception documents this requirement.
- AssignmentForm now stores history responses with their candidate/test/mode/revision key, deriving loading/error state for the current selection. Removed the synchronous reset effect while retaining cancellation and the original requests and assignment rules.
- SectionDashboard resets expansion with a guarded section-identity state update. Removed its effect-only reset; rendered controls and section policies are unchanged.
- Retained eight narrowly documented `set-state-in-effect` exceptions for existing external draft normalization/readiness, session-storage zoom/notes hydration, toolbar closure and recovery-route cleanup. These were reviewed rather than deferred with timers or rewritten in a way that could alter exam recovery/hydration. They cover two Reading normalizers, Writing readiness, shared answer-draft readiness, two TestSafety operations and two TestTools operations.
- Retained the 11 native image uses across nine files. Each affected file documents an exception for the image-optimization rule only, preserving existing dimensions, CSS, loading behavior and direct logo/diagram URLs. No conversion to optimized image URLs or new layout behavior was introduced.
- ESLint now ignores `private/**`: local credentials, database runtimes, disposable audit scripts and evidence are outside the published application source. Tracked application code and regression scripts remain linted. No rules were globally disabled and no dependencies were added.

## Exact changed files for this issue

Application:

```text
app/HomepageBanner.tsx
app/admin/(secure)/assignments/AssignmentForm.tsx
app/confirm/TestClient.tsx
app/listening/TestClient.tsx
app/listening/TestElevenListening.tsx
app/listening/TestFiveListening.tsx
app/listening/instructions/TestClient.tsx
app/page.tsx
app/test/ImportedReadingTests.tsx
app/test/ReadingTestsElevenToFifteen.tsx
app/test/ReadingTestsSixteenToTwenty.tsx
app/test/TestClient.tsx
app/test/TestFiveReading.tsx
app/test/TestFourReading.tsx
app/test/TestOneReading.tsx
app/test/TestSixReading.tsx
app/test/TestThreeReading.tsx
app/test/TestTwoReading.tsx
app/test/writing/WritingTestClient.tsx
app/verify/VerifyClient.tsx
lib/results/TestSafety.tsx
lib/results/TestTools.tsx
lib/results/client.ts
```

Verification/configuration/documentation:

```text
eslint.config.mjs
scripts/verify-listening-latency.cjs
scripts/verify-recovery-classification.cjs
scripts/verify-autosave-acknowledgements.cjs
scripts/verify-exam-client.cjs
scripts/verify-lint-hooks.cjs (new)
MYSQL_AGENT.md
MYSQL_LINT_FIX_REPORT.md (new)
```

The four existing fixture changes add support for the commit-phase hook and stable callbacks; Listening/Recovery's positional restoration index was adjusted. No assertions or embedded historical source baselines were removed or rewritten. Other dirty files belong to previously approved issues and were preserved.

## Verification and evidence

| Check | Result |
| --- | --- |
| Full ESLint, `--max-warnings 0` | 0 errors, 0 warnings |
| TypeScript, `--noEmit --incremental false` | Passed |
| Production Next.js build against isolated loopback configuration | Passed; compiled, TypeScript checked and 40 static pages generated |
| Listening regression | 16 groups passed |
| Recovery regression | 19 groups passed |
| Lease regression | 13 groups passed |
| Autosave/MySQL persistence regression | 23 groups passed |
| Exam client regression | 10 groups passed |
| Student Portal regression | 19 groups passed |
| Learning CMS regression | 16 groups passed |
| CMS JSON import regression | 7 groups passed |
| Pool backpressure focused regression | 8 groups passed |
| New commit-phase autosave hook verification | Passed: latest committed snapshot, discarded renders ignored, scheduler not restarted |
| Render preservation | Compiled return expressions unchanged in all 23 reviewed application files |
| `git diff --check` | Passed after line-ending/blank-whitespace normalization |

All seven runners passed across two runs: five passed in `private/regression-fix-20261108/run-1794110368705/summary.json`; the corrected Listening and Recovery fixtures passed in `run-1794110481355/summary.json`. This totals 116 groups, including the original 48 Listening/Recovery/Lease groups. No fresh 50-student HTTP capacity claim is made for this lint repair.

Ignored local evidence: `private/lint-verified-20261108.json`, `private/lint-preservation-20261108.json`, `private/lint-build-20261108.log` and the two suite run directories above. Source comparison snapshots are stored with `.snapshot` suffixes so they are not TypeScript inputs.

During verification, TypeScript initially included the temporary source snapshots, and two fixtures initially lacked support for the newly added hooks/effect ordering. The snapshots were renamed, the fixtures corrected without removing assertions, and the affected checks passed. The preservation comparator was adjusted to compare compiled JSX output, excluding irrelevant CRLF/blank-line differences. Git whitespace findings were corrected by normalizing edited files; no Git configuration was changed.

## Limits and preservation

Physical-browser media playback, visual interaction and a fresh concurrent-student load test were not performed in this issue. The hook tests use deterministic framework/VM fixtures; persistence regression groups use disposable schemas on the isolated local MySQL server. Browser smoke testing is still appropriate before publication.

The build still prints the existing warning about a package-lock.json outside this Git repository in the user's home directory. It does not fail the build and was not changed in this lint-only task.

No fonts, colors, field dimensions, question content, keys, exam timers, audio rules, retry limits, lease policies, schema or deployment settings were changed. Original SQLite projects/databases, complete backups, old GitHub/Railway projects and the running MySQL Railway service were untouched. Only the owned isolated local test MySQL server was used. At cleanup, its shutdown request returned ECONNREFUSED on 127.0.0.1:33326 because it was already unavailable; no successful shutdown command is claimed. No records from existing application or production schemas were deleted.
