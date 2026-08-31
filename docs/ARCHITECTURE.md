# Architecture — phần khung cho một nơi chốn riêng 🌌

> Nhẹ ở bề mặt, chặt chẽ ở những điều người dùng không nhìn thấy.

**Status:** Baseline architecture for a sensitive-data Node.js web application. Product-specific choices are **TBD** until approved through an ADR.
**Authority:** This is the detailed architecture source of truth. For day-to-day rules, start with [ARCHITECTURE_ESSENTIALS.md](ARCHITECTURE_ESSENTIALS.md).

## 1. Mô hình hệ thống

The system is deployed as a Vercel-hosted web application with separate development, preview, staging, and production environments. The target design has these logical components:

1. **Web client:** renders the user interface, performs accessible client-side validation, and never owns authorization decisions or long-lived secrets.
2. **Serverless API:** Node.js route handlers and server-side domain services authenticate requests, enforce authorization, validate input, coordinate workflows, and return stable API contracts.
3. **Managed data services:** a **TBD** managed relational database is the authoritative transactional store; object storage is used only for approved file data.
4. **External providers:** identity, email, payments, analytics, or other integrations are **TBD** and isolated behind server-side adapters.
5. **Observability services:** approved logging, error tracking, metrics, tracing, and alerting providers receive redacted operational data only.

```text
Browser ──TLS──> Vercel web/client ──> Node.js serverless API ──> Managed database/storage
                                  │                    ├──> Approved external providers
                                  │                    └──> Redacted telemetry/audit sink
```

## 2. Niềm tin, bảo mật & dữ liệu

### Ranh giới tin cậy

- Treat browsers, webhooks, user input, uploaded files, and third-party responses as untrusted.
- Verify identity server-side; authorize every action against the current actor, role, tenant/resource, and requested operation.
- Enforce tenant isolation in the data access layer and, where supported, the database. Never accept tenant or role claims from the client as authority.
- Verify webhook signatures, use idempotency keys where supported, and persist delivery state before side effects.

### Kiểm soát dữ liệu nhạy cảm

- Classify data as public, internal, confidential, or restricted before collection. Collect the minimum necessary data for a documented purpose.
- Encrypt data in transit with TLS and at rest using managed-provider encryption. Use application-level encryption only when an ADR identifies a requirement.
- Store secrets only in Vercel environment settings or an approved secret manager; never in source, fixtures, logs, client bundles, issue trackers, or error messages.
- Apply least-privilege RBAC. Privileged actions require explicit authorization and write immutable audit events.
- Define retention, deletion, export, and legal-hold behavior for each sensitive-data category in a product ADR or data record.

### Sự kiện kiểm toán

Record minimal audit events for authentication outcomes, authorization denials, accepted creates/updates/deletes of account records, export/deletion requests, and privileged actions. Do not audit routine dashboard or history reads. Events must include timestamp, actor or service identity, action, resource type/identifier, tenant where applicable, outcome, request/correlation ID, and metadata that excludes secrets and sensitive payloads.

## 3. Ranh giới ứng dụng & giao diện

- Keep UI, route/API, domain service, data-access, and external-provider adapter layers separate. Dependencies flow inward: UI/routes → domain services → repositories/adapters.
- Domain services own business rules and authorization orchestration. Repositories own persistence queries. Provider adapters own vendor-specific behavior.
- Validate all untrusted input at the API boundary with explicit schemas. Return documented, stable error codes; never expose stack traces, query details, or secrets.
- Version public APIs deliberately. Prefer additive changes; deprecate with a communicated window. Breaking contracts need an ADR and coordinated release plan.
- Treat the database schema as an internal contract controlled by migrations. Migrations must be forward-compatible where possible, reviewed, tested against representative data, and have a rollback or compensating-change plan.
- Use async work only through approved queues/providers. Serverless request handlers must be idempotent where retries can occur and must not depend on local persistent state.

## 4. Độ tin cậy & vận hành

- Apply rate limiting, request-size limits, timeouts, retries with bounded backoff, and circuit-breaking/failure isolation for external calls.
- Use structured, redacted logs with correlation IDs; instrument critical flows with metrics and traces. Alert on security events, elevated errors, latency, and SLO burn.
- Backup managed data according to provider capability and **TBD** recovery objectives. Test restoration before relying on a backup policy.
- Maintain an incident runbook covering triage, containment, evidence preservation, communications, recovery, and post-incident review. Restrict incident data access to responders.
- Staging must use isolated credentials and synthetic/anonymized data. Production data must not be copied to preview, development, or staging without an approved exception.

## 5. Delivery & chất lượng

- Before release, manually run and record applicable formatting, type checks, unit tests, integration/API tests, dependency/security checks, and build validation. Preview deployments do not access production secrets or production data.
- Promote approved builds through staging to production using Vercel-managed deployments. Production deployments require manually verified health checks and a documented rollback path.
- Roll back application code through the prior healthy deployment. Handle schema changes with expand/migrate/contract or a tested compensating migration; never rely on an unsafe destructive rollback.
- Follow the testing pyramid: many unit tests for domain logic, focused integration tests for data/providers, API contract tests for routes, and a small set of end-to-end tests for critical journeys.

## 6. Architecture decision records — nơi quyết định được gọi tên

Create an ADR in `docs/adr/` for decisions that affect system boundaries, data storage/classification/retention, authentication or authorization, external providers, deployment, API compatibility, reliability targets, or security controls. Use `NNNN-short-title.md`, incrementing from `0001`.

Each ADR states context, decision, alternatives, consequences, security/privacy impact, rollout/rollback approach, and status. Do not implement the decision until the ADR is approved when the change is material. See [docs/adr/README.md](adr/README.md).

## 7. Những lựa chọn kiến trúc còn để ngỏ

- Identity provider and session model: **TBD**
- Database and migration tooling: **TBD**
- Object storage, queue, cache, and telemetry providers: **TBD**
- RPO/RTO, SLOs, supported regions, and data residency: **TBD**
- Product-specific roles, permissions, retention, and compliance obligations: **TBD**
