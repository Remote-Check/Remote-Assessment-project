## 2024-07-03 - Improve accessibility of async submit buttons
**Learning:** Clinician app async action buttons were relying solely on disabled states and text changes to indicate loading, which is insufficient for screen readers and visually ambiguous.
**Action:** For UX consistency across the application, always add an explicit `aria-busy={loading}` state to submit buttons, and visually reinforce the loading state by replacing static icons with `Loader2` from `lucide-react` using the `animate-spin` class.
