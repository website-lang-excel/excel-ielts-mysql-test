# Issue 1: MySQL startup queue reliability

8 November 2026, Asia/Dhaka. Status: **fixed and verified locally; not committed, pushed or deployed**.

## Change and cause

The original pool permitted five connections plus only 20 queued acquisitions per store. A 50-student startup or synchronized recovery could exceed that bound. mysql2 rejected acquisition with a plain queue-limit Error, which escaped typed database handling and became HTTP 500.

The repair has two parts:

1. Catch both synchronous and asynchronous acquisition failures and convert them to sanitized `MYSQL_POOL_UNAVAILABLE` errors. The existing HTTP endpoint now classifies them as retryable database backpressure: HTTP 503 and `Retry-After: 1`. No success/save acknowledgement is fabricated. No SQL or transaction is retried automatically by the adapter.
2. Increase the bounded default queue from 20 to 64 per store. This accommodates the measured 50-student burst with headroom for background work. Explicit environment overrides remain supported and validated; an existing `MYSQL_QUEUE_LIMIT=20` still means 20 until deliberately changed.

The pool still uses five connections per store. Connection/acquisition timeouts remain 3 seconds, query timeout 7 seconds and transaction timeout 12 seconds. Existing late-acquisition cleanup, uncertain-commit handling, transaction semantics, client retries, autosave frequency, exam policies, fonts and UI are unchanged.

## Files

- `lib/database/mysql.mjs`: typed acquisition failures and bounded queue default 64.
- `lib/results/diagnostics.ts`: classify the new error as database-busy.
- `.env.example`: document queue default 64, with placeholder-only credentials.
- `scripts/mysql/verify-pool-backpressure.mjs`: eight focused regression groups.
- `scripts/mysql/verify-pool-backpressure-real.mjs`: real MySQL reproduction and capacity check, guarded to the isolated local test endpoint.
- `MYSQL_AGENT.md`: update the queue-default description and local verification status. The earlier AGENTS.md/MySQL rulebook work is preserved; it is not an application change introduced by this repair.
- This report. Ignored test setup, credentials, evidence and disposable data remain under `private/queue-fix-20261108`.

## Verification approach

A new MySQL 8.4.13 data directory was initialized within this project's ignored private test folder, bound only to 127.0.0.1:33326. A production build of this actual project ran locally at 127.0.0.1:3327 with separate `queue_results_test` and `queue_students_test` schemas. Disposable users, sessions and attempts were independent. Only reference content and keys were read from the prior private source snapshot; no prior student accounts/history were imported.

No Railway service, remote database, GitHub repository, original SQLite database or protected backup was modified during this fix. The deployed new Railway site still runs its prior commit until a separately authorized publication/deployment.

The copied load harness was corrected only for its local paths, environment and telemetry. Setup-only GRANT refresh and numeric-representation assertions were corrected before successful verification; these were harness/setup issues, not additional application repairs. The old audit artifacts were not overwritten.

## Before and after

| Stage | Outcome |
| --- | --- |
| Original audit, 50 students | Startup failed; 93 HTTP 500 responses in 317 requests before stopping |
| Acquisition classification only, old queue 20 | All 50 completed, but 128 retryable 503 responses across startup/recovery; insufficient as final result |
| Final repair, queue 64 | All four cohorts completed; 1,920/1,920 requests succeeded, zero 500/503 or other failed requests |
| Additional monitored 50-student run | 1,150/1,150 requests succeeded again, zero failed requests |

The final primary run:

| Students | Requests | Failed | Average | p95 | p99 | Autosave p95 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 110 | 0 | 96 ms | 507 ms | 680 ms | 50 ms |
| 10 | 220 | 0 | 125 ms | 537 ms | 948 ms | 106 ms |
| 20 | 440 | 0 | 157 ms | 783 ms | 1,728 ms | 54 ms |
| 50 | 1,150 | 0 | 297 ms | 1,023 ms | 4,027 ms | 121 ms |

