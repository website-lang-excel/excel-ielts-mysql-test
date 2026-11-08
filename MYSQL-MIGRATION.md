# MySQL recovery and import entry point

Current source-verified instructions are in [MYSQL_OPERATIONS.md](MYSQL_OPERATIONS.md). This entry point exists because the guarded restore command refers to this filename.

The website's live application persistence is MySQL. No database operation is authorized by this document.

- Do not use file-replacement restore for MySQL.
- Preserve current records, backups and persistent volumes.
- Obtain explicit approval for provisioning, importing, restoring or switching database connections.
- Use a new isolated MySQL destination and verify counts, typed content, constraints, relationships, approved keys, authentication and application operations before a separately approved switch.
- The importer accepts validated manifests for both schemas, not arbitrary raw backup files. Planning does not authorize execution.
- Follow the new-project account boundaries and publication gates in [MYSQL_AGENT.md](MYSQL_AGENT.md).

For local browser testing, follow the prepared-database prerequisites and acceptance checklist in the operations guide. Do not initialize or replace existing application storage to make a test start.
