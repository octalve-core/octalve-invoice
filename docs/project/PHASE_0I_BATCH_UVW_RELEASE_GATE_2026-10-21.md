# Phase 0I — Batch U / V / W and identity design, Review only
Date: 21 October 2026

## Owner request and existing state
Batch U: simplify the merchant invoice authoring workflow, four separate step URLs and a fifth dedicated document view. One diagonally placed draft watermark, clear current-step highlight, reduced production-facing UI copy. Existing merchant page and payment authority unchanged.
Batch V: separate customer dashboard UI, with `/customer`, invoice list/detail, payments, receipts, merchants, messages, notifications and account settings. Sample records only; customer access not issued.
Batch W: separate Octalve operations console under `/admin`, merchant/customer assistance, subscriptions, verifications, support, notices, product updates, internal staff, security and audit. Sample/demonstration only; no staff sign-in or administrative mutation.
Design: `THREE_EXPERIENCES_IDENTITY_AND_AUTHORITY_2026-10-21.md`, one principal shared across explicit grants, never email-based cross-tenant access.

## Release gates
- Batch U PR #37 is draft targeting `review/phase-0i`. Vercel QA build `fa6a54abcf1e372d010e8943a60d632a2bb16586` was READY, but owner visual acceptance and full exact-source CI/CodeQL/browser verification are separate and required.
- V/W remains in an isolated stacked branch built on U source. Never merge an unaccepted U implicitly. Technical checks (frozen install, TS, ESLint, tests, Next build, CodeQL, browser routes plus 320/360/390/430/768/1024/1440 widths) and the owner visual checks must pass before merging.
- Preview READY is not Proof of auth or operational readiness; no credential collection, invoice issuance, notifications sent, payment verification or staff access.
- Preserve `main` and Production. No release promotion or Phase 1 until owner's separate explicit authorisation. No cleanup of branches without ancestry, PR and permission checks.
