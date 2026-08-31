# PRD — điều itsunikki muốn gìn giữ ✦

> Một công cụ nhỏ để ngày sống có dấu vết, không phải một cỗ máy bắt bạn sống theo khuôn.

**Status:** First-release definition for a personal productivity and wellbeing tracker.
**Owner:** TgTrh06
**Last reviewed:** 2026-08-22

## 1. Bức tranh sản phẩm

### Tầm nhìn

Enable one person to manage daily commitments, habits, workouts, and nutrition in one private, understandable workspace, then review their progress without moving data among separate trackers.

### Vấn đề cần giải quyết

Personal task, habit, fitness, and nutrition records are often fragmented. A person needs a single account-scoped view of what is due today and a reliable history of what they completed, logged, corrected, or deleted.

### Phạm vi bản phát hành đầu tiên

- Authenticated personal accounts with isolated data and a stored profile timezone.
- Tasks with due dates, simple recurrence, completion, correction, and rescheduling.
- Habits with a frequency/target, scheduled check-ins, progress or streak calculation, and correction.
- Manual workout and fitness-metric entries.
- Manual food-item entries with kcal, carbohydrate, fat, protein, and optional user-defined metrics; daily totals are calculated from saved entries.
- A daily dashboard with in-app due-item guidance and basic daily/weekly history review.
- Personal profile, export request, and deletion request flows.

### Những điều chủ động không làm

- Shared workspaces, social features, coaches, administrators managing another person's data, projects, subtasks, dependencies, or advanced schedules.
- Email, push, SMS, or external reminders; guidance is in-app only.
- Food catalogs, barcode scanning, recipes, wearable/device synchronization, Apple Health, Google Fit, Strava, or any external health/food provider.
- Clinical advice, diagnosis, or automated health recommendations.

## 2. Người dùng, dữ liệu & hành trình

| Persona | Need | Primary journey | Success signal |
| --- | --- | --- | --- |
| Personal account holder | See and act on daily commitments in one private place | Sign in → review today → complete or log an activity → confirm progress | Daily records are current without support or another tracker. |

### Lập trường về dữ liệu & riêng tư

- Each account owns only its own records. Every protected read and write enforces account isolation server-side.
- Workout history, fitness metrics, food entries, kcal, and macro data are sensitive personal data. Collect only data entered for the product's documented purpose.
- Store an account timezone and use it for due dates, recurring occurrences, daily totals, streaks, and daily/weekly review boundaries.
- Users may correct or delete their personal entries. Recalculate affected totals, streaks, and projections; retain only minimal redacted audit metadata: actor, timestamp, action, target type/identifier, outcome, and correlation ID.

## 3. Những điều sản phẩm cần làm

| ID | Requirement | Priority | Acceptance criteria |
| --- | --- | --- | --- |
| FR-001 | A person can create an account, sign in, complete first-time profile setup, and access only their own workspace. | Must | A valid session loads the account workspace; invalid or cross-account requests return a safe denial and disclose no private data. |
| FR-002 | A person can view a daily dashboard of due tasks, habits, and current workout/nutrition progress. | Must | The view uses the profile timezone, has loading/empty/error/success states, and gives in-app guidance without external notifications. |
| FR-003 | A person can create, update, complete, reschedule, and correct a task with a due date and simple recurrence. | Must | A task update creates or updates the applicable occurrence and recalculates the dashboard without modifying another account's records. |
| FR-004 | A person can define a habit and record or correct a scheduled check-in. | Must | The system calculates the current progress/streak from saved check-ins and the configured schedule, using the profile timezone. |
| FR-005 | A person can record, correct, or delete a manual workout and optional fitness metrics. | Must | Saved changes update the relevant daily/weekly history and do not expose health-related content in errors, telemetry, or audit metadata. |
| FR-006 | A person can add, correct, or delete individual food entries with kcal and macro values. | Must | The system validates numeric values and recalculates meal/day totals after every accepted change. |
| FR-007 | A person can review personal history by day or week across tasks, habits, workouts, and nutrition. | Must | Review results include only the current account's records, use the profile timezone, and safely handle no-data and partial-data states. |
| FR-008 | A person can manage profile settings and request personal-data export or deletion. | Must | Sensitive actions require the current authenticated account, record a minimal audit event, and return a safe status without exposing protected data. |

## 4. Những điều sản phẩm cần giữ vững

| Area | Baseline requirement | Product-specific target |
| --- | --- | --- |
| Privacy | Collect only data necessary for the documented personal-tracking purpose; support correction, export, and deletion requests. | No cross-account exposure; fitness and nutrition data treated as sensitive. |
| Security | Enforce authenticated, least-privilege access; protect secrets and data in transit and at rest. | Account isolation for every record access and mutation. |
| Accessibility | Meet WCAG 2.2 AA for supported flows. | Every capability covers loading, empty, error, success, and unauthorized states. |
| Performance | Define p95 latency and client performance budgets before production. | Dashboard and history targets are TBD. |
| Availability | Define service-level objectives and degradation behavior before production. | TBD. |
| Auditability | Record minimal audit metadata for authentication outcomes, authorization denials, accepted creates/updates/deletes, and export/deletion requests; do not audit routine dashboard/history reads. | Account-record mutations and privacy requests create records without sensitive payloads. |
| Observability | Emit redacted logs, metrics, traces, and actionable alerts. | No workout, metric, food, kcal, or macro values in telemetry. |

## 5. Đo lường & phát hành

| Metric | Baseline | Target | Measurement method | Owner |
| --- | --- | --- | --- | --- |
| Daily tracking completion | A signed-in user can act on today's records | TBD | Redacted aggregate product metric | TgTrh06 |
| Data accuracy after correction | Changed records update affected summaries | 100% in automated acceptance coverage | Scenario tests | TgTrh06 |
| Material security or privacy incidents | 0 material incidents | 0 | Incident register | TgTrh06 |

### Tiêu chí phát hành

- All Must requirements have passing acceptance tests and owner sign-off.
- The eight core journeys in [FLOWS.md](FLOWS.md) have approved behavior, state coverage, and accessible UI evidence.
- Privacy and security review confirms account isolation, sensitive-data handling, audit metadata, correction/deletion behavior, and export/deletion request handling.
- Monitoring, support guidance, rollback plan, and data-migration plan (if applicable) are ready before production release.

## 6. Những điều còn để ngỏ

**Decision owner:** TgTrh06. Decision deadlines are tracked in [TASKS.md](TASKS.md) section 1.4.

- Identity provider, session duration, password recovery, and account-verification policy: **TBD** by ADR.
- Database, migration tooling, encrypted backup/recovery objectives, data retention periods, and export/deletion execution process: **TBD** by ADR.
- Exact task recurrence, habit frequency, metric units, nutrition validation ranges, dashboard indicators, p95 latency, SLO, and supported regions: **TBD** before production acceptance.
- Any addition of sharing, external providers, notifications, advanced scheduling, or clinical functionality requires an updated PRD and ADR.
