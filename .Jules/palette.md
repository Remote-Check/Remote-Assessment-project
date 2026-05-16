## 2024-05-16 - Patient Form Accessibility Grouping
**Learning:** Found a pattern where grouped inputs (like day/month/year for Date of Birth) are visually grouped but lack proper semantic linking to their parent label for screen readers. Using `<label>` for a group is invalid HTML and not accessible.
**Action:** Always wrap grouped related inputs in a `<fieldset>` with a `<legend>` for the main label, and provide visually hidden (`sr-only`) `<label>` tags linked via `htmlFor` to each individual child `<input>` with unique `id`s.
