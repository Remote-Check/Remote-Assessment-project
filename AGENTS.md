# Agent Instructions

Read [README.md](README.md) before making product, backend, scoring, or UX changes.

## Source of Truth

Canonical files:

1. [README.md](README.md)
2. [AGENTS.md](AGENTS.md)
3. [JOURNEY.md](JOURNEY.md)
4. [CONTEXT.md](CONTEXT.md)
5. [docs/LOCAL_E2E_VERIFICATION.md](docs/LOCAL_E2E_VERIFICATION.md)

`JOURNEY.md` is the bird's-eye patient/clinician journey authority. Update it when browser, backend, status, scoring, notification, or review behavior changes.

Dated files in `docs/plans/` are background plans. If they conflict with README/AGENTS/JOURNEY, README/AGENTS/JOURNEY win.

## Required GitHub Workflow

Every agent must use branch-based version control.

- Start every code/doc change by checking `git status`, `git branch --show-current`, and `git remote -v`.
- Do not work directly on `main`. If the current branch is `main`, create or switch to a feature branch before editing. Use `feature/<short-scope>` when `codex/<short-scope>` is unavailable.
- Keep unrelated dirty work intact. Do not reset, checkout, delete, or rewrite user changes unless the user explicitly requests it.
- Make focused commits with clear messages after verification passes.
- Push the feature branch to GitHub and open a pull request into `main` for review.
- Do not merge to `main` unless the user explicitly asks for the merge.
- Before a PR, run the relevant verification commands listed below and mention any skipped checks in the PR or handoff.
- Generated local artifacts stay out of Git: `.env.local`, `.playwright-mcp/`, `client/test-results/`, `client/playwright-report/`, `node_modules/`, and `dist/`.

## Guardrails

- No live clinician/caregiver monitoring.
- No app-facing caregiver flow.
- No Friday/weekly digest.
- No AI/ML drawing scoring.
- Speech-to-text is transcript evidence only.
- Rule scoring is allowed only when deterministic from the active test manual.
- Clinician completion notification is email-first.
- Twilio is the MVP SMS default behind a provider abstraction.
- Preserve raw data whenever a task cannot be scored deterministically.
- Server-side scoring is authoritative.

## Removed Directories

The following exported/legacy directories were removed intentionally and should not be restored as sources of truth:

- `Skeleton Front End-2/`
- `handoff/`
- `components/`
- `client/src/imports/`
- `client/backup_src/`
- `docs/superpowers/`

## Verification

Machine prerequisites for full verification:

- Node/npm, Deno, Supabase CLI, and Docker/Colima are available.
- Google Chrome is installed at `/Applications/Google Chrome.app` for Playwright/browser-agent checks.
- `client/.env.local` points at local Supabase when running local E2E.
- The licensed Hebrew MoCA PDFs used by `scripts/local-e2e.mjs` exist locally and stay outside the repo.

Before handing off backend/scoring changes, run:

```bash
cd client && npm test && npm run e2e:browser && npm run build && npm run lint
deno check --frozen supabase/functions/complete-session/index.ts supabase/functions/create-session/index.ts supabase/functions/start-session/index.ts supabase/functions/submit-results/index.ts supabase/functions/submit-task/index.ts supabase/functions/save-drawing/index.ts supabase/functions/save-audio/index.ts supabase/functions/get-session/index.ts supabase/functions/update-drawing-review/index.ts supabase/functions/update-scoring-review/index.ts
node scripts/local-e2e.mjs --all-versions
```

For browser or UX changes, also verify the affected flow in Chrome. Prefer browser automation when available.
