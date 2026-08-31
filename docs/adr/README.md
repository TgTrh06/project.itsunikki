# ADR — những quyết định để lại dấu ✦

> Có những điều không nên chỉ nằm trong trí nhớ. ADR ghi lại lý do ta đã chọn con đường này, để sau này vẫn hiểu và tôn trọng quyết định khi ấy.

Use this directory for approved decisions that materially affect architecture, data, security, deployment, integrations, or API compatibility.

## Đặt tên & vòng đời

- Name files `NNNN-short-title.md`, starting with `0001` and incrementing sequentially.
- Use statuses `Proposed`, `Accepted`, `Superseded`, or `Rejected`.
- Link a superseded ADR to its replacement; do not rewrite historical decisions.

## Khuôn mẫu

```md
# NNNN: Tên quyết định ngắn gọn

**Status:** Proposed
**Date:** YYYY-MM-DD
**Owners:** TBD

## Bối cảnh

What problem, constraints, and facts require a decision?

## Quyết định

What will be done, and where does the decision apply?

## Các lựa chọn đã cân nhắc

What viable options were considered and why were they not selected?

## Hệ quả

List benefits, costs, operational effects, and follow-up work.

## Tác động đến bảo mật & riêng tư

Describe data classification, access controls, secrets, auditability, compliance, and threat-model impact.

## Triển khai & quay lui

Describe implementation sequencing, migration/compatibility plan, verification, monitoring, and reversal or compensating action.
```

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the ADR threshold and [AGENTS.md](../../AGENTS.md) for contribution rules.
