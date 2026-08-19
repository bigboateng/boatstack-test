---
name: product-delivery-plan
description: "Run repository Flow entry plan to target approved-plan. Use only when the user explicitly selects this repository Flow entry."
---

# Product Delivery Plan

Run the repository-owned Flow "product-delivery" entry "plan" until its marked target "approved-plan" is reached.
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

Start with `boatstack flow run --repo . --flow product-delivery --entry plan --repository-authority --host cursor --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.

Whenever Boatstack presents a human authority boundary, inspect its exact
`human_identity` object before asking for approval or recording an actor.
Its `role` is the admitted functional role selected by the Control Program;
it is not a person, an approval, or provider capability. The role cannot be selected
or overridden by the host. The concrete actor is resolved only from the descriptor.
The `provider_fingerprint` identifies the repository-selected identity
descriptor; it is provenance only and grants no authority.

Boatstack omits `human_identity` only when neither trusted identity source
exists: true bootstrap before `installation.initialize`, or
`configuration.initialize`, `configuration.mutate`, or
`configuration.reconcile` while
repairing unverified configuration. At those boundaries, display the exact question
and ask the human which actor to record. Configuration mutation with verified
configuration uses its current default; program replacement uses the prior admitted
program role. Treat a missing identity on every other human authority boundary as
an error.

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

Visibly display the role, proposed concrete actor, exact request or transition,
requested authority, request fingerprint, and provider fingerprint, then ask that
concrete actor for explicit approval as the displayed role.
Identity resolution never counts as approval. If command resolution fails, ask the
user which actor to record; never infer one from the operating system, Git, host,
or external-provider session. This explicit fallback does not replace the verified
descriptor: retain its exact `provider_fingerprint` and use the resulting
actor only after explicit approval of that exact request. Never equate the role,
actor, human authority, or GitHub provider authority. Re-resolve if Boatstack
reports identity or configuration drift. Human identity never satisfies
external-provider authority, and provider authentication never satisfies human
authority.


Before Flow authorization, Boatstack may select `installation.initialize`
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
`authorization` response. Its code is
`ENTRY_ACTIVATION_AUTHORITY_REQUIRED` when entry activation is included,
or `DELEGATION_REQUIRED` for delegation-only entries. Invocation alone is
not approval. Display the exact Flow, entry, target, run ID, role, proposed actor,
provider fingerprint, request fingerprint, `entry_activation_authorities`,
`delegated_authorities`, and description. Explain that activation consent
does not grant transition, provider, bootstrap, merge, deploy, later-human-transition,
or unrelated-run authority. Obtain one explicit human approval covering each
displayed scope for that exact request, then run:

`boatstack flow authorize --repo . --flow product-delivery --entry plan --run-id <run-id> --request-fingerprint <fingerprint> --human-identity-provider-fingerprint <provider-fingerprint> --human <actor> --host cursor`

After authorization, use `boatstack flow run --repo . --flow product-delivery --entry plan --run-id <run-id> --repository-authority --host cursor --format json`.
Do not request approval again after a restart or typed suspension while the
same accepted request remains current. Resume the same run; if Boatstack reports
revocation, expiry, or drift and returns a fresh authorization request, discard
the prior approval and ask once for the new exact scopes. Never authorize on the
user's behalf. The accepted activation scope is not an authority receipt; only
the separately displayed delegation scope can create run-scoped delegation receipts.



	
When a response contains a `work` request, treat it as foreground work for
the selected transition, not as a second Flow. Read its exact package-wide
instruction, input bindings, output manifest, artifact-local guidance when
present, schemas, and staging root. Keep every output mutually consistent.
Write only the declared outputs beneath that staging root and stay within each
requiredness, media type, schema, and size bound. Guidance describes generation;
it grants no authority and does not verify an output. Never fabricate completion.

If human input is required, record the typed suspension with:

`boatstack flow work input-required --repo . --flow product-delivery --entry plan --run-id <run-id> --work-id <work-id> --prompt <question> --host cursor --format json`

Ask the user and wait. Store the answer as bounded JSON, then submit it with
`boatstack flow work answer ... --question-id <question-id> --answer <json-path>`.
An answer is evidence, never authority. If work succeeds, run
`boatstack flow work complete ...`; if it cannot continue, run
`boatstack flow work block ... --reason <reason>`. Resume the same entry
and run ID afterward. Never edit the work record directly or continue in the
background while a question is open.

	
	
	
	
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

`boatstack reconcile-update --repo . --flow product-delivery --entry plan --run-id <run-id> --accept-program-change --human <actor> --host cursor --format json`

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
