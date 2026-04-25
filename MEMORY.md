# Project Memory

## Context
- Remote Assessment Project.
- GitHub set up: `https://github.com/Reakwind/Remote-Assessment-project.git`.
- Using `grill-me` skill for discovery.

## Session History
- 2026-04-20: 
    - Scaffolded project and implemented RTL/i18n engine.
    - Implemented and integrated all core MoCA tasks (Orientation, Trails, Cube, Clock, Naming, Memory Learning, Digit Span, Vigilance, Serial 7s, Language, Abstraction, Delayed Recall, MoCA Orientation).
    - Resolved build and test failures (syntax, mocking, and unused variables).
    - Project builds and tests (28/28) passing. Core MoCA battery is functional.
- 2026-04-21:
    - Integrated high-fidelity "Skeleton Front End 2" into the main project; exported handoff/prototype directories were later removed to keep the repo lean.
    - Architecture: React Router v7, Tailwind 4, Radix UI.
    - Real-time/live monitoring was later removed from MVP scope; task data and strokes persist for post-completion clinician review.
    - Drawing Tasks: Added base64 image capture and automatic upload to 'stimuli' bucket before result submission.
    - Token Validation: Rewrote SessionValidation to use useSession hook with URL route parameters.
    - Stabilization: Resolved 100+ TypeScript/CSS build errors from the merge.
    - Status: Frontend Blueprint complete and connected. Ready for Deep Backend & Security hardening.
- 2026-04-25:
    - Product scope narrowed for MVP: no clinician/caregiver live monitoring, no app-facing caregiver flow, no Friday digest.
    - Scoring policy clarified: no AI/ML drawing scoring; drawing/audio/raw task evidence is recorded for clinician review.
    - Rule-based scoring is allowed only where the active test manual defines deterministic scoring; unavailable rule scoring falls back to clinician review with raw data preserved.
    - Speech-to-text is an external transcript/evidence service only, not a scoring authority.
    - Clinician notification is email-first when a test is completed; SMS is Twilio-first for patient communication behind a swappable provider interface.
