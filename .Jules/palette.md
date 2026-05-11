## 2024-11-20 - Grouped Form Inputs Accessibility
**Learning:** For grouped inputs like date of birth (day, month, year) in the clinician forms, screen readers have trouble when a single label covers multiple inputs.
**Action:** Always wrap grouped inputs in a `<fieldset>` with a `<legend>` acting as the group label, and provide individual `sr-only` labels mapped via `id` to each input.
