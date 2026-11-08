# MySQL session setup performance repair

Verified locally on 8 November 2026. This report does not certify Railway throughput or full browser exams.

## Finding and change

`lib/database/mysql.mjs` previously sent two session setup statements on every connection checkout, before ordinary queries and transactions. This adds avoidable network round trips, particularly when the application and database are geographically separated.

The adapter now remembers successful initialization by underlying physical mysql2 connection, rather than the new promise wrapper created on each checkout. New/replacement connections still receive the full setup. Initialization failures are not cached; destroyed connections are invalidated. Explicit session-setting statements invalidate the cache. Pools configured to reset sessions retain setup on every checkout.

Pool limits, queue bounds, timeouts, verified TLS, parameter binding, transaction isolation, rollback/commit handling and application API contracts are unchanged. No exam, authentication, autosave, lease, audio, scoring, content or interface file was changed.

## Exact files

- `lib/database/mysql.mjs`: connection initialization reuse.
- `scripts/mysql/verify-session-reuse.mjs`: nine deterministic regression groups.
- `scripts/mysql/verify-session-reuse-real.cjs`: guarded real-MySQL comparison, settings, admin authentication, candidate creation, assignment, audit and integrity checks.
- `MYSQL_SESSION_PERFORMANCE_REPORT.md`: this report.

## Verification

All checks passed:

- Nine session reuse groups, including reset-on-release, partial setup failure, query failure, replacement connections, session changes and per-transaction isolation.
- Thirteen existing MySQL preparation groups and eight pool backpressure groups.
- All seven existing regression runners: 116 groups (Listening 16, recovery 19, lease coordination 13, autosave 23, exam client 10, student portal 19, CMS 16).
- TypeScript; full ESLint with zero warnings; production build; Git whitespace checks.
- Actual MySQL persistence: Unicode round trip, strict NOT NULL rejection, UTC, collation, lock timeout, reconnect and explicit session-setting invalidation.
- Actual authenticated admin route handlers: candidate creation and full-test assignment, password verification, expected records and two audit entries. Route handlers used isolated framework fixtures, not a real browser.
- Disposable schemas passed integrity/foreign-key checks. No production records were used.

## Measured local results

| Check | Before | After |
| --- | --- | --- |
| 30 sequential warm scalar queries: SQL commands | 90 | 30 |
| Session setup commands in that warm batch | 60 | 0 |
| Batch time on local MySQL | 21.48 ms | 6.61 ms |

After-change local authenticated candidate creation took 58.82 ms with seven SQL commands; assignment took 16.52 ms with nine. These are individual local measurements, not production latency guarantees, and no before-change route timing comparison was made. The reproducible improvement is two fewer setup round trips per warm checkout, not a promise that every HTTP request becomes 66.7% faster.

## Reproduction and private evidence

Run `node scripts/mysql/verify-session-reuse.mjs` for deterministic checks without a database. The real verifier requires the existing isolated MySQL fixture environment, an owned loopback server on port 33326 and a private baseline copy of the pre-change adapter at `private/session-performance-20261108/mysql-before.mjs`. It deliberately does not connect to Railway. Private launcher/environment files and evidence are ignored by Git and must not be published.

The completed real verification report is in `private/session-performance-20261108/real-verification.json`; the seven-runner summary is in `private/regression-fix-20261108/run-1794134261995/summary.json`.

## Remaining limits

This repair reduces database transport overhead; it cannot prevent browser/network outages. Railway latency and concurrent capacity need separate controlled measurement after deployment. Geographic placement, connection errors and request-specific bottlenecks can still matter.

The supplied load script's lease expirations cannot safely be repaired by weakening application lease rules: its blocking full-audio download postpones heartbeats beyond the existing lease. No lease duration, heartbeat policy or completion gate was changed to conceal that test limitation.

No Git commit, push, Railway deployment, production database change or infrastructure change was performed for this local repair. Local source changes affect Railway only after publication and a successful deployment of that revision.
