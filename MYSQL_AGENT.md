# MySQL website — permanent project instructions

Established: 8 November 2026, Asia/Dhaka. Applies to this MySQL project only. Read this file and the preservation rules in AGENTS.md before work. Current explicit owner instructions take precedence over historical documentation. Verify actual source rather than assuming the document certifies every feature.

## 1. Absolute boundary: protect the original SQLite website

The owner requires complete separation between the existing SQLite website and this MySQL website.

- Permitted local working project: `C:/Users/Asus/Documents/Codex/website-lang-excel-mysql`.
- Permitted GitHub repository: `https://github.com/website-lang-excel/excel-ielts-mysql-test`.
- Permitted Railway account: `nothingforthefirsttime@gmail.com`.
- Permitted Railway workspace: `website-lang-excel's Projects`.
- Permitted Railway project: `excel-ielts-mysql-test`, ID `8555ac77-6abd-41b1-90b7-52b4c7111d04`.
- Railway environment ID: `3e0cb4e1-8a12-4850-9d3d-26cc1d4501cb`.
- Website service ID: `5017b76e-4f14-4252-af25-5cca15d2eb39`.
- MySQL service ID: `7cf1cc1c-5d44-4b6b-85e8-f9a99ceff820`.
- Website: `https://excel-ielts-mysql-test-production.up.railway.app`.

The original SQLite GitHub repositories/account, Railway account/projects/services, production data, original Desktop project and complete backup are off-limits. Do not push, merge, link, deploy, restart, migrate, change settings, alter variables, create credentials or run tests against them. Do not use them as a fallback destination or query them merely to check that they still work.

The older local `excel-ielts-mysql-test` publication directory points to the previous GitHub account. Do not publish from it or change its remotes. The separate `MYSQL_WEBSITE_LOCAL` directory contains previous local migration/audit evidence and private source snapshots; it is not this repository's publication directory. Read a specific artifact only when needed and authorized; never modify its clean migrated records or protected backups during work here.

Old commit-author names can exist in copied Git history. They do not establish repository ownership. Verify destination owner and URL. Do not rewrite history or remove author attribution without a specific request.

## 2. Consent and workflow

- Work only on the owner's specific current command. A discussion, status question, plan or successful verification does not authorize unrelated changes.
- An audit/report request is read-only. Report defects and propose the smallest fix; obtain authorization before implementation.
- Before edits, inspect `git status --short`, relevant files and `git remote -v`. Preserve unrelated work.
- Make local changes and verify them first. Report exact files, checks, failures and limits.
- Do not commit, push or deploy automatically after a fix. Require an explicit command covering that publication/deployment action. Previous one-time upload/deployment approval is not standing permission for later changes.
- Before a GitHub write, verify the authenticated account is `website-lang-excel` and the remote targets the exact allowed repository.
- Before a Railway write, verify the account and exact project/environment/service IDs above. Browser sign-in and command-line sign-in may be different. Stop on any mismatch; never operate on whatever happens to be linked.
- A request to deploy this site authorizes only this new project. It does not authorize modifying the original site, transferring its records or purchasing/upgrading a plan.
- Keep changes narrow. Do not add dependencies, redesign, refactor unrelated code or change exam policy as an incidental repair.

## 3. Preserve the complete website and mock-test mechanisms

The MySQL version must preserve the existing appearance, features, API contracts and exam behaviour. MySQL storage changes do not authorize changing the product.

