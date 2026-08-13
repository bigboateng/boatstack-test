---
name: product-delivery-run
description: "Implement one approved repository plan and publish a pull request Use only when the user explicitly selects this repository Flow entry."
---

# Product Delivery Run

Run the repository-owned Flow "product-delivery" entry "run" until its marked target "published-pr" is reached.
Boatstack does not interpret the entry name.

Start with `boatstack next --repo . --flow product-delivery --entry run --host codex --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.

If the user requests different work, never retarget this run. When no objective
binding receipt exists, stop this unbound attempt and allow the inbox plan to be
replaced. Once the objective is bound, require explicit use of $product-delivery-abandon for
the same delivery and wait for its abandonment receipt before selecting a new
plan and starting a new run.


Stop only when Boatstack reports the marked target, a typed blocker, refusal,
unresolved recovery, or missing authority. This entry grants no merge or deploy
authority.
