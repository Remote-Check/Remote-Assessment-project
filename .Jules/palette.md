## 2024-06-21 - Visual Feedback for Async Buttons
**Learning:** Clinician action buttons were relying solely on text changes (e.g., "פתח תיק" -> "שומר...") and `disabled` states during async operations. Screen readers do not always announce text changes inside buttons dynamically, and sighted users benefit from clearer visual indicators to confirm progress.
**Action:** Always include an explicit `aria-busy={true}` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with the `animate-spin` tailwind class) during execution rather than relying on text changes alone.
