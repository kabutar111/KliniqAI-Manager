# PR Title

Type(Scope): Imperative subject

## Summary
- What changed and why (1–3 lines). Link issues.

## Decisions (Claire)
- Decisions made and rationale (brief).
- Success metrics/acceptance criteria.

## Scope
- Affected areas/paths: `...`
- Out of scope: `...`

## Testing & Verification
- Commands run (include exact paths):
  - `cd apps/kpcg && pytest -v` (if applicable)
  - `cd apps/kp-medizin-trainer && pnpm test && pnpm test:e2e`
  - `cd apps/kpfg && npm run lint && npm run build`
- Results: `...`

## Screenshots / Artifacts
- Before / After or relevant artifacts.

## Security & Config
- Secrets handled? none / updated `.env.example`
- Migrations? none / `...`

## Docs & Memory Updates
- Updated: `docs/...` `planning/...`
- Memory: add entries to `docs/memory-events/` and update index.

## Checklist
- [ ] Follows code separation policy (no code changes under `apps/*` here)
- [ ] Lints/tests pass (or justified)
- [ ] Docs/memory updated
- [ ] Screenshots added (UI changes)

