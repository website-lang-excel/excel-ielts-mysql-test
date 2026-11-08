# Excel IELTS — MySQL website

Separate MySQL-compatible copy of the IELTS application. Application reads/writes use MySQL, with separate results and Student Portal/CMS schemas. Exam content, UI, scoring, timers, autosave and recovery policies are preserved.

## Scope

This repository contains application source and public media only. It does not contain database records, accounts, password hashes, private answer keys, database exports, backups, local credentials or the portable local MySQL server. Publishing this repository does not provision a database or deploy a website. The existing production repository and Railway website are separate and unchanged.

## Requirements and configuration

- Node.js 24.x and genuine MySQL 8.0.30+ (locally tested with MySQL 8.4.13).
- Two separately configured MySQL schemas. Existing data/schema must be provisioned through the reviewed private migration process; application startup does not create/seed a fresh schema or administrator.
- Copy the placeholder .env.example to an ignored .env.local, set DB_BACKEND=mysql and the two database URLs. Never commit actual values. Remote databases require verified TLS; MYSQL_TLS_MODE=disabled is permitted only for loopback.
- CLASSROOM_HTTP=true is local HTTP only. Do not enable it on Railway. Configure the actual APP_ORIGIN and private persistent backup/media paths for the intended environment.

## Run against a prepared database

```powershell
npm ci
npm run build
npm run start -- --hostname 127.0.0.1 --port 3307
```

Open `http://127.0.0.1:3307` for the commands above, with APP_ORIGIN matching that exact origin. MySQL must already be running. These are startup instructions, not a claim that a server is currently running.

The convenience commands `local:mysql`, `build:mysql`, `start:mysql` and `stop:mysql` require private machine configuration. This working tree currently has no root `.local-mysql.json` or root private environment file. Do not copy configuration from another project or reinitialize a database to make those helpers work. See [MYSQL_OPERATIONS.md](MYSQL_OPERATIONS.md).

## Migration, backups and verification

See [MYSQL_OPERATIONS.md](MYSQL_OPERATIONS.md) for MySQL backup coverage and recovery limits. Current automatic snapshots cover the results schema only; complete protection must also cover students/CMS and private media. Recovery requires an isolated destination, verification and separately approved connection changes. Existing importer tooling does not provision a database merely because the repository is published.

As of **8 November 2026**, all four approved code issues are fixed locally:

- MySQL queue/backpressure: progressive 5/10/20/50-student tests and another 50-student run passed. See [MYSQL_POOL_FIX_REPORT.md](MYSQL_POOL_FIX_REPORT.md).
- Seven regression runners: 116 groups passed. See [MYSQL_REGRESSION_FIX_REPORT.md](MYSQL_REGRESSION_FIX_REPORT.md).
- Malformed CMS JSON imports: clear HTTP 400 validation response; seven focused groups passed. See [MYSQL_JSON_IMPORT_FIX_REPORT.md](MYSQL_JSON_IMPORT_FIX_REPORT.md).
- Full lint: zero errors/warnings, with reviewed intentional exceptions. TypeScript and production build passed. See [MYSQL_LINT_FIX_REPORT.md](MYSQL_LINT_FIX_REPORT.md).

These are finite local checks, not full-duration browser/audio or Railway capacity certification. Manual browser acceptance and the eventual new Railway deployment checks remain outstanding.

## Approved destinations and workflow

Work only in `C:/Users/Asus/Documents/Codex/website-lang-excel-mysql`, the [website-lang-excel/excel-ielts-mysql-test](https://github.com/website-lang-excel/excel-ielts-mysql-test) repository and the new Railway project identified in [MYSQL_AGENT.md](MYSQL_AGENT.md). No other accounts or projects are authorized.

See [MYSQL_OPERATIONS.md](MYSQL_OPERATIONS.md) for verified configuration, backup coverage, recovery restrictions, local test commands and manual acceptance. Local work and passing checks do not authorize publishing. Under the owner's current instruction, an explicit request to send changes to GitHub means updating this repository's `main` branch and its linked automatic Railway deployment, without substituting another branch or asking for a separate normal-deployment approval.

That linked-main workflow does not authorize database migrations, data replacement or unrelated infrastructure/account changes.
