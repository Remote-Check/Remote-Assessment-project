## 2024-05-17 - Improve Date of Birth Form Accessibility
**Learning:** Grouped inputs (like day/month/year for dates) without explicit association are challenging for screen reader users. The application lacked proper semantic grouping for the Date of Birth field.
**Action:** When encountering complex or multi-part inputs, always use `<fieldset>` and `<legend>` for the overarching group label, and provide visually hidden (`sr-only`) individual `<label>` elements linked via `htmlFor` and `id` for each input component.
