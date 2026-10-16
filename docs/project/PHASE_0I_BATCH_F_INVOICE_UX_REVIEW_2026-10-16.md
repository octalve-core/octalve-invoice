# Octalve Invoice Phase 0I — Batch F Review Release

**Date:** 16 October 2026
**App source SHA:** `134156955ee5bece16560a8d0346744b28457d61`
**Release PR:** https://github.com/octalve-core/octalve-invoice/pull/7
**Review merge SHA:** `318bb8ae1d89bf394903867c0ed6ff44cb11e3dd`
**Vercel Preview:** https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app
**Deployment:** `dpl_8b2kMjhwB6ZLhb4vd9R9Z7JKp5oD` READY
**Production:** Unchanged; NOT live. `main` e01c9158616f65b4e08d5b36318b8d27aef3189b.
**Development PR #2:** Draft, unmerged.

## Implemented changes
1. Finance Calculator, record details, recurring, settings, support, finance action reviews, Tax Centre and customer portal now use shorter merchant-directed disclosures. They still distinguish samples, estimates, unsent actions and no tax filings from real financial operations.
2. Invoice CREATE and EDIT share the existing four-section accordion, with keyboard-accessible aria-expanded triggers; choosing a different section closes the last unless Expand all is selected. Contents stay mounted to preserve draft input state.
3. Individual invoice item rows collapse when another is opened; Expand items allows simultaneous editing. Identifiers survive remove/add. Browser tests ensure removed sample descriptions are absent from live documents and exported PDF.
4. Draft-only milestone, installment, communication and portal-sharing proposal UI moved to CREATE/EDIT, removed from issued-invoice detail. Zero/safe-total guard prevents invalid split helper invocation. Two-way and 2–6-stage reviewed amounts use the actual merchant selection, not a constant 70/30 sentence.
5. Business logo path is unmodified and source-verified across Business Settings, shared merchant context, browser renderer and native PDF (both templates). Uploaded logo is Preview-session only and not a substitute for the distinct as-yet-unprovided Octalve dashboard logo.

## Evidence
- Node24 / frozen pnpm / TypeScript / ESLint / unit tests / production build PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38933862294
- CodeQL PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38933862532
- Full browser regression **189/189 PASS**, narrow/tablet **64/64 PASS**: https://github.com/octalve-core/octalve-invoice/actions/runs/38933856460
- Screenshot + native PDF/PNG evidence: https://github.com/octalve-core/octalve-invoice/actions/runs/38933856460/artifacts/12059109669
- Exact merge differs from qualified source only by existing historical documentation `docs/project/REVIEW_PHASE_0I_BATCH_A.md`. Vercel READY exact SHA and stable alias verified.

## Remaining frontend/owner-review items
- Owner visual screenshot comparison across all requested responsive widths, error/empty states and keyboard focus. Passing tests do not certify exact owner styling or WCAG/ASVS audit.
- Some specialised account statements, approvals, bank reconciliation, notifications, recurring issuance, credit/debit adjustments, tax review, support and customer portal remain frontend interface proposals, not connected operations.
- Pricing/Free 25-invoices policy is proposed only; do not activate billing.
- Separate distinct dashboard logo asset not supplied. Merchant logos are not stored beyond current browser Preview session.
- Final invoice-template redesign specifically postponed by the owner; preserve Sapphire-derived document engine until that next separate stage.

## Unchanged financial restrictions
Issued invoice requests are not collected cash; verified payment is the income truth source; receipts document verified payment and cannot double count; eligible bank transfer payments require manual evidence and authorization; gateway/dynamic-account Paid status requires verified provider events; customer QR, payment QR and NRS verification QR are separate. No secure backend, Neon, live auth, payments, emailed receipts, NRS fiscalization or Production launch approved by this release.

- **Post-merge exact Review checks: all PASS.** Phase qualification https://github.com/octalve-core/octalve-invoice/actions/runs/38934451095 ; CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38934451220 ; 189/189+64/64 browser https://github.com/octalve-core/octalve-invoice/actions/runs/38934451152 ; review-merge screenshot and PDF/PNG artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38934451152/artifacts/12060780726 .
