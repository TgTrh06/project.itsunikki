# UI/UX — dịu dàng, rõ ràng, luôn trong tầm tay ✨

> itsunikki không cần ồn ào để đẹp. Mỗi màn hình nên giúp người dùng biết mình đang ở đâu, làm gì tiếp theo và dữ liệu của mình đang được tôn trọng.

**Status:** Mandatory baseline for every user-facing change.
**Authority:** Read this document before creating or changing screens, flows, components, content, or user-visible API errors. [ARCHITECTURE.md](ARCHITECTURE.md) remains authoritative for security and system boundaries.

## 1. Kết quả cần đạt

Every supported user flow must be understandable, keyboard-operable, responsive, and usable with assistive technology. The acceptance target is WCAG 2.2 AA unless an approved, time-bound exception is recorded in the change record.

## 2. Nguyên tắc thiết kế & tương tác

- Use the approved design tokens and reusable components once they exist; do not introduce one-off colors, spacing scales, typography, or interaction patterns without documenting the need.
- Use semantic HTML first. Controls must use native elements where possible, have visible labels, clear focus indicators, and keyboard behavior matching user expectations.
- Preserve a logical heading hierarchy, meaningful page titles, and predictable focus order. Manage focus after navigation, dialogs, validation failures, and async completion.
- Support narrow and wide viewports without horizontal scrolling, clipped controls, hover-only actions, or loss of essential information.
- Never communicate state through color, animation, iconography, or sound alone. Respect `prefers-reduced-motion` and avoid motion that obscures or delays a task.
- Write concise, action-oriented copy. Use plain-language labels and errors that say what happened, what the user can do next, and how to get help when recovery is impossible.

## 3. Những trạng thái phải có

For each asynchronous or data-dependent screen, implement and review:

| State | Requirement |
| --- | --- |
| Loading | Explain progress with a suitable indicator; preserve layout where practical; do not trap keyboard focus. |
| Empty | Explain why no content appears and provide the next permitted action. |
| Error | Use safe, actionable language; preserve user input when safe; offer retry or support guidance. |
| Success | Confirm the completed action and any durable effect without relying only on transient toast messages. |
| Unauthorized | Do not leak restricted data; explain allowed recovery such as sign-in, requesting access, or returning safely. |

## 4. Checklist tiếp cận & riêng tư

- [ ] Keyboard-only navigation reaches and operates every control, including dialogs and custom widgets.
- [ ] Visible focus, contrast, text resizing, responsive reflow, and target sizes meet WCAG 2.2 AA for the changed flow.
- [ ] Images, icons, forms, validation messages, tables, and live updates have appropriate text alternatives and semantics.
- [ ] The flow works with browser zoom and does not depend on hover, pointer precision, color, or motion.
- [ ] User-facing messages, analytics events, screenshots, and support diagnostics do not expose sensitive data.
- [ ] Loading, empty, error, success, and permission-denied states are implemented and tested.

## 5. Bằng chứng review

The change record for UI work must include before/after screenshots or a concise recording for affected states, viewport coverage, keyboard/accessibility test evidence, and the relevant acceptance criteria from [PRD.md](PRD.md). A material design-system change requires an ADR under `adr/`.

## 6. Ngoại lệ

An exception must state the unmet rule, affected users, risk, mitigation, owner, expiry date, and follow-up task. It requires approval from the repository owner and may not weaken authentication, authorization, or sensitive-data protection.
