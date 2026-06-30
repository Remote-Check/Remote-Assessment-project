## 2024-05-18 - Grouped Date Inputs Accessibility
**Learning:** Grouped form inputs (like date of birth with day, month, year) require specific HTML structure (`<fieldset>`, `<legend>`, and hidden `<label>`s linked via `htmlFor`) to remain fully accessible to screen readers, instead of relying on a single visual label.
**Action:** Use the `<fieldset>` pattern for any multi-part input fields across the application.
