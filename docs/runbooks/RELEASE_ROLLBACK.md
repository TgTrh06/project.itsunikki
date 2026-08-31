# Release & rollback — ra khơi, nhưng luôn biết lối về ⛵

> Một lần phát hành tốt không chỉ là đi tới được nơi mới; đó còn là khả năng trở về an toàn nếu thực tế không như mong đợi.

## Trước khi đưa lên production

- Confirm the change has a documented scope, manual review, and recorded relevant test evidence.
- Confirm release scope, acceptance criteria, migration state, UI/UX review where applicable, security/privacy impact, dashboards/alerts, support notes, and rollback plan.
- Ensure staging uses isolated credentials and synthetic/anonymized data; never validate with unapproved production data.

## Phát hành

1. Record release notes and links to material ADRs; a `develop` → `main` pull request may be used but is not required.
2. Manually reconfirm test evidence, security/privacy impact, UI/UX review where applicable, and rollback readiness.
3. Deploy through the approved Vercel release flow; do not mutate production directly.
4. Verify health checks, critical user journeys, error/latency telemetry, audit events, and integration behavior.

## Quay lui

1. Stop promotion and decide whether to roll back code, disable a capability, or apply a compensating migration.
2. Roll back application code to the last known healthy deployment through the deployment platform.
3. Do not apply an unsafe destructive schema rollback. Use expand/migrate/contract or the approved compensating migration.
4. Verify recovery, communicate status, capture evidence, and follow [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) if impact is material.
