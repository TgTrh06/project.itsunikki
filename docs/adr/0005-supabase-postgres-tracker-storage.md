# 0005: Supabase Postgres tracker storage

**Status:** Accepted
**Date:** 2026-08-25
**Owners:** TgTrh06

## Context

The tracker needs durable, account-scoped relational storage while remaining free for a personal trial. Atlas is unnecessary once Supabase already supplies Auth and Postgres, and its `0.0.0.0/0` network exception is no longer justified.

## Decision

Supabase Postgres in Singapore is the source of truth for profiles, tasks, habits, workouts, food entries, and minimal audit metadata. NestJS remains the only tracker API. It verifies Supabase JWTs and passes the verified `sub` to a Drizzle ORM repository. The browser uses Supabase only for Auth and never accesses tracker tables through the Data API.

Versioned SQL migrations under `supabase/migrations` are the schema source of truth. Drizzle ORM supplies typed repository queries without a separate migration generator. The migrations create the private `tracker` schema, constraints, indexes, foreign keys to `auth.users`, and forced RLS policies. Every repository operation runs in a transaction that sets the account context, so RLS and explicit account predicates both protect ownership. Render connects through Supavisor session mode with a separate least-privilege database role and a secret `DATABASE_URL`.

## Alternatives considered

- Keep MongoDB Atlas M0 and its public network allowlist.
- Expose tracker tables directly to the browser through Supabase Data API.
- Use the Supabase `postgres` owner or a service-role key from Render.

## Consequences

MongoDB, Mongoose, Atlas provisioning, Docker MongoDB, and `MONGODB_URI` are removed. The external `/v1` JSON contract remains unchanged. No cloud Atlas data exists to migrate; existing local MongoDB data is not deleted or automatically converted.

Supabase Free still has no automatic backups or point-in-time recovery. The owner must make off-site logical exports before treating this as important data storage.

## Security and privacy impact

`DATABASE_URL`, the database role password, and the JWT issuer remain server-only. Vercel receives only public `VITE_*` configuration. Tracker data stays in a non-public schema; client roles have no grants. Audit events retain only actor, time, action, resource type/ID, outcome, and correlation ID, never tracker payloads.

## Rollout and rollback

Apply migrations to a separate Supabase development project, run repository/RLS tests, then configure Render with its least-privilege `DATABASE_URL`. Rollback is a code redeploy to the prior MongoDB version only before real Postgres data exists. After data exists, use additive/compensating Postgres migrations; never drop tracker tables as rollback.
