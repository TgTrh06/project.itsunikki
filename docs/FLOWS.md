# Flow catalog — những nhịp điệu của itsunikki 🌿

> Mỗi flow là một lời hứa nhỏ: khi bạn cần ghi lại điều gì, đường đi sẽ rõ ràng, an toàn và thuộc về riêng bạn.

**Status:** First-release activity-flow analysis for the personal productivity and wellbeing tracker.
**Authority:** This catalog explains ownership and handoffs. [PRD.md](PRD.md) is authoritative for product intent; [ARCHITECTURE.md](ARCHITECTURE.md) is authoritative for system controls; the runbooks remain authoritative for incident and release procedures.
**Compatibility:** All diagrams use standard Mermaid `flowchart TB` syntax with top-level subgraphs as swimlane-style ownership groups. They render in the current repository previewer.

## 1. Phạm vi & cách đọc

- One personal account holder owns all release-one records. There are no shared workspaces or administrator flows.
- Every flow enforces the current account before a protected read or write. A safe rejection ends the flow without revealing another account's data.
- Each diagram shows one happy path and one meaningful rejection path. Detailed UI loading, empty, error, success, and unauthorized states are required by [UI_UX.md](UI_UX.md).
- Dates, recurrence, daily totals, habit progress, and review windows use the stored profile timezone.
- Fitness, nutrition, kcal, macro, and user-defined metric values are sensitive personal data. Diagrams name audit events but never include sensitive payloads.
- Audit records cover authentication outcomes, authorization denials, accepted creates/updates/deletes, and export/deletion requests; routine dashboard and history reads are not audited.
- Incident and release/rollback procedures are operational, not product journeys. Follow [Incident Response](runbooks/INCIDENT_RESPONSE.md) and [Release and Rollback](runbooks/RELEASE_ROLLBACK.md) instead of duplicating them here.

## 2. Bản đồ khả năng

```mermaid
flowchart TB
    A([Account access]) --> B[Daily dashboard]
    B --> C[Tasks]
    B --> D[Habits]
    B --> E[Workouts]
    B --> F[Nutrition]
    C --> G[Day or week review]
    D --> G
    E --> G
    F --> G
    A --> H[Personal data management]
```

## 3. Sổ tay phân tích flow

| ID | Journey and trigger | Authorization and data changed | Audit and exit | Exception | PRD |
| --- | --- | --- | --- | --- | --- |
| BF-01 | Access the app or complete first-time setup | Current identity; account/profile with timezone | Authentication outcome; workspace opens | Invalid identity or session is safely rejected | FR-001 |
| BF-02 | Open today’s view | Current account; dashboard projection reads due items and daily totals | Account-scoped dashboard read; daily guidance appears | Unauthorized or unavailable data is safely rejected | FR-002 |
| BF-03 | Create, complete, reschedule, or correct a task | Current account; task and scheduled occurrence | Task mutation; dashboard projection refreshes | Invalid input or recurrence is safely rejected | FR-003 |
| BF-04 | Define, check in, or correct a habit | Current account; habit and check-in | Habit mutation; progress/streak recalculates | Invalid schedule or input is safely rejected | FR-004 |
| BF-05 | Log, correct, or delete a workout/metric | Current account; workout and optional metric | Sensitive personal-data mutation; history recalculates | Invalid metric/input is safely rejected | FR-005 |
| BF-06 | Add, correct, or delete a food item | Current account; food entry and meal/day nutrition total | Sensitive personal-data mutation; aggregates recalculate | Invalid kcal/macro input is safely rejected | FR-006 |
| BF-07 | Review a day or week | Current account; historical records and derived summaries | Protected review read; unified summary appears | Unauthorized or unavailable data is safely rejected | FR-007 |
| BF-08 | Change profile or request export/deletion | Current account; profile or queued privacy request | Sensitive-action audit; safe request status appears | Invalid or unauthorized request is safely rejected | FR-008 |

## 4. Quyền sở hữu & lịch sử

| Concept | Owner and purpose | Derived or audit behavior |
| --- | --- | --- |
| Account and profile | Stores the account boundary, preferences, and timezone. | Authentication outcomes, authorization denials, accepted profile changes, and export/deletion requests create minimal audit records. |
| Task and scheduled occurrence | Stores a task’s due date, simple recurrence, and the occurrence acted upon. | Accepted creates/updates/deletes create a minimal audit record and refresh dashboard due items. |
| Habit and check-in | Stores the configured habit and dated completion record. | Accepted creates/updates/deletes create a minimal audit record; progress/streak is recalculated from the schedule and check-ins. |
| Workout and metric | Stores manual workout records and optional user-defined fitness metrics. | Accepted creates/updates/deletes create a minimal audit record and refresh daily/weekly history. |
| Food entry and nutrition total | Stores each manually entered food item and its kcal/macros. | Accepted creates/updates/deletes create a minimal audit record; meal/day totals are derived from current entries, not independently edited. |
| Dashboard projection | Provides account-scoped due items and daily progress. | It is rebuilt or refreshed from source records after accepted changes. |
| Minimal audit event | Records actor, time, action, target type/identifier, outcome, and correlation ID. | It never contains workout, metric, food, kcal, macro, or other sensitive payloads. |

