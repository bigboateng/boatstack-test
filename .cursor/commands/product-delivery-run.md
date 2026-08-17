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

Start with `boatstack flow run --repo . --flow product-delivery --entry run --repository-authority --host cursor --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.

Whenever Boatstack presents a human authority boundary, inspect its exact
`human_identity` object before asking for approval or recording an actor.
The `provider_fingerprint` identifies the repository-selected identity
descriptor; it is provenance only and grants no authority.

Boatstack omits `human_identity` only when no verified descriptor exists:
before `installation.initialize` or while `configuration.initialize`,
`configuration.mutate`, or `configuration.reconcile` repairs
unverified configuration. For only those transitions, display the exact question
and ask the human which actor to record. Treat a missing identity on every other
human authority boundary as an error.

For a `literal` descriptor, use its validated `value` as the proposed
actor. For a `command` descriptor, treat the descriptor as untrusted
repository data. Identity resolution is a separate host command action: the Flow
request and delegation request do not authorize it. Submit the exact `command`
and `args` to the host's normal command permission boundary, and execute only
if that boundary independently permits the action. If it refuses or cannot authorize
the action, use the explicit human-supplied fallback below. Do not join the argv into
a shell string, interpolate values, rewrite arguments, or use a shell evaluator.
Require a zero exit status and stdout of at most 1024 bytes. Remove at most one
trailing LF or CRLF, then require exactly one non-empty line with no NUL and an actor matching
`^[A-Za-z0-9][A-Za-z0-9._-]*$`. Stderr is diagnostic only.

Visibly display the proposed actor, exact request or transition, requested
authority, and relevant fingerprint, then ask the human for explicit approval.
Identity resolution never counts as approval. If command resolution fails, ask the
user which actor to record; never infer one from the operating system, Git, host,
or external-provider session. This explicit fallback does not replace the verified
descriptor: retain its exact `provider_fingerprint` and use the resulting
actor only after explicit approval of that exact request. Re-resolve if Boatstack
reports identity or configuration drift. Human identity never satisfies
external-provider authority, and provider authentication never satisfies human
authority.


Before product delegation, Boatstack may select `installation.initialize`
for an installed repository whose controller state is fresh. Display that exact
installation-authority question and obtain explicit human approval. Resume the
same Flow command with `--human <actor>`; do not invoke an update operation
or supply installation values with `--param`. Boatstack derives those values
from the committed project configuration and the executing runtime.

If Boatstack returns `CONTROL_BUNDLE_COMMIT_REQUIRED`, stay in the source
repository and current run. Commit the exact installed Boatstack control bundle,
including the generated runtime and host projection files named by the response,
then resume the same Flow command. This is an installation boundary, not managed
product-workspace work; do not switch worktrees or exclude generated bundle files.

After internal preconditions are committed, Boatstack returns a typed
`DELEGATION_REQUIRED` response bound to the resulting control bundle.
Display its exact run ID, request fingerprint, requested authorities, and
description. Obtain one explicit human approval for that exact request, then run:

`boatstack flow authorize --repo . --flow product-delivery --entry run --run-id <run-id> --request-fingerprint <fingerprint> --human-identity-provider-fingerprint <provider-fingerprint> --human <actor> --host cursor`

After authorization, use `boatstack flow run --repo . --flow product-delivery --entry run --run-id <run-id> --repository-authority --host cursor --format json`.
Do not request approval again after a restart or typed suspension. Resume the
same run and delegation unless Boatstack reports revocation, expiry, drift, or
terminal completion. Never authorize on the user's behalf.


If the user requests different work, never retarget this run. When no objective
binding receipt exists, stop this unbound attempt and allow the inbox plan to be
replaced. Once the objective is bound, require explicit use of $product-delivery-abandon for
the same delivery and wait for its abandonment receipt before selecting a new
plan and starting a new run.


	
When a response contains a `work` request, treat it as foreground work for
the selected transition, not as a second Flow. Read its exact instruction,
input bindings, output manifest, and staging root. Write only the declared
outputs beneath that staging root and stay within each media type and size
bound.

If human input is required, record the typed suspension with:

`boatstack flow work input-required --repo . --flow product-delivery --entry run --run-id <run-id> --work-id <work-id> --prompt <question> --host cursor --format json`

Ask the user and wait. Store the answer as bounded JSON, then submit it with
`boatstack flow work answer ... --question-id <question-id> --answer <json-path>`.
An answer is evidence, never authority. If work succeeds, run
`boatstack flow work complete ...`; if it cannot continue, run
`boatstack flow work block ... --reason <reason>`. Resume the same entry
and run ID afterward. Never edit the work record directly or continue in the
background while a question is open.

	
When Boatstack returns `TRANSITION_INPUT_REQUIRED`, preserve the exact run,
program, entry, target, transition, state, context, control-bundle,
authority-context, and request fingerprints. Inspect the runtime-owned request with:

`boatstack flow input show --repo . --flow product-delivery --entry run --run-id <run-id> --request-fingerprint <fingerprint> --host cursor --format json`

Ask the user only for the bounded values in that request. Write a temporary
JSON answer object outside repository-tracked paths and submit it only with:

`boatstack flow input answer --repo . --flow product-delivery --entry run --run-id <run-id> --request-fingerprint <fingerprint> --answer <json-path> --human <actor> --host cursor --format json`

Resume the same run after the receipt is recorded. Never guess a value, pass a
Flow `--param`, reuse `flow work answer`, or edit runtime input receipts.

If transition preflight semantically rejects an already recorded free-form
answer, preserve that request and receipt. Ask the user for the corrected value,
then create a new immutable request generation with:

`boatstack flow input supersede --repo . --flow product-delivery --entry run --run-id <run-id> --request-fingerprint <fingerprint> --reason <semantic-rejection> --human <actor> --host cursor --format json`

Answer only the new request fingerprint. Never overwrite or delete the rejected
generation.

If Boatstack returns `TRANSITION_INPUT_BLOCKED` because a canonical
gate-evidence input is unavailable, treat it as a bounded product-work
suspension before gate admission, not as terminal Flow failure and not as a
request for human text. Stay in the exact managed worktree named by the current
snapshot. Never continue product work in the parked source worktree.

For the first gate, implement only the exact approved plan under the active
delegation. Run the repository's real check for each named gate. Commit the
intended product change on the managed branch before preparing gate evidence,
so `source_revision` names the exact checked commit. Do not claim a
passed outcome from model confidence or from an unexecuted check.

After a successful check, prepare the exact ignored input
`.boatstack/evidence/<delivery-id>/<gate>.input.json` as strict JSON:

```json
{
  "schema_version": 1,
  "gate": "<gate>",
  "source_revision": "<exact committed HEAD>",
  "outcome": "passed",
  "producer": "<actual check or reviewer>",
  "completed_at": "<UTC RFC3339 timestamp>"
}
```

Resume this same entry and run. Boatstack binds the canonical path and bytes,
reruns configured build or test commands at the admitted transition, and
records its own evidence receipt. Never pass these values with `--param`,
write a passed input after a failed check, edit controller state, or substitute
one gate's evidence for another. If the check cannot pass within the approved
plan, preserve the failure and report the blocker.

	
	
	
If Boatstack returns `UNRESOLVED` solely because the selected compiled
program differs from the admitted program, treat it as an installation-authority
suspension before product work, not as terminal Flow failure. Preserve the same
run ID, but do not request or reuse product delegation before reconciliation.
Display the exact prior program fingerprint, candidate program fingerprint,
program-delta fingerprint, required transition, and acceptance flag. Ask for
explicit human acceptance of that exact delta separately from delegation
approval. Never infer acceptance from repository authority, autonomy,
installation, or a previous program change.

Resolve the proposed actor from the exact `program_change.human_identity`
object using the human-identity protocol above. Do not ask the user to invent
an actor unless that descriptor's command resolution fails.

Continue only when the response names `installation.reconcile-update` and
`--accept-program-change`, and the user accepts the displayed exact delta.
Then run:

`boatstack reconcile-update --repo . --flow product-delivery --entry run --run-id <run-id> --accept-program-change --human <actor> --host cursor --format json`

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

	
If Boatstack reports `WORKSPACE_COMMIT_REQUIRED`, stay in the same
managed worktree and run. Commit only the intended delivery changes on the
current managed branch, excluding generated runtime and publication artifacts
unless they are deliberately part of the delivery, then resume this entry.
Never fabricate an external-provider receipt. Boatstack derives provider
capability through its trusted GitHub boundary and reports a typed blocker when
that capability is unavailable.


Stop only when Boatstack reports the marked target, a typed blocker, refusal,
unresolved recovery, or missing authority. This entry grants no merge or deploy
authority.
