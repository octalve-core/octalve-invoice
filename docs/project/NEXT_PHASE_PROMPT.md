# OCTALVE INVOICE — PHASE 0G VISUAL SIGN-OFF & DOCUMENT GOLDEN QUALIFICATION
Repository: https://github.com/octalve-core/octalve-invoice
Working branch: phase/00-finzefy-authority-ui-bootstrap
Draft PR: https://github.com/octalve-core/octalve-invoice/pull/1 (do not merge)
Current code checkpoint at documentation update: b7496224e9373d3ea5b5aff83458c77a0870b857
Architecture authorities: docs/project/OCTALVE_INVOICE_MASTER_IMPLEMENTATION.md, UI_REFERENCE_MAP.md, DECISIONS.md, INVOICE_RECEIPT_PAYMENT_AUTHORITY.md, NUMBERING_AND_CREDIT_AUTHORITY.md, state.json

FIRST retrieve latest GitHub HEAD, CI, Vercel preview and screenshot artifacts. Never assume stored SHA is HEAD.

Task: Verify the shared Phase 0G Invoice, Receipt, Quotation, Expenses, Credit Note, Customer, Staff and Items tables against the owner-supplied October 15 mobile/desktop image references, including:
1. Desktop table header, inset gray rows, document-specific ID columns, consistent search/status filters/export/create, icon/status colors, pagination and desktop action modal.
2. Mobile page title/back, search/filter/export row, full-width create CTA, wrap-safe chips, card alignment and tappable full card opening bottom action sheet (not navigating). Explicit View/Edit choices; Delete shown red; cancellation and overlays compact with accessible keyboard controls.
3. Overview Recent Transactions uses same card component and shows FOUR approved filter chips: All, Invoices, Expenses, Quotation. Receipts and Credit Notes can still appear in All.
4. Record numbering is [MERCHANT_INITIALS]-[SEQUENCE][CODE]; approved INV, RP, QUO, CR, EXP, SF; CUS and ITM are only provisional until confirmed.
5. Receipt ≠ invoice ≠ payment. No automatic receipt on invoice paid, no receipt on quotation acceptance; explicit optional receipt issuance from a verified payment, or from independently recorded/manual payment evidence once backend exists. Existing UI only shows honest linked/manual samples. No double counting or automatic refund.
6. Retain previously approved invoice Modern/Classic Ledger rendering, 50/50 editor/preview, merchant business identity, logo initials, responsive dashboard charts, owner branding and other Phase 0E/F behavior. Qualify actual native browser/PNG/PDF goldens separately; never claim untested output parity.
7. Run Node 24 frozen pnpm install, strict TypeScript, ESLint, tests, 25-route × 3-viewport Playwright snapshots (75 assertions, plus receipt link/independence checks), CodeQL and Vercel preview, recording exact results.
8. Fix real regressions in small feature-specific components; push coherent commits ONLY to phase branch; update DECISIONS, UI_REFERENCE_MAP and state.json with SHA, Preview URL, artifacts and PASS/BLOCKED/NOT RUN.

Constraints: no live auth, Neon, Prisma migrations, webhooks, payment operations, receipt issuance, fake ledger successes or production deployments. No force-push or merge to main. Request owner visual/PDF approval before Phase 1.

Exact next continuation request:
"Continue Phase 0G visual qualification from the latest GitHub state. Inspect and compare desktop/mobile Invoice, Receipt, Quotation, Expense, Credit Note, Customer, Staff, Items and Overview against the supplied references. Fix any genuine differences, verify browser/PNG/native PDF golden evidence, run all CI and security checks, update project-control documents and return the review-ready Vercel Preview. Do not merge main or start Phase 1 until I approve."
