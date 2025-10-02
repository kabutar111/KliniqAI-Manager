# FIA Internal Beta Plan (60 Days)

## Goals & Timeline
- Objective: Stabilize KP‑Medizin‑Trainer for FIA use, validate learning outcomes, collect actionable feedback.
- Duration: 60 days; Start: ASAP; Cadence: ship daily, review weekly.

## Scope (Included vs. Deferred)
- Included: Core study flows (quiz/practice/review), content from medical-content-package, analytics, invite-only access, KPFG authoring updates for content fixes, KPCG in MOCK_MODE.
- Deferred: Payments (Stripe), public signup, live voice features.

## Access Control & Gating
- Claims: `betaInternal=true`, optional `role=fiaTester`.
- Creation: `cd apps/kp-medizin-trainer && pnpm create-test-users && pnpm update-test-users && pnpm check:admin && pnpm migrate:roles-consolidation`.
- UI: Hide paywalls; unlock premium routes when `betaInternal=true`.

## Environments & Config
- Trainer: add `.env` toggle `VITE_INTERNAL_BETA=true` and conditionally hide pricing/subscription UI.
- KPCG: `.env` → `MOCK_MODE=true`, `LOG_LEVEL=INFO`; run `python3 simple_api.py` for local.
- Optional: PocketBase for local prototyping (`quick-start-pocketbase.sh`).

## Build, Test, Deploy
- Trainer: `cd apps/kp-medizin-trainer && pnpm i && pnpm lint && pnpm build && pnpm test && pnpm test:e2e`.
- KPFG: `cd apps/kpfg && npm ci && npm run build`.
- KPCG: `cd apps/kpcg && pytest -v`.
- Staging deploy (trainer): `pnpm build && firebase deploy` (test project).

## Analytics & Feedback Loop
- Capture: session start, quiz start/finish, errors, content quality votes.
- Channel: in‑app “Report Issue” to Firestore; daily export to report.
- Weekly review: content fixes, UX polish, stability.

## Metrics (Weekly Targets)
- Stability: crash rate < 1%; error rate < 2% of sessions.
- Engagement: ≥ 3 active sessions/tester/week; median session ≥ 10 min.
- Learning: +15% accuracy improvement over 2 weeks cohort.
- Content: resolve 90% of reported issues within 7 days.

## QA & Acceptance
- Green builds/tests on Trainer; KPCG health OK in MOCK_MODE.
- All premium features gated; no payment UI visible.
- Onboarding via invites only; claims audit passes.

## Risks & Mitigations
- Auth/claims drift → add `check:admin` pre-deploy; logs audit.
- Content bugs → prioritize KPFG hotfix flow, same-day publish.
- Flaky e2e → stabilize critical paths; retry with CI tags.

## Communication
- Daily: short changelog; blockers + next 3 actions.
- Weekly: metrics dashboard + top 5 issues closed; next sprint focus.
