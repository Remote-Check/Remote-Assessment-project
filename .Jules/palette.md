## 2024-05-27 - Date of Birth Fieldset Accessibility
**Learning:** Found a specific app pattern where related grouped inputs (like day/month/year for Date of Birth) were using a visual `div` and a single generic `<label>`, causing screen readers to lose context on the individual inputs.
**Action:** Always wrap grouped inputs in a semantic `<fieldset>` with a `<legend>`, and give each individual input a visually hidden `<label>` that explicitly links to it via `htmlFor`/`id`.
