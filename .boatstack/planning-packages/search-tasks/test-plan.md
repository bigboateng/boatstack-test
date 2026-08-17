# Test plan

Add focused component tests that prove:

1. The `Search tasks` input matches title and notes with trimmed, case-insensitive substring semantics.
2. Search composes with incomplete-only filtering and due-date sorting.
3. Active search with no result shows `No matching tasks` and the empty details state.
4. Reset View clears search and both existing toggles and restores stored order.
5. Selection is preserved for visible results, deterministically moves to the first result when hidden, and focuses Search tasks when none remain.
6. Existing component tests remain green.

Run `npm --prefix projects/basic-react run check` and `npm --prefix projects/basic-react run build`.
