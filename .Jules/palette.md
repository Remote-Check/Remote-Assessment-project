## 2024-06-29 - Explicit Visual Loading States for Async Actions
**Learning:** Depending solely on disabled states or text changes (e.g., "שומר...") during form submissions isn't enough for accessibility and clear UX feedback. Users need an explicit, visually distinct loading indicator (like a spinner) and screen readers need `aria-busy="true"` to understand the ongoing process.
**Action:** Always include a visual loading indicator (e.g., `Loader2` with `animate-spin`) alongside the loading text and add the `aria-busy` attribute to buttons triggering async operations.
