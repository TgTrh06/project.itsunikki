# Tasks

Use this file to plan and deliver the `itsunikki` application in small, reviewable steps.

## How to use this file

- Work on one numbered task per session or recorded change.
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

## 1. Discovery and product definition

- [ ] 1.1 Confirm the product vision, target users, and primary problem in [PRD.md](PRD.md).
- [ ] 1.2 Define the first release scope, explicit out-of-scope items, and measurable success criteria.
- [ ] 1.3 Define approved data classifications, retention requirements, and product roles.
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

## 4. Core user experience

- [ ] 4.1 Define the first priority user journey, screen flow, permissions, loading/empty/error states, and acceptance criteria.
- [ ] 4.2 Implement the first protected user flow with responsive and WCAG 2.2 AA behavior.
- [ ] 4.3 Implement the administrator flow for the approved role and audit requirements.
- [ ] 4.4 Add unit, integration/API contract, and end-to-end tests for the critical journeys.

## 5. External integrations

- [ ] 5.1 Identify the first approved external provider and create its ADR.
- [ ] 5.2 Implement the provider behind a server-side adapter with timeouts, retries, idempotency, and redacted telemetry.
- [ ] 5.3 Verify webhook signatures and duplicate-delivery handling where applicable.

## 6. Release readiness

- [ ] 6.1 Create the staging deployment, health checks, preview-data isolation, and production promotion workflow.
- [ ] 6.2 Define release dashboards, alert thresholds, support procedures, and an incident runbook.
- [ ] 6.3 Verify rollback for application code and the migration/compensating-change plan for schema changes.
- [ ] 6.4 Complete the first-release checklist in [PRD.md](PRD.md) and obtain required reviews.

## 7. Deferred work

- [ ] 7.1 **TBD:** Add validated follow-up work here after the first-release scope is approved.
