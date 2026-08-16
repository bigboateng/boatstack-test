# Implementation plan

1. Update `projects/basic-react/src/App.tsx`.
   - Add typed draft state and dialog-open state.
   - Replace immediate add handlers with a shared dialog opener that records the triggering control.
   - Render a dependency-free accessible dialog form for title, notes, and due date.
   - Require a non-empty title and create/select the task only on valid submit.
   - Reset drafts and restore focus on create, cancel, and Escape.

2. Update `projects/basic-react/src/App.css`.
   - Add backdrop, dialog surface, form layout, action-row, and secondary-button styles.
   - Reuse the existing colors, radii, spacing, focus treatment, and responsive breakpoint.

3. Update `projects/basic-react/src/App.test.tsx`.
   - Adapt the complete workflow to create through the dialog.
   - Add focused coverage for open-without-mutation, valid submission, cancellation, required-title handling, Escape, focus restoration, and clean reopening.

4. Verify.
   - Run `npm --prefix projects/basic-react run check`.
   - Run `npm --prefix projects/basic-react run build`.
   - Fix only failures introduced by this scope.

