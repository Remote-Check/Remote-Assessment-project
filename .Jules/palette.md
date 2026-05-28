## 2024-05-28 - Implicit label associations

**Learning:** Forms in `PatientForm.tsx` and `OrderAssessmentModal.tsx` were wrapping input fields sequentially but not directly associating labels to inputs via `htmlFor` and `id` tags. Complex grouped date inputs didn't have specific associations.

**Action:** Whenever generating form controls or reviewing them, verify that each label has an `htmlFor` tag directly targeting an `id` on an `<input>` or `<select>`. For grouped inputs like Dates, wrap them in a `<fieldset>`, convert the main label to a `<legend>`, and supply individual visually hidden (`sr-only`) `<label>` tags linked to the individual split inputs.