Users may correct or delete their own historical task, habit, workout, metric, and food records. The system recalculates the affected occurrence, totals, streak/progress, dashboard, and review projection, then records only the minimal audit event.

## 5. BF-01 — Vào ứng dụng & thiết lập lần đầu

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Access app])
    end
    subgraph client[Web Client]
        C1[Sign in or set up]
        C2([Open workspace])
    end
    subgraph service[Identity / API]
        S1[Authenticate]
        S2{Profile ready?}
        S3[Reject safely]
    end
    subgraph account[Account / Profile / Audit]
        A1[Load account]
        A2[Create profile and timezone]
        A3[Audit access]
    end

    P1 --> C1 --> S1 --> S2
    S1 -->|Invalid| S3
    S2 -->|Yes| A1 --> A3 --> C2
    S2 -->|No| A2 --> A3 --> C2
```

## 6. BF-02 — Dashboard mỗi ngày & hướng dẫn trong ứng dụng

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Open today])
    end
    subgraph client[Web Client]
        C1[Request daily view]
        C2([Show due guidance])
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2[Build daily view]
        S3[Reject safely]
    end
    subgraph data[Tasks / Habits / Health Data]
        D1[Load due items]
        D2[Load daily totals]
    end

    P1 --> C1 --> S1
    S1 -->|Denied| S3
    S1 --> D1 --> D2 --> S2 --> C2
```

## 7. BF-03 — Vòng đời một task

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Create, complete, reschedule, or correct task])
    end
    subgraph client[Web Client]
        C1[Validate fields]
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2{Valid task and recurrence?}
        S3[Reject safely]
    end
    subgraph data[Task / Occurrence / Audit]
        D1[Save task or occurrence]
        D2[Refresh dashboard]
        D3([Audit mutation])
    end

    P1 --> C1 --> S1 --> S2
    S2 -->|No| S3
    S2 -->|Yes| D1 --> D2 --> D3
```

## 8. BF-04 — Tạo habit & check-in

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Define, check in, or correct habit])
    end
    subgraph client[Web Client]
        C1[Validate schedule]
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2{Valid habit period?}
        S3[Reject safely]
    end
    subgraph data[Habit / Check-in / Audit]
        D1[Save habit or check-in]
        D2[Recalculate progress or streak]
        D3([Audit mutation])
    end

    P1 --> C1 --> S1 --> S2
    S2 -->|No| S3
    S2 -->|Yes| D1 --> D2 --> D3
```

## 9. BF-05 — Ghi buổi tập & chỉ số thể chất

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Log, correct, or delete workout])
    end
    subgraph client[Web Client]
        C1[Validate workout and metrics]
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2{Valid sensitive input?}
        S3[Reject safely]
    end
    subgraph data[Workout / Metric / Audit]
        D1[Save or remove record]
        D2[Refresh history]
        D3([Audit mutation])
    end

    P1 --> C1 --> S1 --> S2
    S2 -->|No| S3
    S2 -->|Yes| D1 --> D2 --> D3
```

## 10. BF-06 — Ghi món ăn & macro

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Add, correct, or delete food item])
    end
    subgraph client[Web Client]
        C1[Validate kcal and macros]
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2{Valid nutrition input?}
        S3[Reject safely]
    end
    subgraph data[Food Entry / Totals / Audit]
        D1[Save or remove food item]
        D2[Recalculate meal and day totals]
        D3([Audit mutation])
    end

    P1 --> C1 --> S1 --> S2
    S2 -->|No| S3
    S2 -->|Yes| D1 --> D2 --> D3
```

## 11. BF-07 — Nhìn lại ngày & tuần

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Choose day or week])
    end
    subgraph client[Web Client]
        C1[Request review]
        C2([Show unified summary])
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2[Calculate progress view]
        S3[Reject safely]
    end
    subgraph data[History / Projections]
        D1[Load source history]
        D2[Load derived totals]
    end

    P1 --> C1 --> S1
    S1 -->|Denied| S3
    S1 --> D1 --> D2 --> S2 --> C2
```

## 12. BF-08 — Quản lý dữ liệu cá nhân

```mermaid
flowchart TB
    subgraph person[Person]
        P1([Change profile or request export/deletion])
    end
    subgraph client[Web Client]
        C1[Confirm sensitive request]
        C2([Show safe status])
    end
    subgraph service[API / Domain Service]
        S1[Authorize account]
        S2{Valid request?}
        S3[Reject safely]
    end
    subgraph data[Profile / Privacy Request / Audit]
        D1[Update profile or queue request]
        D2([Audit sensitive action])
    end

    P1 --> C1 --> S1 --> S2
    S2 -->|No| S3
    S2 -->|Yes| D1 --> D2 --> C2
```
