# AGENTS.md

## Purpose

Operational guide for coding agents working in this repository. Keep changes focused, follow repo-specific commands, and prefer the smallest verification that proves the requested work is correct.

## Repository map

- `client/`: main React + TypeScript app and primary CI target
- `Skeleton Front End-2/`: secondary/reference frontend
- `supabase/`: database migrations and Edge Functions
- `docs/`: setup, plans, and design docs

Default to `client/` unless the task clearly belongs in another area.

## Cursor Cloud specific instructions

### Environment setup

Run from `/workspace`:

- `npm install --prefix "client" --legacy-peer-deps`
- `npm install --prefix "Skeleton Front End-2"`

### Preferred development commands

Start apps on fixed ports so parallel agent sessions remain predictable:

- `client` on port `4173`:
  - `npm run dev --prefix "client" -- --host 0.0.0.0 --port 4173`
- `Skeleton Front End-2` on port `4174`:
  - `npm run dev --prefix "Skeleton Front End-2" -- --host 0.0.0.0 --port 4174`

### Verification matrix by change type

Use the smallest high-signal checks for the files you changed:

- `client/` code changes:
  - `npm run lint --prefix "client"`
  - `npm run test --prefix "client"`
  - `npm run build --prefix "client"` when build output or runtime behavior changed
- `Skeleton Front End-2/` changes:
  - `npm run build --prefix "Skeleton Front End-2"`
- docs-only changes:
  - no frontend test run required

### Coding and editing guardrails

- Quote paths that contain spaces, such as `"Skeleton Front End-2"`.
- Prefer focused, minimal diffs; avoid unrelated refactors.
- Follow existing file structure, naming, and code patterns before introducing new ones.
- Do not modify generated lockfiles unless dependency changes require it.
- Do not modify unrelated generated files just because tooling touched them.

### Git workflow for cloud agents

- Create a new branch when needed with the `cursor/` prefix.
- Keep commits scoped to one logical change and use descriptive commit messages.
- Check `git status` before editing and before committing so unrelated work does not get mixed in.
- Do not switch branches casually, rewrite history, or force-push unless the user explicitly asks for it.

### PR workflow and description expectations

- Summarize user-visible changes, verification performed, and any notable risks or follow-up work.
- Include screenshots or recordings when UI behavior changes.
- Keep PR descriptions factual and specific to the diff.

### Manual testing and walkthrough artifacts

- Verify UI changes in the browser when practical, not just with static review.
- Capture artifacts that show final working behavior rather than setup steps or failed attempts.
- For non-UI changes, terminal output and focused test results are usually enough.

### External service write guardrail (required)

Before running any command that writes to external services, agents must:

1. Show the exact command(s) they plan to run.
2. Explain the expected side effect in one sentence.
3. Wait for explicit user approval before executing.

This guardrail applies to actions that can change remote state, including:

- Supabase (secrets, migrations, function deploys, branch operations, data writes)
- Twilio / Resend API calls
- GitHub/GitLab write operations (pushes, PR edits, labels, releases, comments, etc.)
- Any other third-party API or cloud resource mutation

### Quick checklist

Before finishing work:

- confirm the target area of the repo
- keep the diff minimal
- run the right verification for the changed files
- capture artifacts if UI behavior changed
- avoid remote writes without explicit approval
