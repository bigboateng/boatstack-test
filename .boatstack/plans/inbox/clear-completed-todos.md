# Add Clear Completed

## Goal

Add a `Clear completed` action to the React todo app that removes every completed task while preserving a valid selection.

## Requirements

- Add a `Clear completed` action with the existing list controls.
- Disable the action when no todos are completed.
- Keep the current selection when the selected todo remains after clearing.
- Select the first remaining todo when the selected todo is removed.
- Use the existing empty selection state when no todos remain.
- Follow the app's current button and disabled-state styling conventions.
- Add focused component tests for disabled state, bulk removal, retained selection, fallback selection, summary updates, and the all-completed empty state.

## Files

- `projects/basic-react/src/App.tsx`
- `projects/basic-react/src/App.css`
- `projects/basic-react/src/App.test.tsx`

## Verification

- Run `npm --prefix projects/basic-react run check`.
- Run `npm --prefix projects/basic-react run build`.
- Fix only failures attributable to this plan.
