## 2024-07-02 - Accessible Date of Birth Input Group
**Learning:** In complex grouped form inputs specific to this app (like the Date of Birth requiring day, month, year), using a generic wrapper `<div>` and a single overarching `<label>` fails screen reader continuity.
**Action:** Always wrap grouped inputs in a `<fieldset>` with a `<legend>` for the main label, and use visually hidden (`sr-only`) `<label>` elements linked via `htmlFor` to each individual `<input id="...">` to ensure proper screen reader accessibility and context.
