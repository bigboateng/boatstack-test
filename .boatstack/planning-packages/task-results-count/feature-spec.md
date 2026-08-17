# Visible task count

## Goal

Show how many tasks are currently visible beside the existing total task count so the heading reflects search and incomplete-only filtering without changing the meaning of the total.

## Behavior

- Keep the existing `N total` value based on all tasks.
- Always render `N shown` beside it, including the default and zero-result states.
- Base `N shown` on the current `visibleTodos` collection.
- Search and incomplete-only filtering update `N shown`.
- Reset View restores the full visible set and its count.
- Due-date sorting only changes order and must not change either count.
- Changes to the current view must be understandable to assistive technology without making the whole heading unnecessarily verbose.

## Scope

The implementation should be limited to the task-list heading in `projects/basic-react/src/App.tsx` and focused component coverage in `projects/basic-react/src/App.test.tsx`. Reuse `.todo-count` unless a small style adjustment is necessary.

## Delivery constraints

- Preserve the committed Boatstack planning package and verification artifacts.
- Before publication, place every pull-request change in exactly one commit relative to `test/software-delivery-flow-dx-search-20260817`.
- Run required checks after the final rewrite and bind evidence to that final revision.
- Publish the pull request and leave it open.
