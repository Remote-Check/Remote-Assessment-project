## 2026-06-09 - Async Button Loading States
**Learning:** Async action buttons should include an explicit `aria-busy` state and visual loading indicator (`Loader2` with `animate-spin`), rather than relying solely on text changes or disabled states, to ensure UX consistency and accessibility.
**Action:** Always verify that form submission buttons explicitly use `aria-busy` and a spinner component during async operations.
