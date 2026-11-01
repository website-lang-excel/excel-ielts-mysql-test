# Excel IELTS — MySQL test version

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

The already-prepared local version on the owner's computer remains in its separate local directory and can be started there with npm run local:mysql. Its portable-runtime metadata and credentials are intentionally excluded here. Those convenience helpers require private machine metadata and are not a database installer for a new clone.

## Migration, backups and verification

scripts/mysql/export-sqlite.py captures nonintrusive private source copies. scripts/mysql/migrate.mjs validates/plans and imports only explicitly confirmed empty isolated destinations; it refuses to overwrite/adopt existing databases. Keep exports private. Backup commands use the private runtime environment and export consistent SQLite-format snapshots from MySQL; the live application still uses MySQL. File-replacement restore refuses MySQL; recovery must use a new empty destination and verification before a separately approved switch.

Local verification passed database record hashes/relationships, restoration, ten-candidate HTTP flows, auth, CMS, practice types, mock module progression, autosave/recovery and bookings. The production build passed. Full lint has 12 pre-existing errors and 29 warnings in unchanged original files; migration-scoped lint has no new findings. Manual browser/audio and future-host testing remain required.

No deployment, production migration, existing-repository update or Railway change is authorized by publication of this test repository.
