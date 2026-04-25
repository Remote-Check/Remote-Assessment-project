# Remote Assessment Project

Remote Hebrew MoCA pilot MVP.

The active product direction is simple: a clinician creates a session link, a patient completes the assessment, raw task/drawing/audio evidence is persisted, deterministic rule scoring is applied only where supported by the active test manual, and the clinician reviews/finalizes anything requiring judgment.

## Source Of Truth

This README, [AGENTS.md](AGENTS.md), and [JOURNEY.md](JOURNEY.md) are the product guardrails for future agents. `JOURNEY.md` is the bird's-eye patient/clinician journey authority and must be updated when journey behavior changes.

Use [CONTEXT.md](CONTEXT.md) for project history/context and [docs/LOCAL_E2E_VERIFICATION.md](docs/LOCAL_E2E_VERIFICATION.md) for local verification. Dated files under `docs/plans/` are background plans only; if they conflict with README/AGENTS/JOURNEY, README/AGENTS/JOURNEY win.

## Version Control

Development must use GitHub feature branches and pull requests.

- `main` is the integration branch.
- Agents and engineers create a feature branch before editing, for example `feature/mvp-e2e-hardening`.
- Commit focused changes after tests pass.
- Push the branch to GitHub and open a PR into `main`.
- Merge only after explicit user approval.
- See [AGENTS.md](AGENTS.md) for the required agent protocol.

## MVP Scope

- Clinician login, session creation, dashboard list/detail, drawing/manual review, finalization.
- Patient session start by one-time code/link, Hebrew MoCA flow, autosave, completion.
- Supabase persists sessions, task results, drawings, audio evidence, scoring reports, and audit events.
- Server-side scoring is authoritative.
- Drawings and ambiguous/manual items go to clinician review.
- Clinician gets an email when a test is completed.
- Patient SMS uses Twilio first, behind a provider abstraction.

## Non-Goals

- No live clinician/caregiver monitoring.
- No app-facing caregiver flow, observer link, screen mirror, watched badge, or remote encouragement.
- No Friday/weekly digest.
- No AI/ML drawing scoring.
- No speech-to-text scoring. External STT may produce transcript evidence only.
- No licensed MoCA stimuli committed to the repository.

## Scoring Guardrails

- Rule-based scoring is allowed only when the active test manual defines deterministic scoring from structured payloads.
- Missing, malformed, ambiguous, or unsupported payloads must preserve raw data and require clinician review.
- Drawing tasks always require clinician scoring. The app may show raw strokes/images/replay/metrics as evidence, but must not infer a drawing score.
- Norm lookup remains local and deterministic.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind/Radix UI.
- Backend: Supabase Postgres/Auth/Storage/Edge Functions on Deno.
- Local verification: Supabase CLI plus `scripts/local-e2e.mjs`.

## Repo Map

- `client/` — active frontend.
- `supabase/` — active migrations and Edge Functions.
- `scripts/` — local automation and E2E verification.
- `JOURNEY.md` — patient/clinician browser + backend journey playbook.
- `docs/LOCAL_E2E_VERIFICATION.md` — local end-to-end test instructions.
- `docs/plans/` — background implementation plans, not product authority.
- `CONTEXT.md` and `MEMORY.md` — project context/history.

## Removed Clutter

Exported prototype/handoff directories were intentionally removed to prevent future-agent confusion:

- `Skeleton Front End-2/`
- `handoff/`
- `components/`
- `client/src/imports/`
- `client/backup_src/`
- `docs/superpowers/`

Do not recreate those directories as product sources of truth.

## Development

Machine prerequisites:

- Node/npm for the frontend.
- Deno for Supabase Edge Function checks.
- Supabase CLI plus Docker Desktop or Colima for the local backend.
- Google Chrome at `/Applications/Google Chrome.app` for browser-agent UI testing.
- Licensed Hebrew MoCA PDFs stored locally outside the repository for E2E verification.

Frontend:

```bash
cd client
npm install
npm run dev
npm test
npm run e2e:browser
npm run build
npm run lint
```

Backend/local E2E:

```bash
supabase start
supabase functions serve create-session start-session submit-results submit-task save-drawing save-audio complete-session get-session update-drawing-review update-scoring-review --env-file /dev/null
node scripts/local-e2e.mjs --all-versions
```
