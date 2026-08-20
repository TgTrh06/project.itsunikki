# Release and Rollback Runbook

## Before production promotion

- Confirm the change entered `develop` through a reviewed pull request and all required checks passed.
- Confirm release scope, acceptance criteria, migration state, UI/UX review where applicable, security/privacy impact, dashboards/alerts, support notes, and rollback plan.
- Ensure staging uses isolated credentials and synthetic/anonymized data; never validate with unapproved production data.

## Promote

1. Open a `develop` → `main` pull request with release notes and links to material ADRs.
2. Reconfirm the required `quality-and-security / required` check and resolved review conversations.
3. Deploy through the approved Vercel/GitHub release flow; do not mutate production directly.
4. Verify health checks, critical user journeys, error/latency telemetry, audit events, and integration behavior.

## Roll back

1. Stop promotion and decide whether to roll back code, disable a capability, or apply a compensating migration.
2. Roll back application code to the last known healthy deployment through the deployment platform.
3. Do not apply an unsafe destructive schema rollback. Use expand/migrate/contract or the approved compensating migration.
4. Verify recovery, communicate status, capture evidence, and follow [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) if impact is material.