- Preserve Listening, Reading and Writing content, instructions, question numbering, options, answer formats, approved keys, scoring and result release.
- Preserve fonts, colours, input sizes/borders, boxes, bullets, headings, radio/checkbox styling, dropdown alignment, headers, footer, toolbar, scrolling and responsive layouts. Scope any explicitly requested presentation change to its named test/questions.
- Preserve assignment/mode/exposure rules, candidate/admin/student separation, fullscreen restrictions, tab ownership, server deadlines, audio validation, save frequency, acknowledgements, retries, recovery and idempotent submission.
- Reading/Writing retain their server-controlled section deadlines. Listening retains actual recording-driven timing and playback restrictions. Do not shorten clocks or recordings to demonstrate normal exam operation.
- Do not weaken security or change timers/lease policies merely to make a test pass. Confirm current constants in source; historical rulebooks may be stale.
- Preserve passage and question wording unless the owner specifically approves a correction. Do not invent text to make an answer key fit.
- Preserve each existing question type's interaction and saved-value/key contract. Do not globally migrate legacy text-valued options without a separate request.
- Preserve Student Portal, CMS, bookings, progress/history, media privacy, manual Writing marking and controlled release behaviour.

For detailed content templates and UI patterns, consult the historical preservation sections in AGENTS.md and confirm the actual renderer. Its SQLite-specific architecture descriptions are historical, not instructions to reintroduce SQLite.

## 4. Actual MySQL architecture

- Live application persistence is MySQL, with separate results and students/CMS schemas on the MySQL service.
- `lib/database/mysql.mjs`: mysql2 connection pools, connection/query/transaction bounds, transaction context and errors.
- `lib/database/runtime.ts`: shared MySQL stores/handles; requires `DB_BACKEND=mysql`; enables safe numeric normalization.
- `lib/database/sql-handle.mjs` and `sql-dialect.mjs`: asynchronous SQL handles and dialect adaptation.
- `lib/results/db.ts`: results store entry point. `lib/student/db.ts`: portal/CMS store entry point.
- Database operations and transaction callbacks must be awaited. Do not write synchronous DatabaseSync assumptions into MySQL call sites or tests.
- Preserve parameter binding, utf8mb4 text, JSON text, timestamps, numeric precision, foreign keys, uniqueness, transaction rollback and attempt locking.
- Do not silently fall back to SQLite when MySQL is unavailable.
- SQLite code remains intentionally available in private snapshot export/import tooling and historical tests. An exported `.sqlite` backup does not mean application requests use SQLite.
- Application startup does not provision an empty MySQL installation or automatically recreate all schemas/accounts. Database setup is a separately controlled operation.
- Genuine MySQL 8.4.13 was verified in this deployment. Do not substitute MariaDB or upgrade the database image as an incidental change.

Current defaults in `mysql.mjs`: pool limit 5 per store, queue limit 64 per store (the approved local Issue 1 fix increases the previous 20), connection/acquisition timeout 3 seconds, query timeout 7 seconds and transaction timeout 12 seconds. Recheck source/environment before relying on them. Changing these defaults or host limits needs a scoped request and meaningful verification. Local changes do not imply they have been published or deployed.

## 5. Current deployment and private configuration

- Schemas: `ielts_results_test` and `ielts_students_test`.
- The owner chose a fresh database: existing student accounts, profiles, attempts and results were not imported. Initial reference content and 40 Listening/Reading answer-key configurations were included, with a newly generated administrator.
- Do not import the previous migration snapshot's accounts/history without explicit approval for that data transfer. Fresh state at deployment is not permission to delete later records.
- `DB_BACKEND=mysql`; separate `RESULTS_DATABASE_URL` and `STUDENT_DATABASE_URL` values; `CLASSROOM_HTTP=false`; APP_ORIGIN matches the public HTTPS site.
- Remote database connections require certificate-chain and hostname verification. `MYSQL_TLS_MODE=required`. Never set rejectUnauthorized/verifyIdentity false or enable remote plaintext to bypass a connection error.
- The application database user is restricted to CRUD on the two application schemas and requires SSL. Do not substitute the MySQL root account for normal application traffic.
- MySQL data volume: `/var/lib/mysql`. Website persistent volume: `/data`.
- Private backups: `/data/backups`. CMS media: `/data/learning-media`.
- CA file: `/data/mysql-ca.pem`, materialized from a Railway variable by the website's configured start command. The application binds `0.0.0.0` and Railway's PORT, currently configured as 8080.
- TLS server certificate/key paths are persisted in MySQL settings; certificate SAN matches `mysql.railway.internal`. The setup certificate was issued for 365 days in November 2026. Plan renewal before expiry and verify the actual certificate dates. Do not disable verification when it expires.
- These deployment settings live in Railway, not all in repository files. Preserve/document them when recreating a service. Never dump secret variable values into reports or logs.
- `private/railway-deploy` contains ignored setup evidence, private credentials and helpers. Do not commit it, rerun initialization against an initialized database, or copy its secrets into source/docs/chat. Initial setup required a small helper-only SQL literal correction; that is not an application patch.
- The temporary deployment SSH key was revoked after successful verification. Do not register it again or create persistent access without explicit approval. Any approved temporary access must be revoked after its task.
- Deployment-time public pages, admin login/logout, secure cookies, CMS overview, key retrieval and actual verified-TLS database access passed. That does not certify full browser exams or concurrent capacity on Railway.

