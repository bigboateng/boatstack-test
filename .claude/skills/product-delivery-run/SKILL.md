---
name: product-delivery-run
description: "Run repository Flow entry run to target published-pr. Use only when the user explicitly selects this repository Flow entry."
---

# Product Delivery Run

Run the repository-owned Flow "product-delivery" entry "run" until its marked target "published-pr" is reached.
Boatstack does not interpret the entry name.

Before starting the Flow, verify that the `boatstack` command is
available (`command -v boatstack` on POSIX or `Get-Command boatstack` in
PowerShell). If it is absent, read the exact committed
`.boatstack/runtime.json` regular file. Report
`BOATSTACK_LAUNCHER_NOT_FOUND`, the pinned version and SHA-256, and the
tag-specific installer command for the current platform:

POSIX:
`BOATSTACK_MODE=hydrate BOATSTACK_VERSION=<exact-version> BOATSTACK_EXPECTED_RUNTIME_SHA256=<exact-sha256> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/operatorstack/boatstack/v2.0.0-foreground-latest-test/install.sh)"`

PowerShell:
`$env:BOATSTACK_MODE='hydrate'; $env:BOATSTACK_VERSION='<exact-version>'; $env:BOATSTACK_EXPECTED_RUNTIME_SHA256='<exact-sha256>'; Invoke-RestMethod https://raw.githubusercontent.com/operatorstack/boatstack/v2.0.0-foreground-latest-test/install.ps1 | Invoke-Expression`

Replace `<exact-version>` and `<exact-sha256>` only with the validated
values in the pin. The installer comes from Boatstack v2.0.0-foreground-latest-test, the runtime version
that generated this skill, so it can hydrate older pinned runtime artifacts.
If the pin is absent or invalid, report `BOATSTACK_RUNTIME_PIN_MISSING` or
`BOATSTACK_RUNTIME_PIN_INVALID` and stop without guessing a version or
selecting `latest`.

Display the installer command and ask for explicit approval. Never run it or
authorize installation on the user's behalf. A bootstrap failure creates no
Flow run ID. Preserve any Boatstack bootstrap diagnostic verbatim, including
stderr, and resume this same requested entry only after the user has installed
the exact runtime.

Start with `boatstack next --repo . --flow product-delivery --entry run --repository-authority --host claude --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.

The first `next` returns a typed `DELEGATION_REQUIRED` response before
managed state changes. Display its exact run ID, request fingerprint, requested
authorities, and description. Obtain one explicit human approval for that exact
request, then run:

`boatstack flow authorize --repo . --flow product-delivery --entry run --run-id <run-id> --request-fingerprint <fingerprint> --human <actor> --host claude`

After authorization, use `boatstack flow run --repo . --flow product-delivery --entry run --run-id <run-id> --repository-authority --host claude --format json`.
Do not request approval again after a restart or typed suspension. Resume the
same run and delegation unless Boatstack reports revocation, expiry, drift, or
terminal completion. Never authorize on the user's behalf.




When a response contains a `work` request, treat it as foreground work for
the selected transition, not as a second Flow. Read its exact instruction,
input bindings, output manifest, and staging root. Write only the declared
outputs beneath that staging root and stay within each media type and size
bound.

If human input is required, record the typed suspension with:

`boatstack flow work input-required --repo . --flow product-delivery --entry run --run-id <run-id> --work-id <work-id> --prompt <question> --host claude --format json`

Ask the user and wait. Store the answer as bounded JSON, then submit it with
`boatstack flow work answer ... --question-id <question-id> --answer <json-path>`.
An answer is evidence, never authority. If work succeeds, run
`boatstack flow work complete ...`; if it cannot continue, run
`boatstack flow work block ... --reason <reason>`. Resume the same entry
and run ID afterward. Never edit the work record directly or continue in the
background while a question is open.


Stop only when Boatstack reports the marked target, a typed blocker, refusal,
unresolved recovery, or missing authority. This entry grants no merge or deploy
authority.
