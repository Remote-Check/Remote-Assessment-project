## 2024-05-14 - Accessible Multi-part Inputs
**Learning:** Complex grouped form inputs (e.g., Date of Birth requiring day, month, year) fail accessibility checks if inputs are unlabelled or implicitly grouped.
**Action:** Wrap grouped inputs in a `<fieldset>` with a `<legend>` for the main label, and use visually hidden (`sr-only`) `<label>` elements explicitly linked (`htmlFor`) to each individual input (`id`) to ensure proper screen reader context.
