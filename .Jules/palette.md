## 2026-05-03 - [Label Associations in Forms]
**Learning:** Found multiple form inputs (`input`, `select`) across `PatientForm` that had adjacent `<label>` elements but lacked explicit programmatic association via `htmlFor` and `id` attributes. This breaks the experience for screen reader users and reduces the clickable area for all users.
**Action:** When creating or modifying forms, always ensure every `<label>` has an `htmlFor` attribute that strictly matches the `id` of its corresponding input or select element.