## 6. Verification and current unresolved findings

Current local status, 8 November 2026: the four code issues below have been repaired and verified locally, and the documentation review is complete. The numbered findings are retained as an audit baseline; their dated updates and linked reports supersede them. Manual browser acceptance, explicit publication/deployment approval and verification of the eventual new Railway revision remain outstanding. Current operating instructions are in MYSQL_OPERATIONS.md. No later deployment is implied by this status.

Manual acceptance preparation, 8 November 2026: a separate disposable local workspace under private/manual-acceptance-20261108 uses fresh randomly named schemas on the owned loopback test server, private generated logins and fixture scoring keys. The existing production build was started at http://127.0.0.1:3307 and 12 HTTP smoke checks passed (including authenticated admin/CMS/student pages, assigned candidate login and malformed import HTTP 400). The owner must still perform browser acceptance; mock scores in this fixture are not correctness certification. Private launch/configuration files must not be published. See MYSQL_DOCUMENTATION_REVIEW.md. No deployed data was accessed or changed.

At the November 2026 local audit:

1. High: the 50-student startup stage failed with 93 HTTP 500 responses. A separate reproduction confirmed raw pool queue exhaustion escapes typed error handling. Do not claim the deployment fixes it. Normalize/classify safely and retest capacity only after approval; changing an error to 503 alone is not proof of capacity.
2. Medium: seven original regression runners failed through async fixture, alias-loader or older expectation incompatibilities. Do not report the old suite green because separate MySQL tests pass.
3. Low: malformed CMS JSON imports return generic 500 instead of a validation response; confirmed pre-existing.
4. Lint: 12 errors and 29 warnings existed in unchanged files at audit start. Do not silently modify unrelated files to remove them.

Issue 1 local update, 8 November 2026: the owner explicitly approved the repair. Typed acquisition backpressure and bounded queue default 64 passed progressive 5/10/20/50-student HTTP/MySQL tests with zero failed requests in the final run, plus a second successful 50-student run. See MYSQL_POOL_FIX_REPORT.md for exact scope, metrics and limits. This local verification does not mean the fix has been committed, pushed or deployed, or that Railway capacity has been certified. Issues 2–4 above remain separate work.

Issue 2 local update, 8 November 2026: the owner explicitly approved the regression-runner repair. All seven runners now pass together (116 groups) with isolated MySQL persistence and deterministic framework/browser fixtures where stated. The 48 Listening/Recovery/Lease groups, 23 autosave groups and historical baseline strings were preserved. See MYSQL_REGRESSION_FIX_REPORT.md for expectation changes, exact verification and limits. These test-only changes have not been committed, pushed or deployed; malformed JSON import handling and unrelated application lint remain separate issues.

