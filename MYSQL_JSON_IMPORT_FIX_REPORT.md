# CMS JSON import validation repair

Completed locally: 8 November 2026. Not committed, pushed or deployed.

## Cause and change

`lib/learning/imports.ts` called JSON.parse on uploaded JSON without handling syntax errors. The resulting SyntaxError reached studentEndpoint's generic HTTP 500 response. The parser now catches only SyntaxError and raises the existing HTTP 400 StudentError with:

> Invalid JSON file. Check the JSON syntax and upload it again.

Unexpected exceptions still propagate to the existing server-error handler. File contents and parser internals are not included in the message. The existing CMS client already displays the server's error message; no interface changes were necessary.

Existing JSON-array/object validation, BOM handling, size/row limits, authentication, CSV/XLSX processing, previews and commits are unchanged. No schema or persistence changes were needed. Mock tests and their mechanisms were untouched.

## Files

- lib/learning/imports.ts — narrow syntax-error handling.
- scripts/verify-cms-json-import.cjs — seven focused regression groups.
- MYSQL_AGENT.md — local issue status.
- This report.

## Verification

`node scripts/verify-cms-json-import.cjs`: seven groups passed against the actual route, bounded request-body parser, file parser and HTTP error wrapper. Authentication and its rate-limit write were stubbed; tests performed no database access.

Coverage: malformed/truncated JSON and trailing commas return HTTP 400 with the exact safe message and no-store header; valid arrays, Unicode BOM and uppercase extension remain accepted with identical rows; invalid shapes and over-1,000 rows remain HTTP 400; malformed outer request JSON remains HTTP 400; both encoded and decoded file-size limits remain HTTP 413; CSV and unsupported-extension behavior are preserved; denied administrator access remains HTTP 403.

TypeScript (`tsc --noEmit --incremental false`), scoped ESLint for the parser and new test, and `git diff --check` passed. Git's existing LF/CRLF notices are not diff errors.

Full production build, full MySQL suite and physical-browser upload were not repeated for this narrow parser change. No database-dependent import commit behavior was changed or newly certified. The seven-runner/116-group result from Issue 2 remains the previous full-suite verification.

All work remains local. Existing unrelated changes were preserved. No credentials, production data, original SQLite databases, backups, GitHub repositories or Railway services were modified.
