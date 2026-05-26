## 2025-05-26 - Form Group Accessibility Pattern
**Learning:** For grouped form inputs like date of birth (Day, Month, Year), screen readers need structural context to understand how the parts relate to the whole. Simple labels are not enough. The `PatientForm` component lacked this context.
**Action:** Always wrap grouped, related inputs in a `<fieldset>` with a descriptive `<legend>`. Ensure each individual input within the group still has its own visually hidden (`sr-only`) `<label>` tied via `htmlFor`/`id` to maintain strict WCAG compliance and clear screen reader announcements.
