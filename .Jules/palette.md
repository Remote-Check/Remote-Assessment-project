## 2024-06-15 - Complex form inputs accessibility
**Learning:** For complex grouped form inputs (e.g., Date of Birth requiring day, month, year), wrapping them in a `<fieldset>` with a `<legend>` and using visually hidden (`sr-only`) `<label>` elements for each individual input ensures proper screen reader accessibility and logical grouping.
**Action:** Always use `<fieldset>`/`<legend>` combinations for grouped inputs representing a single data point and provide hidden individual labels for each sub-input in future form implementations.
