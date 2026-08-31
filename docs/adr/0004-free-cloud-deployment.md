# 0004 — Free cloud deployment for personal real data ☁️

> Khi mang dữ liệu thật lên mây, “miễn phí” chỉ có ý nghĩa nếu những giới hạn và đường lui đều được gọi tên.

**Status:** Superseded in its Atlas/storage scope by [ADR-0005](0005-supabase-postgres-tracker-storage.md)
**Date:** 2026-08-25
**Owners:** TgTrh06

## Bối cảnh

The personal tracker now needs a public web client and API while preserving Supabase authentication, MongoDB tracker ownership, and server-side authorization. The owner has chosen a no-cost deployment for personal real data and explicitly accepted an Atlas IP access list of `0.0.0.0/0`, because Render Free has no fixed outbound IP.

## Quyết định

Deploy the React/Vite SPA to Vercel Hobby and the NestJS API to a Render Free web service, both in Singapore where available. Use MongoDB Atlas M0 for tracker and audit metadata in Singapore when its free tier offers that region, otherwise the nearest supported Atlas region. Continue to use Supabase Free in Singapore for identity and JWT issuance.

The API remains the only holder of `MONGODB_URI` and `SUPABASE_JWT_ISSUER`. It validates Supabase Bearer tokens, derives the account ID from the verified `sub`, and retains mandatory account-scoped repository queries. The API binds to the provider `PORT`, exposes `/v1/health`, and allows CORS only from the exact production Vercel `WEB_ORIGIN` (or the local origin in development).

Vercel gets only the public `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and production `VITE_API_BASE_URL`. Preview builds remain UI/build-only and receive neither API connectivity nor server credentials. Supabase Site URL and email-confirmation/password-reset redirect URLs point to the Vercel production HTTPS origin.

Atlas has one dedicated database user with read/write access limited to the `itsunikki` database. Its network access list allows `0.0.0.0/0`; TLS is required by the Atlas connection URI, the password must be strong and unique, and the URI is stored solely as a Render secret. No Supabase service-role key is used.

## Các lựa chọn đã cân nhắc

- Keep API and MongoDB local only; rejected because the owner needs full cloud access.
- Use an allowlisted static egress IP; not available on the chosen free Render service.
- Deploy the API to Vercel; rejected because the current NestJS service and long-lived MongoDB connection are better suited to a web-service host.
- Pay for static egress/private networking or managed backups; deferred to a future ADR if availability or a narrower network boundary is required.

## Hệ quả

This is a personal trial, not an availability-guaranteed production service. Render Free may sleep after inactivity and incur a cold start. Supabase Free projects can pause after inactivity. Atlas M0 and the selected free providers have capacity, retention, support, and backup limitations; no recovery objective is asserted. The user must retain any personally important records outside this trial until a backup/restore plan is approved.

The deployment requires separate dashboard configuration and does not create provider accounts, secrets, databases, or a production release from this repository. Render's blueprint builds the API from the monorepo root. Vercel is configured with `apps/web` as its root directory and deploys the static `dist` output with an SPA fallback.

## Tác động đến bảo mật & riêng tư

Real personal tracker data resides only in Atlas and is sent between browser, Vercel, Render, Supabase, and Atlas over TLS. It must not appear in Vercel previews, source, browser configuration beyond public values, logs, errors, analytics, fixtures, or audit payloads. Audit metadata remains limited to actor, time, action, resource type/ID, outcome, and correlation ID; it excludes workout, food, kcal, and macro payloads.

`0.0.0.0/0` increases exposure to internet-originated connection attempts. It is acceptable for this trial only because Atlas still requires authenticated TLS connections, the database user has minimal scope, and the connection URI remains secret. Rotate that database password and the Render secret immediately if exposure is suspected. Future paid deployment should replace this with fixed-IP allowlisting or private networking.

## Triển khai & quay lui

Provision Atlas, then deploy the Render blueprint and verify the redacted health endpoint. Deploy Vercel production, set the exact Render CORS origin, configure Supabase redirects, and run the documented authentication, isolation, CRUD, CORS, and cold-start smoke checks. Record deployment URL and time outside the repository.

For rollback, redeploy the previous healthy Vercel or Render revision, or remove the public web/API service while retaining Atlas data. Do not delete Atlas data or rotate valid credentials as part of an application rollback. Reverting to local-only operation requires removing cloud environment variables and using the local Docker MongoDB configuration; data migration is intentionally out of scope.
