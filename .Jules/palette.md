## 2024-05-15 - Add Async Loading States to Submit Buttons
**Learning:** For UX consistency, async action buttons should include an explicit `aria-busy` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with the `animate-spin` tailwind class) during execution, rather than relying solely on text changes or disabled states.
**Action:** Always add visual loading spinners and `aria-busy` states to async form submissions.
