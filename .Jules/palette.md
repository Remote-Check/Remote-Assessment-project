
## 2024-05-30 - Patient Form Accessibility Pattern
**Learning:** Found a recurring pattern in the app's forms where compound inputs (like "Date of Birth" split into Day/Month/Year fields) are grouped under a simple `<label>` without associating the individual inputs, causing screen readers to misinterpret them.
**Action:** Always wrap compound inputs in a `<fieldset>` with a `<legend>` acting as the group label, and provide visually hidden (`sr-only`) `<label>` elements explicitly linked via `htmlFor` to each constituent input field.
