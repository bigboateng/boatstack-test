# Feature specification

## Search

- Render a text input with the accessible label `Search tasks` in the list controls.
- Normalize with `trim().toLocaleLowerCase()` and match with substring semantics against normalized title or notes.
- An empty or whitespace-only query shows all tasks allowed by the other controls.
- Apply search, incomplete-only filtering, and stable due-date sorting as one deterministic view pipeline.

## Empty and reset behavior

- When tasks exist but the composed view is empty and search is active, show `No matching tasks`.
- Preserve the existing `No incomplete tasks.` and `No tasks yet.` states when search is inactive.
- Reset View clears search, incomplete-only, and due-date sorting, and is enabled when any of those controls is active.

## Selection and focus

- Preserve selection by ID when visible.
- If filtering hides the selection, select the first visible task in composed order.
- If no result remains, clear selection and move focus to Search tasks.
- Do not move focus merely because sorting changes position or the selected task remains visible.
