## 2024-05-12 - Accessible Multi-part Date Inputs
**Learning:** Found a reusable pattern for accessible multi-part date inputs (Day, Month, Year). Wrapping them in a `<fieldset>` with a `<legend>` for the overarching label, and using visually hidden (`sr-only`) labels for the individual inputs provides a great screen-reader experience without cluttering the visual UI.
**Action:** Apply this `<fieldset>`/`<legend>` + `sr-only` pattern whenever creating grouped inputs that share a single logical meaning (like dates, or phone number parts).
