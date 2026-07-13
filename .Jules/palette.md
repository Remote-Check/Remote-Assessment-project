
## 2024-05-18 - Consistent Async Action Feedback
**Learning:** Found that some form submission buttons relied only on text changes and disabled states during execution, lacking an explicit ARIA state (`aria-busy`) and a visual indicator for screen readers and sighted users.
**Action:** When adding async action feedback, always include an explicit `aria-busy={true}` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with `animate-spin` tailwind class) during execution to ensure UX consistency and accessibility.
