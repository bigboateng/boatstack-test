# Search tasks

Add a task-search control to the existing todo application.

## Acceptance criteria

- Label the input `Search tasks`.
- Match a trimmed query case-insensitively as a substring of either the task title or notes.
- Compose search with the existing incomplete-only filter and due-date sorting.
- Show `No matching tasks` when the active view has no results.
- `Reset View` clears search and both existing view controls.
- Preserve deterministic task selection and focus behavior as results change.
- Add component tests covering matching, composition, empty state, reset, and selection/focus behavior.
- Run the configured build and test commands and publish a real pull request without merging it.
