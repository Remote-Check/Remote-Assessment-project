## 2024-05-18 - Async Action Feedback
**Learning:** Users lack confidence when async actions (like submitting forms) only change button text or disable the button, leading to potential duplicate clicks or confusion.
**Action:** Always include an explicit `aria-busy` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with the `animate-spin` tailwind class) during execution for UX consistency.
