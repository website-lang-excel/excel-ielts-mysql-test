# Issue 2: MySQL regression runners

8 November 2026, Asia/Dhaka. **Fixed and verified locally. No commit, push or deployment performed.**

## Final results

All seven runners passed together against fresh isolated local MySQL schemas:

| Runner | Passed groups |
| --- | ---: |
| verify-listening-latency.cjs | 16 |
| verify-recovery-classification.cjs | 19 |
| verify-lease-coordination.cjs | 13 |
| verify-autosave-acknowledgements.cjs | 23 |
| verify-exam-client.cjs | 10 |
| verify-student-portal.cjs | 19 |
| verify-learning-cms.cjs | 16 |
| Total | **116** |

The first three runners retain the 48 Listening/Recovery/Lease groups. Autosave retains 23 groups. These are scenario groups, not counts of individual SQL statements or physical browser tests.

## Repairs

- Added a shared test-only TypeScript loader resolving relative imports, `@/` aliases, `.ts`, `.tsx`, `.mjs` and JSON. Framework cookies/navigation are explicitly stubbed; production modules are not modified.
- Awaited asynchronous fixture inserts, queries, application calls, transactions and cleanup. Assertions expecting asynchronous rejection now use `assert.rejects` correctly, rather than throwing before the assertion observes the promise.
- Adjusted fake-clock settling to wait for tracked real database/route operations, while preserving deterministic simulated network delays and timer expectations.
- Added fresh per-run results/student schema creation from the tracked schema definitions. Application persistence in the tests uses the genuine MySQL adapter; no success-returning database mock is substituted.
- Replaced SQLite PRAGMA assertions with real MySQL CHECK TABLE and foreign-key/orphan checks on both test schemas.
- Replaced the SQLite RAISE rollback fixture with a real MySQL trigger using SIGNAL. A rejected write is verified to preserve its prior committed content and produce no saved acknowledgement.
- Preserved the shared MySQL handle's no-op close semantics. Final fixture teardown explicitly closes pools and its separate setup connection, avoiding premature closure from the application's normal handle usage.
- Listening's fake Date.now now uses integer milliseconds, matching real Date.now and MySQL timestamp storage; the strict playback/deadline assertions remain.
- The client interruption fixture now establishes one healthy authoritative claim before injecting interruption. The test still verifies immediate continuation, bounded failure attempts, later blocking when connection safety becomes unverified, persistent answers and single-flight manual retry. It no longer assumes an unverified initial connection is safe.
- The CMS runner now targets the current provisioned MySQL schema rather than expecting an automatic SQLite version-1-to-version-3 runtime upgrade. A disposable legacy SQLite input fixture is copied into the test-owned current MySQL schema, and its original content/key bytes and references are checked there. This is **legacy-fixture preservation coverage**, not certification of an automatic runtime migration or the full deployment migration process. Current schema marker expectations are explicit fixture metadata.
- Portal mock-history fixtures now use the actual MySQL results tables instead of an unrelated SQLite file. Unreleased results remain hidden and cross-student isolation is verified.
- Removed unused local loaders/variables introduced by the shared-loader change. Reformatted the repaired server/database runners for reviewability.

No application, exam mechanism, authentication policy, timer, audio, autosave interval, save acknowledgement protocol, UI or content change was required for this issue. The prior Issue 1 local queue fix is retained.

## Changed files for Issue 2

- Seven `scripts/verify-*.cjs` runners listed above.
- `scripts/test-support/mysql-regression.cjs`: isolated setup, loader, async settling, explicit MySQL integrity/rollback fixture support and cleanup.
- `scripts/mysql/verify-regressions.mjs`: guarded suite orchestrator with private logs and explicit success/failure summaries.
- `MYSQL_AGENT.md`: local Issue 2 status update.
- This report.

The pre-existing dirty AGENTS.md, MySQL rulebook and Issue 1 code/template/test/report changes were preserved. They were not reset, committed or deployed as part of this task.

## Safety and reproducibility

The test server was the owned portable MySQL 8.4.13 instance on **127.0.0.1:33326**, with its data inside this project's ignored private test directory. Each database-backed runner creates new randomly named `reg_*_results_test` and `reg_*_students_test` schemas; the earlier queue-test schemas/records are not reset or reused as fixtures.

Both owner and application connection settings must identify that isolated endpoint. The fixture refuses remote endpoints, mismatched endpoints, and a server data directory outside this project's private folder. There is no fallback to a currently linked Railway project or production database.

Run with a prepared, running isolated local test server and its ignored JSON environment files:

```powershell
node scripts/mysql/verify-regressions.mjs --owner-env private/queue-fix-20261108/owner-env.json --app-env private/queue-fix-20261108/app-env.json
```

An individual subset can use `--only listening-latency,autosave-acknowledgements`. The owner file is required only for creating/granting the new fixture schemas; tests then use the limited application account. Do not replace these inputs with deployed database credentials.

Actual local credentials are not included in Git or this report. SQLite is used only for in-memory schema metadata, the explicitly disposable legacy import input and backup formats. The six database-backed runners use real MySQL application reads/writes. The exam-client runner is database-independent.

## Verification and evidence

- Final combined run: all seven exited 0, **116 groups passed**.
- Standalone TypeScript check: passed.
- Scoped ESLint on all changed runners/helper/orchestrator: **zero errors and zero warnings**.
- Node/TypeScript syntax parsing: passed for all repaired runners.
- Assertion-preservation check: 448 original assertion-call sites became 449; none were removed. The extra assertion verifies an initial healthy request in the client fixture. This is a structural safeguard, not proof that every test's meaning is identical; the explicit expectation changes are described above.
- Embedded historical client/reliability baseline strings in Lease and Autosave are byte-for-byte unchanged after decoding their string literals. Their before/after comparisons still execute.
- Existing Issue 1 checks reran successfully: eight focused pool regression groups and the real MySQL 50-query bounded-queue reproduction/capacity check. No additional application fix was made.
- `git diff --check`: passed. Git's LF-to-CRLF working-copy notices are line-ending notices, not failing checks; global Git configuration was not changed.
- A production build was not repeated for this test-only repair; application/configuration build inputs were not changed by Issue 2. The previous Issue 1 production build remains the most recent build verification.

Final run evidence: `private/regression-fix-20261108/run-1794107397812/summary.json` and its seven logs. Assertion evidence: `private/regression-fix-20261108/assertion-preservation.json`. Earlier failed setup/harness attempts are retained privately; they are not counted as passes. Final schemas and evidence are retained for inspection, and the owned test server is shut down after verification.

## Limits and next step

These tests combine real MySQL persistence and actual route/service implementations with deterministic fake clocks, cookie stubs and browser/hook VMs. They are not physical browser/audio playback tests or Railway concurrency certification. No external reset email was sent; the test webhook is stubbed.

No GitHub or Railway operations were performed. Neither deployed site nor the old SQLite repository/databases/backups was changed. Issue 3 (malformed JSON import handling) and the unrelated application lint/documentation work remain separate tasks. Publish/deploy only after a separate owner command.
