# Mock-only local implementation — 8 November 2026

Owner approved removing Student Portal, Learning CMS, Partial Tests and Mock Bookings while retaining the mock examination system. Changes are local and unpublished.

## Implemented

- Removed `app/student/`, `app/api/student/`, `app/api/learning/`, and the learning/partial-tests/mock-bookings admin pages and APIs.
- Removed `lib/student/`, `lib/learning/`, `lib/partial-tests/`, `lib/mock-bookings/` and their dedicated import/link/backup/regression scripts.
- Removed the homepage portal-choice section and its exclusive CSS; retained the existing 20-test library, candidate login and admin login. No replacement practice feature or public answer keys were added.
- Removed the three retired admin navigation links. Mock Students and Assignments remain.
- Made the optional historical students store lazy in `lib/database/mysql.mjs`. Results traffic and results backups no longer require `STUDENT_DATABASE_URL` or create a portal pool. Explicit historical archive access retains separate-schema validation, the existing TLS rules and bounded transport.
- Removed portal configuration from `.env.example`. The mock regression runner now runs the five retained examination suites, and its disposable fixture provisions only a results schema.
- Retained generic historical schema manifests and snapshot/migration tooling for archive compatibility. They do not provision tables at application startup. Existing private files, backups, databases, media and credentials were not deleted.

No changes to `app/test/`, `app/listening/`, `app/confirm/`, `app/verify/`, `app/candidate/`, `lib/results/`, `lib/highlighting/` or `public/`. Mock content, keys, account records, assignments, attempts and results were not removed or rescored.

## Verification

- Production build passed using the existing private local environment wrapper; final route inventory contains only the retained mock/admin routes.
- Standalone TypeScript passed after `next typegen` refreshed stale generated routes. The initial check referenced removed routes in old generated output; no generated source was edited by hand.
- ESLint with `--max-warnings 0` passed.
- Five retained regression suites passed: Listening 16, recovery 19, leases 13, autosave 23 and client recovery 10 groups (81 total). Real persistence used fresh random results schemas on the owned loopback MySQL server; browser/client behavior uses the existing deterministic harnesses.
- Four mock-only/archive configuration groups, eight acquisition/backpressure groups, nine session-reuse groups and the commit-phase autosave check passed.
- Local HTTP: homepage has all 20 test links and no portal entry; 12 removed page/API URLs return 404; candidate and admin login pages return 200 (15 checks).
- Authenticated local fixture admin login, retained results/navigation and logout passed (3 further checks).
- Diff whitespace checks passed. Existing documentation edits were preserved.

No remote service/database was accessed, no commit/push/deployment occurred, and no full-duration audio or physical-browser exam acceptance was performed. The build emitted an existing parent-directory lockfile warning; configuration was not changed for it.

## Pending database cleanup: review before execution

Removing application code does not reclaim existing database or media storage. Nothing in this change executes DROP, TRUNCATE or record deletion against an existing application database.

The proposed production cleanup destination is **only** the approved Railway project `excel-ielts-mysql-test` (`8555ac77-6abd-41b1-90b7-52b4c7111d04`), environment `3e0cb4e1-8a12-4850-9d3d-26cc1d4501cb`, MySQL service `7cf1cc1c-5d44-4b6b-85e8-f9a99ceff820`.

Keep **all of `ielts_results_test`**, including `users`, `sessions`, `test_assignments`, `attempts`, `attempt_progress`, `answer_keys`, `module_exposures`, `notification_outbox`, `audit`, `login_limits`, and `results_migrations`. Booking-created candidates, assignments and attempt history also stay here. The internal candidate role named `student` is required by mock authentication and is unrelated to the retired portal.

Proposed retirement target: **`ielts_students_test` only**. The local historical manifest lists these 26 tables; live inventory and cross-schema foreign keys must be checked before approval is acted on:

`categories`, `learning_audit`, `learning_content`, `learning_enrolments`, `learning_media`, `learning_settings`, `lesson_completions`, `lessons`, `mock_links`, `partial_bookings`, `partial_candidates`, `partial_slots`, `password_resets`, `practice_answers`, `practice_attempts`, `practice_set_questions`, `profiles`, `questions`, `rate_limits`, `scheduled_mock_bookings`, `scheduled_mock_candidates`, `scheduled_mock_slots`, `sessions`, `student_migrations`, `students`, `topics`.

Execution sequence after explicit publication and database-cleanup authorization:

1. Verify exact GitHub/Railway account and service boundaries. Inventory the live schemas, counts, sizes, grants and cross-schema dependencies read-only; abort on unexpected dependencies or targets.
2. Export consistent private snapshots of both schemas and independently archive `/data/learning-media`; verify archive integrity/relationships and protect archives outside public assets/Git. Keep results backups under `/data/backups` intact.
3. Publish the reviewed mock-only code to the approved `main` branch and verify the actual Railway deployment revision and retained authenticated features. Confirm results access and results backup operation without the portal connection.
4. Remove only the retired `ielts_students_test` schema after backup verification and final target confirmation. MySQL schema deletion is irreversible without restoration; no results-table cleanup is included.
5. Retire portal-only media and obsolete portal variables/grants after validating exact ownership and backups. Preserve the MySQL service, results schema, volumes, TLS certificate/CA files and results backup directory.
6. Verify mock login, assignments, keys, results, backup access and schema isolation, and report measured storage changes. No space-saving claim can be made before measuring the actual deployment.

Local historical isolated test schemas and protected backups are excluded from this production cleanup. Deleting them is a separate scope. Do not rerun initialization or restore old accounts to perform this retirement.
