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
    - Implemented full Scoring Engine (Step 4 of MVP roadmap). 95/95 tests passing.
    - New files: types/scoring.ts, data/scoring-config.json, data/lifshitz-norms.json
    - New lib: lib/scoring/{index,scorers,norms,utils}.ts — pure functions, fully TDD'd
    - New hook: hooks/useScoring.ts — bridges battery state to scoreSession
    - New edge function: supabase/functions/save-drawing/ — canvas PNG → Supabase Storage only, no AI
    - Design doc: docs/plans/2026-04-21-scoring-engine-design.md
    - KEY DECISIONS: drawings stay manual clinician rubric (SPEC 3.6.2), no external AI/models, 
      scoring failures fall back to needsReview (never silently zero), norm lookup is local Lifshitz 2012 JSON.
    - Supabase schema designed: sessions, task_results, scoring_reports, drawing_reviews tables.
    - KEY PRIVACY DECISIONS: zero PII (case IDs only), age band not exact age, Israeli region (il-central-1),
      RLS on all tables, patient writes via Edge Functions only (no direct DB access), no E2EE (pseudonymization sufficient).
    - 4 Edge Functions designed: start-session, submit-results, complete-session, save-drawing.
    - Session links: one-time use (link_token UUID, single-use flag).
    - Design doc: docs/plans/2026-04-21-supabase-schema-design.md
    - Status: Schema designed. Pending: implement migrations + Edge Functions + Clinician Dashboard (Step 5).
