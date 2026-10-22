# Z01–Z05 controlled continuation — Octalve Finance
**Date:** 21 October 2026. **Current gate:** Z01 PARTIAL; Z02 NOT authorised to begin. The existing repo remains octalve-core/octalve-invoice; keep Next.js 16+, strict TS, Tailwind 4, pnpm and the established merchant/customer/admin UI split.

## Keep one meaning of truth
- UI may hold one merchant-local **preview contract** per domain; that does not constitute issued/verified/settled/fiscal data.
- Backend authoritative contract will be separately approved, including authenticated tenant membership, granular staff/customer access, immutable financial snapshots, sequential document numbering, signed payment evidence, audit and source-based monetary metrics.
- Future UI selectors must use a shared merchant catalogue; allow modal desktop / bottom-sheet mobile Add, Edit, Archive, with selected record copied as a versioned document snapshot. Never let future master-record updates rewrite issued documents.
- The merchant currency default should apply to NEW drafts; a specific document's currency must remain explicitly recorded, without retroactive conversion or implicit cross-currency aggregation.
- Legal tax classification must have one Tax Centre rule source. The 2025 Act original/edited number conflict and 2026 Gazette modifications are unresolved; use the Z01 tax research matrix and obtain tax counsel sign-off before hardcoding any category/rate.
- Delivery is separate from the invoice payment-terms step. Merchant presses Send/Share only for legally valid issued documents; preview includes PDF or signed link, recipient, item/total/balance/due, provider-verified payment channel/account/name/bank/actual expiry, eligible Pay Now and secure customer portal link. Retain delivery queue/sent/failed as distinct states. No fake real sending in Phase 0I.

## Z01 — Audit and qualify (CURRENT)
1. Confirm actual main/review/stacked U–Y.1 branches, PR bases, exact CI/CodeQL, Vercel and historic screenshot source.
2. Inspect client journey via a SINGLE real browser session from Workspace Selection, covering merchant/document/customer/admin routes and actions, responsive widths and accessibility. Do not claim passed on script presence alone.
3. Correct only genuine defects with exact evidence; Z01 verified a wrong display example (OL-00001-INV versus OL-00001INV) in the NRS journey and adds a number contract test.
4. Record current vs proposed domain authority for currency, tax, catalogues, customers, item price snapshots, payment methods/stages, invoice/receipt/quote, rendering, delivery and role grants.
5. Bring exact final SHA through frozen-pnpm/Node24/type/lint/test/build, CodeQL, browser/screenshots, then owner visual acceptance. No automatic advance.

## Z02 — Approved integrated frontend source-of-truth refactor (AFTER Z01 ACCEPTANCE)
- Audit-approved shared typed domain contract and selectors first; avoid rebuilding invoice design or introducing a second merchant store.
- Single merchant default currency policy + document-specific currency snapshot, no silent FX.
- Shared Customers and Items/Services selectors (search, Add, Edit, Archive) reusable in invoice/quotation/customer directory and catalogue; preserve invoice overrides without rewriting master records.
- Tax Centre versioned rule selection; item/category effective-date classification with validated user choices and 'needs review'; one line-level exact calculation for invoices, quotations and Tax Centre preview. No live tax claim and no NRS API.
- Put custom milestone data in draft, with exact minor-unit sums and per-stage time/expiry evidence guard; preserve Q/P/R/S/T logic.
- Regression: add once/use anywhere, override isolation, delete/archive, legal classification unknown, mixed basket/discount, currency, 2–6 staged payments, responsive UI.

## Z03 — Document life cycles and delivery UX (AFTER Z02 ACCEPTANCE)
- Distinguish DRAFT/APPROVAL_PENDING/FISCAL_PENDING/ISSUED in issuance; and delivery, payment, refund as separate status axes.
- Issued canonical snapshot immutable; lawful correction requires linked credit/debit/void/reissue and NRS adjustment as applicable. Issue action remains DISABLED in Phase 0I UI demo.
- Invoice post-issuance Send/Share screen: same frozen renderer/PDF attachment or safe link, recipient, delivery method, amount/outstanding, due, bank/dynamic expiry and Pay Now only if actually eligible; preview only until Phase 1.
- Quotation internal approval, customer accept/decline/expiry, conversion to NEW invoice draft; no payment/account created by quotation.
- Receipts require verified-source payment, optional generation after verified provider events and separate send; receipt adds zero cash.
- Golden renderer parity modern/ledger, long docs, merchant/customer/PDF and delivery templates.

## Z04 — Three-experience UX and authorization specification (AFTER Z03 ACCEPTANCE)
- Shared identity with separate MerchantMembership, explicit CustomerAccessGrant and OctalvePlatformStaffMembership; no role inferred from matching email or public route.
- Finish responsive 320–1440 merchant/customer/admin document and support journeys, role-specific navigation, independent record access, record edits only on standalone pages as approved.
- Detailed deny-by-default test matrix: cross-org invoice guessing, role switching, expired invitation, support case scoping, worker MFA, audit trails, sensitive financial actions and customer data minimization.
- UI-only demonstration; no fake protected operational login.

## Z05 — Architecture owner decision gate (AFTER Z04 ACCEPTANCE)
- Versioned schema for identity/tenants/customer access, company bank verification, invoice drafts and immutable issued snapshots, typed tax rules, payment and collection-intent authority, receipts/credits/refunds, NRS lifecycle, notifications, subscriptions and operations.
- Review legal issues: applicable tax statute/order, NRS taxpayer and SI/APP integration, accounting policy/revenue basis, FX source, mixed collection channels, credit notes and refund windows, payment expiry and handling of late transfers.
- Architecture for secret vault/KMS, server event inbox/outbox, idempotent webhooks, signed notifications, restore/backups, NDPA retention, audit, admin role and incident response.
- Produce dependency-based Phase1 batches and security/financial/operational acceptance matrix. Seek fresh written scope and release permission. Do NOT activate backend or promote Production as part of Z05.

## Release invariants for every batch
Preserve official Octalve brand, #0064E0 blue, #000A16 sidebar, fixed desktop header, responsive mobile footer, existing approved numbering [initials]-[00001][suffix], invoice as receivable vs verified money and receipt as no extra cash, false-provider/NRS prevention, exact per-stage expiry and immutable issued content. Run tests against exact final SHA, not parent. Review/QA promotion and Production are distinct owner decisions. Never delete branches without live ancestry, open PR and permissions checks.
