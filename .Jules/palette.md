## 2024-07-09 - Async Button Loading States
**Learning:** Async action buttons should include an explicit `aria-busy` state and a visual loading indicator (e.g., using `Loader2` from `lucide-react` with the `animate-spin` tailwind class) during execution, rather than relying solely on text changes or disabled states.
**Action:** When implementing submit buttons in forms, ensure `aria-busy` is added along with an animated spinner icon.
