# 0002: MongoDB tracker data and local development boundary

**Status:** Accepted
**Date:** 2026-08-22
**Owners:** TgTrh06

## Context

Tasks, habits, workouts, food entries, and derived daily views are private account-scoped data. The initial trial must be runnable locally without creating production infrastructure.

## Decision

Use MongoDB as the tracker and minimal-audit store. Run MongoDB locally with Docker during the trial. Each persisted document includes the authenticated account ID; repositories require that ID for all reads, updates, and deletes. Nutrition totals and dashboard summaries are derived from entries rather than stored as independently editable totals.

The original Next.js preview decision is superseded by ADR-0003. Vercel continues to host an UI/build-only preview; NestJS and MongoDB run locally, so preview builds clearly state that live API features are local-only. No production or cloud MongoDB resource is created by this change.

## Alternatives considered

- Supabase Postgres as the tracker source of truth was not selected because the trial explicitly evaluates MongoDB.
- MongoDB Atlas and a hosted NestJS API are deferred; they would introduce a new provider, data residency choice, and preview credential boundary.

## Consequences

Local development needs Docker and a local `MONGODB_URI`. A future hosted database, backups, retention, export/deletion fulfillment, or data residency decision needs a replacement ADR and migration plan.

## Security and privacy impact

Sensitive health/nutrition values remain in the local MongoDB instance and are not copied to Vercel previews, fixtures, logs, analytics, errors, or audit metadata. The API accepts only authenticated requests and uses account-scoped repositories.

## Rollout and rollback

Start MongoDB with `docker compose up -d mongodb`, use synthetic development data only, and verify account filtering plus deleted-record behavior. The Docker volume can be removed locally when the trial ends; no deployed data is changed.
