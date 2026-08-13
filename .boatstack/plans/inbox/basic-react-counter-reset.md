# Add counter reset

## Goal

Add a reset action to the counter in `projects/basic-react` so the delivery Flow exercises a real, bounded product change.

## Requirements

- Keep the existing increment behavior.
- Add a `Reset steps` button that sets the counter to zero.
- Disable the reset button while the counter is already zero.
- Preserve accessible names and the live counter status.
- Extend the component test to cover incrementing, resetting, and the disabled zero state.

## Verification

Run the repository-bound commands:

```text
npm --prefix projects/basic-react run check
npm --prefix projects/basic-react run build
```

Do not merge or deploy. Publication requires confirmation bound to the exact pull-request preview.
