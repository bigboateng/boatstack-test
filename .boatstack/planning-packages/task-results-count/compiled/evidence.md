# Planning evidence

- Bound request: `.boatstack/plans/inbox/task-results-count.md`
- Current heading and total count: `projects/basic-react/src/App.tsx`, task-list heading.
- Visible result derivation: `visibleTodos` in `projects/basic-react/src/App.tsx`; search and incomplete filtering determine membership before due-date sorting determines order.
- Reset behavior: `resetView` in `projects/basic-react/src/App.tsx`.
- Existing component coverage: `projects/basic-react/src/App.test.tsx`, including total count, search/filter composition, empty results, reset, and sorting behavior.
- Existing visual language: `.todo-count` in `projects/basic-react/src/App.css`.
- Required build: `npm --prefix projects/basic-react run build`.
- Required check: `npm --prefix projects/basic-react run check`.

Verification evidence must name the exact final committed source revision after the branch has been reduced to one commit relative to `test/software-delivery-flow-dx-search-20260817`.
