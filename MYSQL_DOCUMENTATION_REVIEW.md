# MySQL documentation review and browser-test handoff

Completed locally on 8 November 2026. Only the new MySQL project was accessed. No commit, push or deployment was performed.

## Documentation completed

- README.md: current four-fix status, accurate setup prerequisites, intended local URL, account boundaries and publication gates.
- AGENTS.md: corrected project root, runtime architecture, asynchronous database operations, provisioning/keys, backup coverage, recovery and persistent deployment storage. Detailed exam safeguards and generated framework instructions were preserved.
- MYSQL_AGENT.md: current status supersedes the historical findings; links the operations guide and records the isolated manual-test setup.
- MYSQL_OPERATIONS.md (new): verified environment variables, runtime helper prerequisites, backup/recovery limitations, checks and manual acceptance/deployment sequence.
- MYSQL-MIGRATION.md (new): resolves the existing guarded restore command's documentation reference and directs operators to approved isolated MySQL recovery guidance.

Source checks covered package/runtime versions, database runtime/adapter, both store entry points, pool defaults, startup and maintenance, backup/snapshot/restore tools, importer CLI, local launch/stop/environment helpers and regression runner requirements. Public video instructions did not need changes.

Local Markdown links passed. Git diff checks passed. The generated Next.js instruction block is unchanged. No application source, styles, schema or exam policy was edited during this step. Earlier approved code changes were retained. No unnecessary regression/build rerun was performed for documentation edits; the previously verified production build was used for the local handoff.

## Important operational facts

Automatic snapshots currently cover results only, not the whole students/CMS schema and media. The guide now explicitly states this limit. Full backup scheduling/retention and isolated recovery rehearsal remain operational responsibilities; documentation is not implementation of a new backup mechanism.

Private local startup helpers and credentials are not part of a public clone. GitHub publication does not provision databases or transfer accounts/keys. Remote TLS, private persistent paths, exact origins and the configured deployment start command must be preserved.

## Isolated manual acceptance instance

A new pair of randomly named local fixture schemas was created on the owned test MySQL instance at 127.0.0.1:33326, after checking its private data-directory identity. Existing schema records were not overwritten or deleted. The instance uses restricted application credentials, not owner credentials for normal HTTP requests.

Generated fixtures: one administrator, one Portal student, four distinct candidates (full, Listening, Reading, Writing), one course/lesson, five practice questions and a practice set. Existing disposable local readiness keys were copied into the new schemas; they are fixture scoring data, not an approved-answer audit. No account/history was copied from a running deployment. All schema integrity/relationship checks passed at preparation.

Ignored private artifacts include:

```text
private/prepare-manual-20261108.cjs
private/start-manual-20261108.mjs
private/manual-acceptance-20261108/environment.json
private/manual-acceptance-20261108/credentials.json
private/manual-acceptance-20261108/preparation.json
private/manual-acceptance-20261108/http-smoke.json
private/manual-acceptance-20261108/server-out.log
private/manual-acceptance-20261108/server-error.log
```

Configuration and credentials are Git-ignored and were not printed in logs or copied into public documentation. Private reset-delivery variables are excluded from the local launcher. The local server binds only 127.0.0.1:3307. Private filesystem backups/media are inside this workspace.

Twelve actual local HTTP checks passed: homepage, administrator/student login pages, administrator authentication/dashboard, authenticated CMS overview, malformed import's exact HTTP 400 message, student authentication/dashboard/courses/progress and assigned Reading candidate authentication. No exam was started by these smoke checks; candidate assignments remain available for owner testing. This is HTTP verification, not physical browser/media verification.

## Owner testing gate

At handoff, open **http://127.0.0.1:3307**. Use the private login file on this computer. Check logins, normal mock audio/navigation/answers, autosave/recovery/submission, CMS imports/publishing/media, practice/progress/history and booking registration/admin visibility. Keep normal recordings and clocks. Scores for the mock fixtures are not correctness evidence.

The local launcher can be restarted with `node private/start-manual-20261108.mjs` from the project root only when the website is not already listening. It is a private machine-specific helper, not a new public package script. Do not stop an unidentified process or initialize a data directory if startup fails.

Wait for the owner's explicit manual acceptance and publication approval before GitHub work; separately verify the new Railway account/project before approved deployment. No production cutover or load test is authorized merely by these local smoke results. A controlled isolated Railway capacity check remains necessary after eventual deployment.