Issue 3 local update, 8 November 2026: approved malformed CMS JSON import repair is implemented in lib/learning/imports.ts. JSON syntax errors now use the existing StudentError HTTP 400 validation response with a safe, actionable message instead of a generic HTTP 500. Seven focused route/parser regression groups, TypeScript, scoped lint and diff checks passed. No database, interface, mock-test mechanism, GitHub or Railway changes were made. See MYSQL_JSON_IMPORT_FIX_REPORT.md for scope and verification limits.

Issue 4 local update, 8 November 2026: the owner approved review and repair of all application lint findings. Full ESLint with --max-warnings 0 now passes. Unused declarations/imports were removed, committed-value refs and diagnostic callback dependencies corrected, assignment history keyed to its inputs, and instruction expansion reset guarded by section identity. Eight intentional external-state/reset effect operations and native image uses retain explicit documented rule exceptions; lint rules were not globally weakened. Private runtime/audit artifacts are excluded from ESLint. TypeScript, production build, all seven regression runners (116 groups across the completed runs), focused JSON/pool checks and commit-phase hook verification passed. Compiled render-return output for all 23 reviewed application files is preserved. See MYSQL_LINT_FIX_REPORT.md for exact scope, evidence and remaining browser-test limits. No commit, push or deployment was performed.

Completed local cohorts of 5, 10 and 20 students passed. Those were finite tests, not full-duration exam soaks or Railway capacity guarantees. No confirmed corruption or loss of acknowledged answers was found in those tests. Do not turn that result into a universal guarantee.

Use genuine isolated MySQL schemas with independent users/sessions/attempts for mutating tests. Never run destructive/load fixtures against this deployed site's application schemas or original records. Do not assume this new site remains empty forever.

After an approved database reliability change, check acquisition/queue bounds, release after late acquisition, query/transaction failures, rollback, uncertain commits, safe HTTP classification, acknowledgement correctness, stale/out-of-order saves, retry, ownership and deadline preservation. Retest progressive cohorts and stop on integrity/stability risk. Distinguish simulated fixtures, real HTTP/MySQL, real browsers and actual full audio playback.

Relevant existing commands, when applicable:

```text
npm ci
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
git diff --check
```

Inspect scripts before running them: the repository has no generic `test` script. The seven repaired regression runners require explicit private isolated-MySQL fixture configuration; run them through scripts/mysql/verify-regressions.mjs as documented in MYSQL_OPERATIONS.md. Run full lint and relevant approved regressions; state all failures. Do not run a build into output used by an ongoing test/dev server without isolating it. Documentation-only changes need document/diff checks, not candidate creation, builds or database mutations.

## 7. Secrets, backups and recovery

- Never commit/upload `.env.local`, database files, snapshots, backups, account records, password hashes, answer-key exports, private keys, cookies, tokens or deployment setup artifacts. Keep `.env.example` placeholder-only.
- The repository is public. Inspect staged files and history before a permitted push. No database/backup/credential files belong in public assets or Git history.
- Do not log credentials in command arguments, API request bodies, connection URLs, raw SQL errors or screenshots. Use private files or standard input and sanitized output.
- Backup/export and restore are different operations. MySQL backup exports can be SQLite-format consistent snapshots; live persistence stays MySQL. File-replacement SQLite restore is not a MySQL production restoration method.
- Restore into a separately approved empty destination, verify typed row hashes/relationships and obtain explicit cutover approval. Never overwrite the protected complete backup or original SQLite databases.
- Never solve a failing migration/test by deleting real attempts, answers, assignments, accounts, audit history or changing approved keys.

## 8. Completion reports

Report what changed, why, exact files, actual verification results and remaining limitations. Keep technical detail proportional to the request. Never claim a remote deployment, account switch, MySQL migration, regression pass or student capacity without direct evidence.

If the task is blocked, state the specific blocker and the smallest required user action. Do not switch to old accounts/projects to work around it. After authorized local work is complete, wait for the next explicit command before publication or deployment.
