# Desktop MySQL project handover

Relocated with owner approval on 8 November 2026 (Asia/Dhaka).

## Start here in the new chat

Open this folder as the workspace: C:/Users/Asus/Desktop/IELTS-MYSQL. Read AGENTS.md, MYSQL_AGENT.md and this file before making changes. The old Documents project location is retired. Do not edit other historical projects or backups.

## GitHub and Railway

- Existing Git history and remote preserved; branch main.
- Only permitted repository: https://github.com/website-lang-excel/excel-ielts-mysql-test
- Relocation baseline commit: bd56d3adaa5c524610da2caf93c93319b9a9a13b.
- That commit was verified deployed successfully before relocation. The GitHub main automatic trigger was subsequently verified present for the new Railway website service.
- No commit, push, deployment, production data transfer, Railway configuration or production database change was performed for relocation.
- Four documentation files have uncommitted path updates; this handover is a new uncommitted file. Private launcher/config/environment path adjustments are Git-ignored. Do not push without a new explicit command.

## Local startup

Use Node.js 24.x. Dependencies and the existing verified production build were copied.

In PowerShell:

    cd "C:\Users\Asus\Desktop\IELTS-MYSQL"
    node private/start-manual-20261108.mjs

Open http://127.0.0.1:3307 (website port). MySQL uses 127.0.0.1:33326 (different port). Do not start another copy when the port is already occupied.

This starts the existing isolated MANUAL-ACCEPTANCE fixture environment. Its admin/student/candidate logins are in private/manual-acceptance-20261108/credentials.json: view locally, never paste/upload. These are disposable local records and fixture scoring keys, NOT a copy of live Railway accounts or certified production keys.

The root still intentionally has no .env.mysql.private/.local-mysql.json. Therefore npm run local:mysql is NOT the configured launcher for this project. Use the command above. Do not invent metadata, initialize/reset databases or import deployed records to make another launcher work.

The complete existing stopped local database directory was copied to private/queue-fix-20261108/mysql-data. Its my.ini now uses this Desktop location and the copied portable MySQL 8.4.13 runtime under mysql-local-runtime/distribution/mysql-8.4.13-winx64. No external runtime path is needed. No schemas or records were deleted. It includes historical isolated test schemas; do not interpret their counts as live students.

The initial relocated MySQL boot exceeded the old launcher's 10-second ready wait; retrying after readiness succeeded without changing application code. If this recurs, inspect the private MySQL log and confirm server readiness before retrying; never reinitialize its data directory.

Stop the website with Ctrl+C in its launcher terminal. To stop ONLY this local MySQL server after the site is stopped:

    node private/queue-fix-20261108/shutdown.mjs

The shutdown helper validates port and data-directory ownership before issuing shutdown.

For a later rebuild, first stop the website and use the existing private environment wrapper:

    node private/queue-fix-20261108/run.mjs node_modules/next/dist/bin/next build

Do not build into .next while a running site uses it. The earlier full build/regression verification is documented in MYSQL_SESSION_PERFORMANCE_REPORT.md. No application code changed during relocation.

## Relocation verification

- All 30,314 original project files (2,425,351,256 bytes) SHA-256 matched before path edits/startup, including hidden/ignored files and Git history.
- An additional 296 portable MySQL runtime files (1,263,141,970 bytes) were copied from the existing distribution.
- git fsck --full passed; remote and branch preserved.
- Relocated MySQL 8.4.13: all 1,555 local base tables across 84 schemas passed CHECK TABLE, with 16,405 readable rows before application startup.
- Local website startup passed; see private/desktop-http-verification.json for HTTP checks.
- Full source-copy hash report: private/desktop-copy-verification.json. Local path-change list: private/desktop-relocation-path-changes.json.
- New Desktop folder access restricted to the current Windows user, SYSTEM and administrators to protect private credentials.
- Existing backups and historical projects were not modified. Remote database contents remain on Railway; moving the local folder does not relocate production data.

## Next proposed work — not implemented

Owner wants a lighter site: retain the existing mock-test accounts, assignments, content, private keys, autosave/recovery, results and exam mechanisms. Discussed removing Learning CMS, Student Portal accounts/progress and booking features, but no deletion is authorized by this relocation task.

Proposed replacement homepage card: Student Practice, without registration or database writes, offering Listening/Reading self-marking with static public practice keys, and Writing prompts/editor/word count/self-review. Decide whether to use separate practice content or existing Tests 1–20; publishing existing mock keys would expose those exam answers. This decision remains unanswered. Show exact dependency/removal plan and obtain approval before implementation or data deletion.

## Safety boundaries

Only this new MySQL repository/Railway account/project may be used. Original repositories, websites, databases and complete backups are off-limits. Preserve the mock-test interface, mechanisms, timing, security and content. Never upload private/, mysql-local-runtime/, credentials, environment files, database files or backups. Verify the new GitHub account and exact destination before any approved publication.

Move completion: all 296 copied runtime files also matched SHA-256. The verified original Documents MySQL project folder was removed; the Desktop copy is now the sole active working project. HTTP /admin/login returned 200 after removal. No source, database or runtime dependency remains on that removed project folder. Other historical folders and the external source runtime were left untouched.
