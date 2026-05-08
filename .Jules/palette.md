## 2024-05-18 - Form Accessibility
**Learning:** Found a pattern of missing `id` and `htmlFor` attributes on form inputs and their labels in `PatientForm.tsx`. While placeholders were present, explicit label association is critical for screen reader compatibility and click-to-focus behavior.
**Action:** Always ensure custom forms have explicit `htmlFor` on labels corresponding to input `id`s for better accessibility and user experience.
