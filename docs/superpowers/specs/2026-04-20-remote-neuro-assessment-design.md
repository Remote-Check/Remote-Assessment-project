# Design Spec: Remote Neuropsychological Assessment Platform

**Date:** 2026-04-20
**Status:** Draft for Review

## 1. Vision & Purpose
This platform solves the critical problem of assessing cognitive impairment in older adults (60+) who cannot visit a clinic for traditional pen-and-paper assessments. It provides a remote, web-based assessment battery that is:
- **Accessible:** Optimized for older eyes and less tech-savvy users.
- **Flexible:** Modular "Battery Engine" allowing developers to swap or add new tests easily.
- **Cost-Effective:** Leverages free-tier services (Supabase) for secure data storage and authentication.

## 2. Technical Stack
- **Frontend:** React (TypeScript) for a robust, type-safe interactive experience.
- **Styling:** Vanilla CSS focusing on high contrast, large typography, and minimalist layouts.
- **Backend/Database:** Supabase (PostgreSQL) for secure patient results, clinician auth, and data encryption.
- **Deployment:** Vercel or Netlify (Free tiers) for high-performance global delivery via simple links.

## 3. Architecture & Modularity
### The "Playlist" Engine
The assessment flow is driven by a JSON configuration file.
- **Tests** are independent components following a strict "Test Contract" (Input instructions -> Interaction -> Standardized Output).
- **Engine** manages transitions, progress saving, and shared accessibility features (audio-read-aloud, large navigation buttons).

## 4. User Experience (60+ Population)
- **Visuals:** High contrast (Black on White), large font sizes (min 18px-24px), and oversized touch targets.
- **Cognitive Load:** One task per screen, explicit "Next" steps, and clear, non-technical instructions.
- **Reliability:** Automatic state saving to Supabase after every test step. If the browser closes, the patient resumes exactly where they left off.

## 5. Security & Privacy
- **Supabase Auth:** Clinicians use secure login to view patient results.
- **Row Level Security (RLS):** Ensures data isolation so clinicians only see results for their specific patients.
- **Encryption:** All results encrypted at rest and in transit.

## 6. Future Extensibility
- **Avatar/Voice Layer:** Architecture includes "slots" for interactive avatars or more complex animations.
- **Custom Batteries:** Support for multiple JSON configs to offer different assessment lengths or focuses.

---
**Reviewer Note:** This design prioritizes immediate clinical utility and low operational cost while maintaining professional-grade security.
