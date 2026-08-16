---
name: product-delivery-abandon
description: "Run repository Flow entry abandon to target safely-abandoned. Use only when the user explicitly selects this repository Flow entry."
---

# Product Delivery Abandon

Run the repository-owned Flow "product-delivery" entry "abandon" until its marked target "safely-abandoned" is reached.
Boatstack does not interpret the entry name.

Before starting the Flow, verify that the `boatstack` command is
available (`command -v boatstack` on POSIX or `Get-Command boatstack` in
PowerShell). If it is absent, read the exact committed
`.boatstack/runtime.json` regular file. Report
`BOATSTACK_LAUNCHER_NOT_FOUND`, the pinned version and SHA-256, and the
tag-specific installer command for the current platform:

POSIX:
`BOATSTACK_MODE=hydrate BOATSTACK_VERSION=<exact-version> BOATSTACK_EXPECTED_RUNTIME_SHA256=<exact-sha256> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/operatorstack/boatstack/<exact-version>/install.sh)"`

PowerShell:
`$env:BOATSTACK_MODE='hydrate'; $env:BOATSTACK_VERSION='<exact-version>'; $env:BOATSTACK_EXPECTED_RUNTIME_SHA256='<exact-sha256>'; Invoke-RestMethod https://raw.githubusercontent.com/operatorstack/boatstack/<exact-version>/install.ps1 | Invoke-Expression`

Replace `<exact-version>` and `<exact-sha256>` only with the validated
values in the pin. The installer tag and runtime identity therefore come from
the same committed repository pin.
If the pin is absent or invalid, report `BOATSTACK_RUNTIME_PIN_MISSING` or
`BOATSTACK_RUNTIME_PIN_INVALID` and stop without guessing a version or
selecting `latest`.

Display the installer command and ask for explicit approval. Never run it or
authorize installation on the user's behalf. A bootstrap failure creates no
Flow run ID. Preserve any Boatstack bootstrap diagnostic verbatim, including
stderr, and resume this same requested entry only after the user has installed
the exact runtime.

Start with `boatstack next --repo . --flow product-delivery --entry abandon --repository-authority --host claude --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.




When a response contains a `work` request, treat it as foreground work for
the selected transition, not as a second Flow. Read its exact instruction,
input bindings, output manifest, and staging root. Write only the declared
outputs beneath that staging root and stay within each media type and size
bound.

If human input is required, record the typed suspension with:

`boatstack flow work input-required --repo . --flow product-delivery --entry abandon --run-id <run-id> --work-id <work-id> --prompt <question> --host claude --format json`

Ask the user and wait. Store the answer as bounded JSON, then submit it with
`boatstack flow work answer ... --question-id <question-id> --answer <json-path>`.
An answer is evidence, never authority. If work succeeds, run
`boatstack flow work complete ...`; if it cannot continue, run
`boatstack flow work block ... --reason <reason>`. Resume the same entry
and run ID afterward. Never edit the work record directly or continue in the
background while a question is open.


When Boatstack returns `TRANSITION_INPUT_REQUIRED`, preserve the exact run,
program, entry, target, transition, state, context, control-bundle, and request
fingerprints. Inspect the runtime-owned request with:

`boatstack flow input show --repo . --flow product-delivery --entry abandon --run-id <run-id> --request-fingerprint <fingerprint> --host claude --format json`

Ask the user only for the bounded values in that request. Write a temporary
JSON answer object outside repository-tracked paths and submit it only with:

`boatstack flow input answer --repo . --flow product-delivery --entry abandon --run-id <run-id> --request-fingerprint <fingerprint> --answer <json-path> --human <actor> --host claude --format json`

Resume the same run after the receipt is recorded. Never guess a value, pass a
Flow `--param`, reuse `flow work answer`, or edit runtime input receipts.

If transition preflight semantically rejects an already recorded free-form
answer, preserve that request and receipt. Ask the user for the corrected value,
then create a new immutable request generation with:

`boatstack flow input supersede --repo . --flow product-delivery --entry abandon --run-id <run-id> --request-fingerprint <fingerprint> --reason <semantic-rejection> --human <actor> --host claude --format json`

Answer only the new request fingerprint. Never overwrite or delete the rejected
generation.



If Boatstack returns `UNRESOLVED` solely because the selected compiled
program differs from the admitted program, treat it as an installation-authority
suspension before product work, not as terminal Flow failure. Preserve the same
run ID, but do not request or reuse product delegation before reconciliation.
Display the exact prior program fingerprint, candidate program fingerprint,
program-delta fingerprint, required transition, and acceptance flag. Ask for
explicit human acceptance of that exact delta separately from delegation
approval. Never infer acceptance from repository authority, autonomy,
installation, or a previous program change.

Continue only when the response names `installation.reconcile-update` and
`--accept-program-change`, and the user accepts the displayed exact delta.
Then run:

`boatstack reconcile-update --repo . --flow product-delivery --entry abandon --run-id <run-id> --accept-program-change --human <actor> --host claude --format json`

Require a committed `installation.reconcile-update` receipt whose prior,
candidate, and delta fingerprints match the accepted suspension and whose
program-change acceptance is true. If the receipt changes tracked control-bundle
files, verify that only its declared installation result changed, then commit
those exact files separately before product work. Rerun the same Flow run. Ask
for product delegation only after Boatstack returns the new exact delegation
request bound to the accepted bundle; then resume with that one delegation.
If the user declines, any fingerprint changes, the required transition differs,
reconciliation does not commit, or unrelated files changed, stop without
performing product effects.



Stop only when Boatstack reports the marked target, a typed blocker, refusal,
unresolved recovery, or missing authority. This entry grants no merge or deploy
authority.