Each cohort exercised candidate creation/assignment, login, startup, claim, instruction confirmation, activation, six autosave rounds at real five-second intervals, lease renewal with original-deadline assertions, draft recovery and duplicate-safe final submission. The 50-student stage also synchronized 50 recovery claims. Forty independently identifiable answers per student were checked.

The primary 50-student run included 300 successful autosaves, 300 renewals, 50 synchronized recovery requests, 50 submissions and 50 duplicate submissions. The monitored repeat passed the same operations: average 297 ms, p95 930 ms, p99 4,205 ms; autosave p95 68 ms. Login p95 was approximately 4.4 seconds during the burst: requests succeeded, but startup is not instantaneous.

The primary stages lasted about 32, 34, 36 and 45 seconds. A controlled disposable-fixture deadline adjustment enabled final submission after the real save rounds. This was not a full-hour exam soak, accelerated production timer or physical-browser/audio test.

## Integrity and safety results

- Final database readback checked **220 completed attempts and 8,800 submitted answers** across the intermediate, primary and monitored runs. Every answer slot matched its student/round/question marker.
- Assignments were consumed exactly once. Duplicate submissions did not create additional attempts or alter committed answers.
- All four final cohorts preserved their original deadlines during renewal/recovery before the deliberate fixture-only finalization adjustment.
- Eight focused regression groups passed: bounded defaults/overrides, async queue rejection, synchronous acquisition failure/sanitization, HTTP 503/Retry-After with no false acknowledgement, late acquisition released exactly once, callback not entered on failed acquisition, normal release/query-failure destruction and uncertain commit not retried.
- Real MySQL pool reproduction: 50 parallel read-only operations with queue 20 produced 25 successful queries and 25 typed retryable rejections; with queue 64, all 50 succeeded. The pool remained usable afterward in both cases. No database records were written by this specific pool test.
- Final production build and TypeScript stage passed. Scoped ESLint on implementation/tests and `git diff --check` passed.
- The existing seven legacy regression-runner problems were not fixed or represented as passing; they belong to issue 2. JSON import and unrelated lint issues were left alone.

## Resource and performance impact

The larger queue adds at most 44 waiting acquisition slots per store; it does not increase connection count, remove queue bounds or extend acquisition timeouts. Requests under true excess load still receive bounded retryable backpressure. A queue is not an unlimited capacity promise.

Eight valid resource samples were collected in the extra 50-student run. Observed peak MySQL connections: 7, including monitoring/background connections; server limit: 80. No server max-connection errors occurred. Sampled active lock waits were zero. Cumulative MySQL counters across all tests did record short lock waits (175 waits, 989 ms total), so this report does not claim that no locks ever waited.

Peak sampled Windows process working sets during the monitored run were approximately 233 MiB for Node and 76 MiB for MySQL. These are local working-set samples, not Railway memory estimates or maximum possible usage. Raw CPU-time/process samples are retained in the private evidence. Earlier resource collection had a monitoring-only command error; its invalid samples were not used, and the corrected 50-student repeat supplied valid telemetry.

## Preservation, limits and next step

Only the MySQL transport/error classification, default template and targeted verification/documentation changed. Candidate authentication, scrypt policy, SQL business rules, lifecycle, timers, audio, client saves/recovery, UI/content, key values and scoring were not edited.

This resolves the demonstrated local startup/backpressure defect and passed two complete final 50-student runs. It does **not** certify 50 students over the internet on the current Railway trial resources. A controlled isolated Railway load test and full-duration/browser coverage remain separate verification work; never load-test actual student records.

No Git commit, push or deployment was performed. Publish only to `website-lang-excel/excel-ielts-mysql-test` and the verified new Railway project after an explicit owner instruction. Preserve verified TLS, persistent volumes and private configuration. Check for a queue-limit environment override when deploying.

Private evidence: `private/queue-fix-20261108/results/load.json`, `backpressure-only-load.json`, `load-monitored.json`, `summary.json`, `final-integrity.json` and `final-integrity-220.json`. Keep all private fixtures/data/credentials excluded from Git. Temporary test services are shut down after verification; retained disposable files provide reproducible evidence and are not production records.
