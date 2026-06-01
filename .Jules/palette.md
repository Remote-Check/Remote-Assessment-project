## 2024-05-20 - Fix accessibility in PatientForm.tsx
**Learning:** Found complex grouped form inputs (Date of Birth) that missed a fieldset, legend, and sr-only labels for each individual input. Also, regular inputs lacked htmlFor associations to explicit IDs. This violates WCAG and the UX coding standards for this app.
**Action:** Always wrap grouped inputs like Day/Month/Year in a fieldset/legend and use sr-only labels. Use explicit id and htmlFor on all inputs and labels.
