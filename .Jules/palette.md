## 2024-07-07 - Async Action Loading States
**Learning:** Async action buttons should include an explicit `aria-busy` state and a visual loading indicator (e.g., `Loader2`) during execution, rather than relying solely on text changes or disabled states.
**Action:** Added `aria-busy` and `Loader2` to async submit buttons in `PatientForm`, `OrderAssessmentModal`, and `ClinicianAuthPage`.
