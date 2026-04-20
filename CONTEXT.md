# Project Context: Remote Neuropsychological Assessment (Hebrew MoCA)

## 1. Vision & Purpose
A remote, web-based platform for cognitive assessment of the 60+ population in Israel.
- **Initial Goal:** Complete digital implementation of the Hebrew MoCA (Montreal Cognitive Assessment).
- **Flexibility:** Modular "Playlist Engine" (JSON-driven) with i18n support (react-i18next) for future Arabic/Russian/English versions.
- **Accessibility:** Minimalist, high-contrast Hebrew interface (RTL) with a computer orientation module.

## 2. Technical Stack
- **Frontend:** React, TypeScript, Vanilla CSS (RTL), `react-i18next`.
- **Drawing:** HTML5 Canvas for Trail Making and Clock Drawing.
- **Backend:** Supabase (Auth, PostgreSQL) - targeting AWS/Google Israel Region.
- **Data Architecture:** 
    - **Raw Scores Table:** Structured for research export (Excel) and clinical reporting (PDF).
    - **UX Metadata Table:** Tracks engagement metrics (time per task, undo counts, retries) for usability analysis.

## 3. Core Requirements
- **Scoring:** Hybrid Engine. Automated math/trails, manual review for drawings. Decoupled JSON-based Scoring Engine with Israeli norms.
- **Access:** Clinician-generated "Open Links" (no patient verification step for MVP simplicity).
- **Fallback:** Manual link sharing (Option B) to keep operational costs at zero.
- **Reliability:** Per-section auto-save and patient retries for connection loss.
- **Privacy:** Pseudonymization (Case IDs in DB).

## 4. MVP Roadmap
1. **Engine Setup:** i18n-ready JSON runner with RTL Layout.
2. **Orientation Module:** Basic digital literacy training for older users.
3. **MoCA Implementation:** Drawing Canvas + Stimuli (Hebrew word lists/animals).
4. **Scoring Engine:** Logic for Israeli norms (Lifshitz et al., 2012).
5. **Clinician Dashboard:** Patient management, export tools (Excel/PDF), and manual review interface.
