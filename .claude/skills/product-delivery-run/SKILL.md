---
name: product-delivery-run
description: "Implement one approved repository plan and publish a pull request Use only when the user explicitly selects this repository Flow entry."
---

# Product Delivery Run

Run the repository-owned Flow "product-delivery" entry "run" until its marked target "published-pr" is reached.
Boatstack does not interpret the entry name.

Start with `boatstack next --repo . --flow product-delivery --entry run --host claude --format json`.
Preserve the returned program fingerprint, entry, run ID, delivery, repository,
worktree, host, actor, authority receipts, prescription, and receipts through
every `next`, `apply`, recovery, question, and re-resolution.

Apply only the exact immediately preceding prescription and its declared
parameters. A question suspends this run: ask the user, submit only the typed
answer evidence, and resume the same run ID. Nothing continues in the
background while input is missing. Never synthesize authority.

Stop only when Boatstack reports the marked target, a typed blocker, refusal,
unresolved recovery, or missing authority. This entry grants no merge or deploy
authority.
