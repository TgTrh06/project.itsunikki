# Tasks

Use this file to plan and deliver the `itsunikki` application in small, reviewable steps.

## How to use this file

- Work on one numbered task per session or recorded change.
- Use one primary agent only; do not delegate or spawn subagents for this project.
- For coding, select one task, implement one coherent slice, run the smallest relevant validation, then update only the documentation that changed behavior or a material boundary.
- Mark a task **in progress** before editing and **done** only after its acceptance criteria are verified.
- If a task cannot be described in one line, split it into smaller tasks.
- Add newly discovered work beneath the most relevant section; preserve completed task history.
- Link material architecture, data, security, deployment, or API-contract decisions to an ADR in [`adr/`](adr/README.md).

**Status:** `[ ]` todo · `[-]` in progress · `[x]` done · `[!]` blocked

---

## 0. Governance and delivery controls

- [x] 0.1 Establish the governance, UI/UX, security, incident, and release/rollback documentation baseline.
- [x] 0.2 Remove repository-managed GitHub enforcement; retain documentation-led manual controls.
- [ ] 0.3 Define the manual pre-release checklist after application scaffolding, including lint, typecheck, tests, build, dependency review, and secret review.
- [ ] 0.4 Run an incident and rollback tabletop exercise; record follow-up tasks and owners.
- [x] 0.5 Configure the global Codex profile for GPT-5.6 Terra at medium reasoning effort with multi-agent disabled.
- [x] 0.6 Add and validate the lean `itsunikki-coding` skill and proportional-evidence coding guidance.

## 1. Discovery and product definition

- [x] 1.1 Confirm the personal-tracker vision, personal-account user, primary problem, and release-one journeys in [PRD.md](PRD.md).
- [x] 1.2 Define first-release scope, exclusions, functional requirements, and flow catalog in [FLOWS.md](FLOWS.md).
- [ ] 1.3 Approve data classifications, retention requirements, export/deletion execution, and account policy through ADRs.
- [ ] 1.4 Record unresolved product and compliance decisions with an owner and due date.

## 2. Application foundation

- [ ] 2.1 Scaffold the Node.js web application and its folder structure.
- [ ] 2.2 Configure TypeScript, formatting, linting, tests, and documented manual validation commands.
- [ ] 2.3 Establish accessible theme tokens, typography, layout primitives, and responsive breakpoints.
- [ ] 2.4 Configure separate development, preview, staging, and production environments without exposing secrets.

## 3. Security and platform

- [ ] 3.1 Select and document the identity provider, session model, and RBAC policy.
- [ ] 3.2 Select and document the managed database, migration tooling, tenancy model, and backup/recovery objectives.
- [ ] 3.3 Implement server-side validation, authorization boundaries, safe errors, rate limits, and request correlation.
- [ ] 3.4 Configure structured redacted logs, audit events, error tracking, metrics, and alerting.

## 4. Release-one user capabilities

- [x] 4.1 Define the eight release-one journeys, ownership, protected data, exceptions, and acceptance links in [FLOWS.md](FLOWS.md).
- [ ] 4.2 Implement account access, first-time profile/timezone setup, account isolation, and safe session failure states.
- [ ] 4.3 Implement the daily dashboard with in-app due guidance and accessible loading, empty, error, success, and unauthorized states.
- [ ] 4.4 Implement task creation, simple recurrence, completion, rescheduling, correction, and dashboard refresh.
- [ ] 4.5 Implement habit setup/check-in/correction and timezone-aware progress or streak calculation.
- [ ] 4.6 Implement manual workout and optional fitness-metric logging, correction/deletion, redacted telemetry, and history refresh.
- [ ] 4.7 Implement individual food-item logging with kcal, carb, fat, protein, optional metrics, and recalculated meal/day totals.
- [ ] 4.8 Implement day/week review and personal-data profile, export-request, and deletion-request flows.
- [ ] 4.9 Add unit, integration/API contract, and end-to-end tests for account isolation, timezone day boundaries, recurrence, corrections/deletions, aggregate recalculation, sensitive-data redaction, and WCAG 2.2 AA states.

## 5. Deferred integrations

- [ ] 5.1 Keep food catalogs, barcode scanning, wearables, health platforms, external reminders, and social/sharing capabilities out of the first release.
- [ ] 5.2 Before adding any provider, update the PRD and create an ADR covering consent, data minimization, provider failure, retries, idempotency, and redacted telemetry.
- [ ] 5.3 Before receiving webhooks, define signature verification, duplicate-delivery handling, and safe failure behavior.

## 6. Release readiness

- [ ] 6.1 Create the staging deployment, health checks, preview-data isolation, and production promotion workflow.
- [ ] 6.2 Define release dashboards, alert thresholds, support procedures, and an incident runbook.
- [ ] 6.3 Verify rollback for application code and the migration/compensating-change plan for schema changes.
- [ ] 6.4 Complete the first-release checklist in [PRD.md](PRD.md) and obtain required reviews.

## 7. Deferred work

- [ ] 7.1 **TBD:** Add validated follow-up work here after the first-release scope is approved.
