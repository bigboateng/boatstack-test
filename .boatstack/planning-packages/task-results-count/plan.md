# Implementation plan

1. Update the task-list heading in `projects/basic-react/src/App.tsx` to render the existing total and the current `visibleTodos.length` as `N shown`.
2. Scope polite live-region behavior to the changing count group or visible count so assistive technology receives current-view updates without repeated heading announcements.
3. Reuse the existing count styling and avoid unrelated UI changes.
4. Add focused component tests in `projects/basic-react/src/App.test.tsx` for default, incomplete-filtered, searched, reset, zero-result, and sorted views.
5. Run the configured build and check commands.
6. Preserve the planning package and generated reviewer-facing verification evidence.
7. Reduce all feature-branch changes to exactly one commit relative to `test/software-delivery-flow-dx-search-20260817`.
8. Rerun the required build and check against the final commit and regenerate evidence with that exact source revision.
9. Publish a real pull request and leave it open.
