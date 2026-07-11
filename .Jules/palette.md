## 2024-05-18 - Added loading state to ClinicianAuthPage submit button
**Learning:** For UX consistency, async action buttons should include an explicit aria-busy state and a visual loading indicator (e.g., using Loader2 from lucide-react with the animate-spin tailwind class) during execution, rather than relying solely on text changes or disabled states.
**Action:** When implementing async forms, I should ensure all async submit buttons have an aria-busy state and visual feedback like a spinner.
