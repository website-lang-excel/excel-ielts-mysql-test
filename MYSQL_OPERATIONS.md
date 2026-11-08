# MySQL operations and acceptance guide

Source-checked on 8 November 2026. Applies only to this new MySQL project. Documentation changes do not provision databases, modify records or authorize publication.

## Configuration and local startup

Use Node.js **24.x**, lockfile dependencies and genuine **MySQL 8.0.30+**. Recorded verification used MySQL **8.4.13**. Prepare two distinct schemas and a restricted application user before starting the website. Startup does not create/seed schemas, accounts, reference content or answer keys.

Normal Next.js commands load `.env.local`. Convenience MySQL helpers load `.env.mysql.private` first when present, otherwise `.env.local`. Keep these private configurations consistent so build/start do not select different databases.

| Setting | Actual role |
| --- | --- |
| `DB_BACKEND=mysql` | Required for application persistence |
| `RESULTS_DATABASE_URL` | Results schema: administrator/candidate accounts, assignments, attempts, answers and keys |
| `STUDENT_DATABASE_URL` | Separate students/CMS schema: student accounts, content, practice and progress |
| `MYSQL_TLS_MODE` | `required` for remote hosts; `disabled` permitted only for loopback |
| `MYSQL_TLS_CA_FILE` | Trusted CA file when required by the database certificate |
| `APP_ORIGIN` | Exact browser origin, including scheme and non-default port |
| `CLASSROOM_HTTP` | `true` only for trusted local HTTP; `false` on Railway/HTTPS |
| `BACKUP_DIR` | Private persistent results-backup directory outside `public` |
| `STUDENT_MEDIA_DIR` | Private persistent CMS-upload directory outside `public` |
| `RESULTS_DB_PATH`, `STUDENT_DB_PATH` | Filesystem compatibility paths for backup/helper code, not MySQL connections |

URLs have the form `mysql://USER:PERCENT_ENCODED_PASSWORD@HOST:PORT/SCHEMA`, without query parameters. Encode special password characters; never commit actual values. Use both explicit schema URL variables rather than relying on the results-only `DATABASE_URL` fallback. The application enforces separate schemas and verified remote TLS.

Current local source defaults: pool limit **5 per schema**, queue **64 per schema**, connect/acquisition timeout **3 seconds**, query timeout **7 seconds**, transaction timeout **12 seconds**. Environment overrides may differ. Do not claim a running deployment uses local source defaults before publishing/verifying it. Queue size is not student capacity.

With a prepared local MySQL service running and a reviewed private `.env.local` in this project:

```powershell
cd "C:\Users\Asus\Documents\Codex\website-lang-excel-mysql"
npm ci
npm run build
npm run start -- --hostname 127.0.0.1 --port 3307
```

Set `APP_ORIGIN=http://127.0.0.1:3307` and open that exact host. Website and MySQL ports are separate. For `EADDRINUSE`, identify the listener before changing a port; update APP_ORIGIN too. Do not stop an unidentified process. Do not build into output used by a running dev/test server.

`local:mysql` additionally requires private `.local-mysql.json` metadata for distribution/config/data-directory/ports/shutdown credentials. It checks version and data-directory ownership. `stop:mysql` checks ownership before shutdown. These helpers are not installers. Do not fabricate metadata or initialize an existing data directory.

The root has only `.env.example`, with no private environment file or `.local-mysql.json`. A separate ignored manual-acceptance workspace was prepared on 8 November 2026 under `private/manual-acceptance-20261108`. Its launcher is `node private/start-manual-20261108.mjs` from this project root; it verifies the isolated local database and starts the existing production build on `http://127.0.0.1:3307`. These private files are machine-specific and absent from public clones. At handoff, the instance was running and 12 local HTTP checks passed. Do not start a second launcher while its port is occupied. This observation does not certify browser acceptance or guarantee the process remains running after the computer restarts.

The workspace has disposable administrator, student and separate module/full-test candidate accounts. Login details are kept in its ignored credentials file, not this document. Mock scoring keys are disposable fixtures; use this instance to check mechanisms, not answer correctness. No existing or deployed account records were copied. Its course/practice content is explicitly labelled as disposable.

## Backups and recovery

Complete coverage requires **both MySQL schemas**, private uploaded media, public audio/images/videos, source/Git history and protected environment/deployment configuration. Server database backups do not contain tab-local notes, highlights or pending drafts.

