## 2024-06-19 - Explicit Loading States for Async Buttons
**Learning:** Depending solely on text changes (e.g. "Saving...") for async actions isn't sufficient for accessibility or clear UX feedback; screen readers benefit from `aria-busy` and sighted users benefit from visual indicators like spinners.
**Action:** Always include an explicit `aria-busy` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with `animate-spin`) alongside text changes during async execution for buttons.
