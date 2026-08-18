# Test plan

## Component tests

- Default view displays the unchanged total and `3 shown`.
- Incomplete-only filtering updates the shown count while preserving the total.
- Search updates the shown count while preserving the total.
- Reset View restores the default shown count.
- A search with no matches displays `0 shown`.
- Due-date sorting after filtering preserves both counts.
- The changing visible count is exposed through the intended accessible live-region semantics.

## Required repository checks

- `npm --prefix projects/basic-react run build`
- `npm --prefix projects/basic-react run check`

Run both commands after the branch is rewritten to its final single commit. Evidence must use that commit as `source_revision`.
