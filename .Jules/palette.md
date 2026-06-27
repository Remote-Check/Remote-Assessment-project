## 2024-06-27 - Loading state added to PatientForm submit button
**Learning:** For UX consistency, async action buttons should include an explicit `aria-busy` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with the `animate-spin` tailwind class) during execution, rather than relying solely on text changes or disabled states.
**Action:** When adding async operations to forms, ensure the submit button handles loading states gracefully with appropriate visual and screen-reader accessible feedback.
