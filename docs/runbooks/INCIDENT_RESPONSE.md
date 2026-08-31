# Incident response — bình tĩnh giữ lại những điều quan trọng 🚨

> Khi có sự cố, hãy chậm lại vừa đủ để an toàn: bảo vệ con người, bảo toàn bằng chứng, rồi mới khôi phục nhịp bình thường.

Use this runbook for suspected security, privacy, availability, or integrity incidents. Do not place secrets or sensitive payloads in incident channels, tickets, or screenshots.

## 1. Phân loại & khoanh vùng

1. Open a restricted incident record; assign an incident lead and preserve timestamps/correlation IDs.
2. Assess affected users, services, data classification, active exposure, and operational risk.
3. Contain safely: revoke/rotate exposed credentials, disable a vulnerable route/provider, limit privileged access, or roll back to a known healthy deployment.
4. Preserve redacted evidence and avoid destructive changes that erase investigation data.

## 2. Trao đổi & khôi phục

1. Notify only approved responders and stakeholders using the incident lead's communication plan.
2. Implement a tested remediation through the normal deployment path when feasible; record any emergency exception.
3. Verify recovery with health checks, error/latency metrics, audit events, and targeted user-flow validation.
4. Decide whether affected users, vendors, or regulators require notice; product-specific obligations are **TBD** and require owner review.

## 3. Khép lại & học hỏi

1. Document timeline, impact, root cause/contributing factors, containment, recovery, and remaining risk.
2. Create tracked follow-up tasks with owners and due dates in [TASKS.md](../TASKS.md).
3. Update an ADR, security control, test, alert, or this runbook when a gap was found.
4. Obtain owner sign-off before closure.
