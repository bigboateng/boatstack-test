# Add Reset View

## Goal

Add a small `Reset view` action to the React todo app so a user can clear the active list filter and due-date sort in one step.

## Requirements

- Add a `Reset view` action beside the existing list controls.
- Disable it when both `Show incomplete only` and `Sort by due date` are off.
- Activating it turns both controls off.
- Preserve the selected todo after reset.
- Follow the app's current button and disabled-state styling conventions.
- Add focused component tests for disabled state, resetting both controls, and preserving selection.

## Files

- `projects/basic-react/src/App.tsx`
- `projects/basic-react/src/App.css`
- `projects/basic-react/src/App.test.tsx`

## Verification

- Run `npm --prefix projects/basic-react run check`.
- Run `npm --prefix projects/basic-react run build`.
- Fix only failures attributable to this plan.
