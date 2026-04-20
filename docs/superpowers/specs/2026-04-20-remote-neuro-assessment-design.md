# Design Spec: Digital Hebrew MoCA MVP

**Date:** 2026-04-20
**Status:** Updated for Hebrew MoCA implementation

## 1. Vision & Purpose
Digitize the Hebrew version of the Montreal Cognitive Assessment (MoCA) for remote assessment of cognitive impairment in the 60+ Israeli population.

## 2. Technical Stack
- **Frontend:** React + TypeScript with `dir="rtl"` support.
- **Canvas Engine:** HTML5 Canvas (for Trail Making & Clock Drawing) with pressure/path tracking.
- **Backend:** Supabase (PostgreSQL) for secure scoring and Israeli norm comparison.

## 3. Hebrew & Local Implementation
- **Linguistic:** Full RTL (Right-to-Left) UI. All instructions and stimuli in Hebrew.
- **Stimuli:** 
  - Trail Making: Numbers (1-5) and Hebrew Letters (א-ה).
  - Naming: Lion, Rhinoceros, Camel (Hebrew adapted).
  - Memory: פנים, קטיפה, כנסייה, ציפורן, אדום.
- **Scoring Norms:**
  1. Primary: Israeli Validation (Lifshitz et al., 2012).
  2. Secondary: Education-adjusted (+1 point for ≤12 years education).
  3. Fallback: Standard International MoCA norms.

## 4. Assessment Modules (Complete MoCA)
1. **Visuospatial/Executive:** Digital Drawing Canvas (Trail Making, Cube, Clock).
2. **Naming:** Image selection/Identification.
3. **Memory/Attention:** Interactive word learning and digit span.
4. **Language:** Sentence repetition and Verbal Fluency (Hebrew letter 'ב').
5. **Abstraction:** Similarity pairs.
6. **Delayed Recall:** Recall of the 5-word list.
7. **Orientation:** Date/Place selection.

## 5. Interaction Safety
- **Drawing Fallback:** If canvas fails or patient prefers, a "Photo Upload" slot is available for pen-and-paper drawings.
- **Auto-Save:** Progress synced to Supabase after each module to prevent data loss.
- **Accessibility:** Large buttons, high contrast, and Hebrew audio prompts.
