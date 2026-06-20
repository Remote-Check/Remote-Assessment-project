## 2025-01-20 - Grouped Form Inputs Accessibility
**Learning:** For complex grouped form inputs (e.g., Date of Birth requiring day, month, year), wrapping them in a standard `<fieldset>` with a `<legend>` and using visually hidden (`sr-only`) `<label>` elements for each individual input ensures proper screen reader accessibility and logical grouping.
**Action:** When creating or modifying grouped inputs, use `<fieldset>` and `<legend>` for the main label, and wrap each input in its own container with a visually hidden `<label>` bound via `htmlFor` and `id`.
