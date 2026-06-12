## 2025-06-12 - Date of Birth grouped input accessibility
**Learning:** In complex grouped forms (like Date of Birth requiring day, month, year separate inputs), simply placing a visual label is insufficient for screen readers. Using `fieldset`, `legend`, and visually hidden (`sr-only`) individual labels is the correct semantic standard.
**Action:** When evaluating forms for accessibility, specifically look for clustered inputs (dates, time, grouped measurements) that lack `fieldset` wrapping. Always use `sr-only` labels linked to `id`s for inputs that belong to a single visual group.
