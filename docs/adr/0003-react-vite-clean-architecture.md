# 0003 — React Vite client & clean architecture boundaries ✨

> Phần giao diện nên nhẹ, nhanh và sáng rõ; phần bên trong nên có những đường ranh gọn gàng.

**Status:** Accepted
**Date:** 2026-08-24
**Owners:** TgTrh06

## Bối cảnh

The initial client used Next.js only as a static SPA build tool. The product does not use SSR or Next.js API routes, while the application needs smaller feature boundaries and clearer dependency direction across the React and NestJS codebases.

## Quyết định

Replace the Next.js client with React and Vite. Zustand owns cross-feature client state only; Zod validates public client configuration and form inputs. Vercel serves the static SPA with a fallback rewrite to `index.html`.

The API is a modular monolith. HTTP controllers depend on application use cases; use cases depend on domain ports; Mongoose persistence and Supabase verification are infrastructure adapters. Account ID continues to come only from verified Supabase token `sub` and remains mandatory for repository operations.

## Các lựa chọn đã cân nhắc

- Retain Next.js despite no SSR or route-handler use.
- Add React Router, SSR, shared package, event bus, CQRS framework, or microservices. None is required for the current workspace UI.

## Hệ quả

Public client variables use the `VITE_` prefix and are statically included in the bundle. They must never contain server credentials. API contracts remain at `/v1`; no data migration occurs. This ADR supersedes the Next.js-preview wording in ADR-0002 only.

## Tác động đến bảo mật & riêng tư

The public Supabase anonymous key, project URL, and local API base URL are the only browser configuration values. JWT verification, MongoDB URI, issuer configuration, authorization, and audit persistence remain server-only. Preview deployments have no local API or sensitive data.

## Triển khai & quay lui

Validate lint, types, tests, Vite build, Vercel SPA fallback, and responsive preview. Rollback is a source-level reversion to the prior client; MongoDB schema and API contracts are unchanged.
