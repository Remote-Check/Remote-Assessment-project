## 2026-05-25 - Accessible Grouped Inputs
**Learning:** Complex grouped form inputs (e.g., Date of Birth with day, month, year) require specific HTML structuring to be accessible to screen readers. Simply providing placeholder text or a visual group label is insufficient for users navigating field by field.
**Action:** Always wrap grouped inputs in a `<fieldset>` with a descriptive `<legend>`. Then, provide visually hidden (`sr-only`) `<label>` elements with `htmlFor` attributes linked to each individual input's `id` (e.g., day, month, year).
