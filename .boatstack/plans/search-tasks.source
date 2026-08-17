# Search tasks delivery plan

Add one repository-local search query to the existing React todo view. The query is trimmed and case-folded, then matched as a substring against task title or notes before the existing incomplete-only filter and stable due-date sort are applied.

Keep selection by task ID when the selected task remains visible. When a view change hides it, select the first visible task deterministically; if no task remains, select none and place focus on the search input. Reset View clears query, incomplete-only, and due-date sorting.

Implement only in `projects/basic-react/src/App.tsx`, its component tests, and CSS if needed. Preserve existing CRUD, dialog, filter, sort, and accessibility behavior.
