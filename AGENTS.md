# project.itsunikki Coding Instructions

Use one primary agent only. Do not delegate, spawn subagents, or split project work across agents.

## Read only what applies

1. Read this file before changing the project.
2. For a product behavior change, read [PRD.md](docs/PRD.md) and the matching flow in [FLOWS.md](docs/FLOWS.md).
3. For a user-facing change, read [UI_UX.md](docs/UI_UX.md).
4. For authentication, sensitive data, APIs, storage, providers, deployments, or incidents, read [ARCHITECTURE_ESSENTIALS.md](docs/ARCHITECTURE_ESSENTIALS.md), then the relevant detail in [ARCHITECTURE.md](docs/ARCHITECTURE.md), [GOVERNANCE.md](docs/GOVERNANCE.md), or an approved ADR.

## Default delivery loop

1. Select one task from [TASKS.md](docs/TASKS.md) and inspect the nearest existing code and tests.
2. Implement the smallest coherent vertical slice. Reuse existing patterns.
3. Run the smallest relevant validation and inspect the diff.
4. Report changed files, validation performed, and any material assumption.

## Keep implementation small

- Do not add a framework, provider, cache, queue, abstraction, schema, or feature unless the task or an approved requirement needs it.
- Ask only when an ambiguity changes user-visible scope, data handling, security, or an irreversible decision. Otherwise make the smallest reasonable assumption and report it.
- Keep UI, API, domain, data-access, and provider responsibilities separate when those layers exist; do not create empty layers in advance.
- Never commit secrets, production data, sensitive payloads, or unredacted telemetry.

## Proportional evidence

| Change | Required evidence |
| --- | --- |
| Routine fix, isolated styling, test, or documentation | Scope and the relevant local validation. |
| Approved feature behavior | Relevant tests; UI/UX evidence only for user-facing work; update PRD/flows only when behavior changes. |
| Architecture, authentication, sensitive data, public contract, provider, or irreversible migration | ADR plus focused security, migration, rollback, and validation evidence. |

## Non-negotiable controls

- Enforce account/resource authorization server-side and keep sensitive data out of client-visible secrets, logs, errors, analytics, and fixtures.
- Do not directly change production state, silently break public contracts, perform destructive schema changes, or weaken authentication, authorization, encryption, audit metadata, or environment isolation.
