# Project Context: Remote Neuropsychological Assessment

## 1. Vision & Purpose
A remote, web-based platform for cognitive assessment of the 60+ population in Israel.
- **Initial Goal:** Complete digital implementation of the Hebrew MoCA (Montreal Cognitive Assessment).
- **Flexibility:** Modular code allows swapping tests and evolving the battery (Developer-led).
- **Accessibility:** Minimalist, high-contrast, large-typography Hebrew interface (RTL).

## 2. Technical Stack
- **Frontend:** React, TypeScript, Vanilla CSS (RTL support).
- **Drawing:** HTML5 Canvas for Trail Making (1-א-2-ב...) and Clock Drawing.
- **Backend:** Supabase (Auth, PostgreSQL) for cost-effective, secure health data storage.
- **Norms:** Israeli validation (Lifshitz et al., 2012) and scoring algorithms.

## 3. Core Requirements
- **Fallback:** Allow photo uploads for pen-and-paper drawings if digital canvas is unsuitable.
- **Security:** HIPAA-aligned principles (encryption at rest/transit, RLS for clinician access).
- **Reliability:** Per-step auto-save to prevent data loss for older users.

## 4. MVP Roadmap
1. **Engine Setup:** JSON-driven test runner.
2. **Drawing Module:** Canvas for Trail Making and Clock.
3. **Stimuli Module:** Hebrew word lists, animal images, and attention tasks.
4. **Scoring Logic:** Automated point calculation based on Israeli norms.
5. **Backend Integration:** Supabase persistence and clinician dashboard.
