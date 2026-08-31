# 0001 — Supabase authentication & account session model 🔐

> Cánh cửa đầu tiên của itsunikki: đủ dễ để bước vào, đủ chắc để dữ liệu riêng tư ở lại đúng nơi.

**Status:** Accepted
**Date:** 2026-08-22
**Owners:** TgTrh06

## Bối cảnh

The tracker stores sensitive fitness and nutrition data. It requires a personal account boundary without placing credentials, authorization decisions, or long-lived secrets in the browser.

## Quyết định

Use Supabase Auth for email/password registration, email confirmation, password reset, and user sessions. Hosted Supabase defaults for token expiry, refresh-token rotation, password policy, and recovery are retained until a production ADR changes them. The only application role is `account-holder`.

The browser obtains a Supabase access token and sends it as a Bearer token to NestJS. NestJS verifies the token against the configured Supabase issuer/JWKS, derives the account identifier exclusively from `sub`, and applies it to every protected repository query and mutation. The browser never supplies an account or role as authority.

## Các lựa chọn đã cân nhắc

- A custom password/session service would add password and credential-management risk.
- Magic-link or Google OAuth were not selected for this MVP.
- Direct MongoDB access from the browser would bypass the server-side authorization boundary.

## Hệ quả

The development team must configure a separate Supabase development project and redirect URLs for localhost. Supabase credentials are provided only through local environment configuration; the anonymous key is public by design, while server configuration remains private.

## Tác động đến bảo mật & riêng tư

Email addresses and authentication tokens are sensitive. API errors are stable and do not disclose account existence or token details. Authorization denials and accepted mutations create minimal audit events without workout, food, kcal, macro, or other sensitive payloads.

## Triển khai & quay lui

Enable email confirmation and password recovery in the development project, then verify sign-up, sign-in, password reset, invalid-token rejection, and cross-account denial. Rollback consists of disabling the integration and removing its environment variables; no application data migration is required.