Current automatic maintenance snapshots the **results schema only**, at startup and every six hours, retaining the latest 28 matching results snapshots. Admin backup list/download also concerns results only. It does not automatically back up students/CMS or media.

The existing exporter reads a consistent MySQL transaction into a portable `.sqlite` archive and validates archive integrity/relationships. This archive format does not change live MySQL persistence. Each schema snapshot is separate; paired snapshots are not an atomic cross-schema recovery point. Coordinate writers when cross-schema consistency is required.

For an explicitly approved results backup with private MySQL configuration already reviewed:

```powershell
node --env-file=.env.local scripts/backup.mjs
```

This command backs up **results only**. Plain `npm run backup` does not load `.env.local` itself. Complete MySQL backup policy must separately cover students/CMS and media. Provider snapshots or a reviewed logical-dump procedure need coverage, retention, protected storage, verification and an isolated restore rehearsal. No new backup automation was implemented in this documentation task.

Do not use `npm run restore` to recover a MySQL service. It deliberately refuses MySQL. Do not replace server data files, erase volumes or delete records as an improvised recovery method.

Recovery requires separate approval: preserve current state/backups, coordinate writers, restore into **new isolated schemas**, verify table/record counts and typed content/relationships/keys/authentication/application operations, and obtain approval before switching connections. Preserve the prior state for rollback.

`scripts/mysql/migrate.mjs` accepts validated export manifests, not raw snapshot files or MySQL dumps. Plan-only syntax is `node scripts/mysql/migrate.mjs EXPORT_DIR --plan NEW_OUTPUT_DIR`. Execution has additional explicit isolated-destination safeguards and is not a general production restore command. Do not run provision/import/reset tools merely to inspect the website.

## Automated verification

```powershell
node node_modules/eslint/bin/eslint.js . --max-warnings 0
node node_modules/typescript/bin/tsc --noEmit --incremental false
node scripts/verify-cms-json-import.cjs
node scripts/verify-lint-hooks.cjs
node scripts/mysql/verify-pool-backpressure.mjs
git diff --check
```

The seven-runner suite requires explicit private JSON environment files for the isolated local fixture server on `127.0.0.1:33326`, with its data directory under this project's `private` directory:

```powershell
node scripts/mysql/verify-regressions.mjs --owner-env private/queue-fix-20261108/owner-env.json --app-env private/queue-fix-20261108/app-env.json
```

This existing local command is not usable in a fresh clone without private setup. Owner fixture credentials provision new random test schemas, never deployed application schemas. The suite combines genuine MySQL persistence with deterministic framework/browser fixtures; it does not replace physical-browser exams. Keep evidence and credentials private. Recorded reports distinguish focused checks, HTTP cohorts and browser limits.

## Manual browser acceptance — next gate

Prepare an isolated local instance and give the owner its actual URL and private test credentials without putting them in public documentation. Use dedicated test accounts/assignments and preserve normal recordings/clocks.

1. Check administrator, student and candidate login/logout and access separation.
2. Check assignments, single modules and a full mock, question controls, audio, navigation and submission.
3. Enter distinguishable answers; check save status, controlled temporary network loss, recovery, refresh and final stored answers. Use disposable attempts, not real student exams.
4. Check CMS permissions, valid import/preview/commit, malformed JSON validation, publishing and media privacy.
5. Check practice, progress/history, booking dates, registration/admin visibility and result-release privacy.
6. Record failures; after corrections, retest affected behavior. Wait for the owner's acceptance before publication.

## New GitHub and Railway only

Before an explicitly approved GitHub write, verify the signed-in account is `website-lang-excel` and the remote is exactly `website-lang-excel/excel-ielts-mysql-test`. Review changed files, intended commit and secrets exclusions. Do not upload private environments, records, snapshots, backups, setup artifacts or keys.

Before a separately approved Railway operation, verify the account/project/environment/service IDs in MYSQL_AGENT.md. Preserve database records and volumes. Configure two distinct URLs, verified TLS and CA material, `CLASSROOM_HTTP=false`, exact HTTPS APP_ORIGIN and persistent private backup/media storage. Preserve the CA-materialization/start command and plan certificate renewal; repository defaults alone do not recreate the deployment. Keep the application account CRUD-restricted.

Deploy in an agreed test-free window. Verify revision/startup/login/database connections and controlled concurrent capacity against explicitly isolated destinations. Local 50-student results do not certify Railway capacity. Keep rollback available without deleting records.

Passing local tests does not automatically authorize a commit, push, deployment, variable update or production-database operation.
