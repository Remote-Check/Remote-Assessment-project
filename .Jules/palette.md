## 2024-05-18 - Grouped form inputs accessibility
**Learning:** For complex grouped form inputs (e.g., Date of Birth requiring day, month, year), using a plain label and wrapping div fails to provide adequate context for screen reader users.
**Action:** Always wrap grouped inputs in a `<fieldset>` with a `<legend>` acting as the group label. Each individual input inside the group must have its own visually hidden (`sr-only`) `<label>` tied via `htmlFor` to the input's `id` to ensure proper screen reader accessibility and correct semantics.
