## 2026-07-06 - Accessible Grouped Inputs
**Learning:** Complex grouped form inputs (like Date of Birth requiring day, month, and year) must be wrapped in a `<fieldset>` with a `<legend>` to provide semantic grouping for screen readers, and each individual input needs its own visually hidden (`sr-only`) `<label>` explicitly linked via `htmlFor`.
**Action:** Always structure multi-part data entry fields (dates, split phone numbers, etc.) using `fieldset/legend` and explicit `sr-only` labels to ensure screen reader accessibility and correct click-to-focus behavior.
