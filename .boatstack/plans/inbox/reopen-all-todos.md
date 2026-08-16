# Add Reopen All Action

## Goal

Add a small action that reopens every completed todo so this disposable
consumer run has one bounded product objective.

## Requirements

- Add a `Reopen all` button beside the existing list actions.
- Disable it when no todos are completed.
- Activating it marks every todo incomplete in one state update.
- Keep the current todo selected when it still exists.
- Update the completion summary immediately.
- Follow the app's existing button and spacing conventions.
- Add focused component tests for enabled, disabled, and successful behavior.

## Files

- `projects/basic-react/src/App.tsx`
- `projects/basic-react/src/App.test.tsx`
- `projects/basic-react/src/App.css` only if existing styles are insufficient.

## Verification

- Run `npm --prefix projects/basic-react run check`.
- Run `npm --prefix projects/basic-react run build`.
- Fix only failures attributable to this plan.
