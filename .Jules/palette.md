## 2024-05-24 - Grouped Inputs in React Forms
**Learning:** Complex grouped inputs (like day/month/year for Date of Birth) that don't have individual visible labels need explicit association using `<fieldset>` + `<legend>` combined with `sr-only` labels to ensure screen readers provide necessary context, rather than just relying on generic parent labels that may not be read out contextually.
**Action:** When implementing grouped inputs in forms, especially custom React ones, wrap them in a `<fieldset>` with a `<legend>` and use `sr-only` `<label htmlFor>` tags for each nested input.
