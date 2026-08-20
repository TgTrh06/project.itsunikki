# Delivery Governance

**Status:** Mandatory control baseline.
**Applies to:** All human and AI contributors, source changes, documentation changes, deployment changes, and production operations.

## 1. Authority and read order

1. [AGENTS.md](../AGENTS.md) defines mandatory contributor behavior.
2. [ARCHITECTURE_ESSENTIALS.md](ARCHITECTURE_ESSENTIALS.md) defines operational architecture rules.
3. [ARCHITECTURE.md](ARCHITECTURE.md) is the detailed technical authority.
4. [UI_UX.md](UI_UX.md) is mandatory for user-facing work.
5. [PRD.md](PRD.md) defines accepted product intent; unresolved items remain `TBD`.
6. Approved ADRs under `adr/` supersede prior architecture choices in their stated scope.
7. [TASKS.md](TASKS.md) is the work register; it does not override the documents above.

If sources conflict, stop implementation and obtain an ADR or explicit owner decision. Record the resolution in the change record.

## 2. Change classification

| Classification | Examples | Required controls |
| --- | --- | --- |
| Routine | Isolated copy, styling, unit-test, or documentation correction | Document the intended change and complete relevant tests/checklist. |
| Material | Public API, UI flow, dependency, provider, data model, migration, observability, or deployment change | Routine controls plus impact analysis, rollout/rollback notes, and updated documentation. |
| Sensitive | Authentication, authorization, secrets, data classification/retention, tenant isolation, production access, or incident remediation | Material controls plus ADR when policy/architecture changes and explicit security/privacy review. |

## 3. Manual change evidence

Before a material, sensitive, release, or production-impacting change, record scope, assumptions, tests, privacy/security impact, observability impact, documentation changes, rollout, and rollback. UI changes must follow [UI_UX.md](UI_UX.md). Sensitive changes must identify the reviewer/owner and any incident or migration dependency. A pull request may be used as the change record but is not mandatory.

## 4. Decision and exception control

- Create an ADR before material decisions involving architecture, security, data, API compatibility, providers, deployment, or reliability targets.
- ADRs use `adr/NNNN-short-title.md` and cannot be silently replaced; supersede them with a new ADR.
- Exceptions are time-bound, owned, documented in the change record, and tracked in [TASKS.md](TASKS.md). Expired exceptions block further release until renewed or resolved.
- No exception permits committed secrets, direct production changes, bypassed authorization, or unreviewed destructive migration.

## 5. Release control

- `develop` is the integration/staging branch; `main` is production by convention, without repository-enforced branch rules.
- Before production promotion, the maintainer manually verifies release notes, relevant test evidence, security/privacy impact, UI/UX review, observability, and rollback readiness.
- A pull request and independent review are optional controls chosen by the maintainer; they are not enforced by repository configuration.
- Follow [runbooks/RELEASE_ROLLBACK.md](runbooks/RELEASE_ROLLBACK.md) for release and reversal, and [runbooks/INCIDENT_RESPONSE.md](runbooks/INCIDENT_RESPONSE.md) for incidents.
