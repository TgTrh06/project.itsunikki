# Contributor and Agent Instructions

These rules apply to humans and AI agents working in this repository.

## Read first

1. Read [ARCHITECTURE_ESSENTIALS.md](docs/ARCHITECTURE_ESSENTIALS.md) before planning or changing code.
2. Consult [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design, security, data, deployment, and operational details.
3. Read [GOVERNANCE.md](docs/GOVERNANCE.md) before any material, sensitive, release, or operational change.
4. Read [UI_UX.md](docs/UI_UX.md) before creating or changing any user-facing interface, interaction, content, or user-visible error.
5. Use [PRD.md](docs/PRD.md) to understand product intent and acceptance criteria. Treat **TBD** entries as unresolved; do not invent product policy.
6. Read applicable approved ADRs in `docs/adr/` before changes in their area.

## Working rules

- Keep each change focused on the requested outcome. State assumptions, unresolved questions, and user-visible tradeoffs in the pull request.
- Follow existing repository conventions. If none exist, use explicit types, small composable modules, secure defaults, and clear tests rather than introducing broad frameworks.
- Keep UI, route/API, domain service, data-access, and provider adapter responsibilities separate.
- For user-facing changes, meet the UI/UX acceptance rules, state coverage, and review evidence in `docs/UI_UX.md`.
- Never commit secrets, tokens, private keys, production data, or sensitive request/response payloads. Use placeholders in examples and fixtures.
- Do not change generated files, lockfiles, dependencies, schemas, public contracts, or deployment settings without understanding their impact and including the required review notes.

## Pull request requirements

Every change is made through a reviewed pull request. A PR must include:

- The problem, solution, scope, and assumptions.
- Appropriate tests: unit tests for behavior; integration, API contract, and end-to-end coverage where the boundary changed.
- Migration and reversibility details for data/schema changes, including any rollout or compensating rollback plan.
- Privacy and security impact: data classification, authorization, secrets, logging/audit events, and abuse/failure paths.
- Observability impact: correlation, logs/metrics/traces, dashboards or alerts for meaningful new behavior.
- UI/UX impact and WCAG 2.2 AA evidence for every user-facing change.
- Documentation updates, including PRD acceptance criteria and architecture guidance when relevant.
- Deployment and rollback notes for production-impacting changes.

## ADR policy

Create and obtain approval for an ADR before implementing a material change to architecture, data storage/classification/retention, authentication/authorization, external providers, API compatibility, deployment, or security controls. Use `docs/adr/NNNN-short-title.md` as defined in [docs/adr/README.md](docs/adr/README.md) and follow the exception rules in [docs/GOVERNANCE.md](docs/GOVERNANCE.md).

## Explicit prohibitions

- No direct production changes or bypassing CI/CD and review controls.
- No committed secrets, sensitive telemetry, or use of production data in non-production environments without approved handling.
- No unreviewed destructive or unauthorized schema changes.
- No silent breaking API changes or unreviewed dependency upgrades.
- No weakening authentication, authorization, encryption, audit logging, or environment isolation to expedite delivery.
