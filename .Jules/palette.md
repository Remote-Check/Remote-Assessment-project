## 2026-05-29 - Accessible Grouped Inputs
**Learning:** Complex form field groups (like a Date of Birth split into day, month, and year inputs) require specific HTML structuring for screen reader compatibility. A generic `<div>` and `<label>` wrapper is insufficient.
**Action:** When creating grouped inputs, always wrap the group in a `<fieldset>` with a descriptive `<legend>`. Additionally, ensure each individual input within the group has its own explicitly linked `<label>` (which can be visually hidden using `sr-only` if the `<legend>` provides enough visual context).
