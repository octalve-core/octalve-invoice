# OCTALVE INVOICE — MASTER IMPLEMENTATION AUTHORITY
Date: 2026-10-15. Authority: current user instructions and submitted Finzefy desktop/mobile UI references.
## Product
Octalve Invoice is a merchant-facing continuation and completion of Finzefy, not a fresh product inspired by Finzefy. Merchant self-signup, email verification, skippable onboarding, company information, primary currency, dashboard, invoices, receipts, customers, items, tax and payment configuration. Appearance of source screenshots is authoritative; change Finzefy identity to supplied Octalve Invoice logo/icon and primary green to Octalve blue, while retaining semantic success green. No arbitrary UI redesign.
## Source precedence
1. Latest user instruction; 2. current verified Octalve Invoice implementation; 3. this authority and project state; 4. user-provided screenshots and exact Octalve brand assets; 5. approved Sapphire invoice output/golden regression for document renderer; 6. official provider, NRS, OWASP and NDPC materials; 7. source Finzefy code and historical docs as technical references.
## Pinned donors
Finzefy Next.js frontend main 4660eda71248266f5b97b52638f6d26429370621 — primary UI donor.
Finzefy Express master 212f3e1f10e4ebf553e0462d213d693202aaff48 — conceptual API/data reference only; insecure/unresolved patterns must not be copied.
Finzefy Flutter main 8447e8f67f19dbe7a8ff0eca93e0d28d62fd14d7 — responsive/mobile UX authority.
Sapphire Quest dfd2657fc22f56c4b82808ca4072ad0300cb753c — modern Octalve invoice and Classic Ledger rendering authority, optionally Classic Receipt for payment receipt.
## Onboarding
Mobile and desktop share the same form logic; desktop uses equivalent content in available white-space/panel area instead of dropping mobile-only fields. Signup -> verify email -> optional business profile -> optional primary currency -> dashboard. Skipped fields remain visibly incomplete in Getting Started and can be edited later. Save must persist; data rehydrates on revisit. Default currency requires documented initial behaviour and later editability per latest merchant decision; changing currency must not retroactively mutate issued invoices.
## Getting Started
Setup Online Payment; Customize Invoice Template; Add Business Information; Set Up App Lock. Completion derived from saved validated records, not button clicks. App lock is a convenience layer, not server auth.
## Documents
One structured Finzefy form and shared exact-money presentation model. Template 1 exact approved Sapphire Octalve modern output; Template 2 Sapphire Classic Ledger. Live browser preview and native selectable PDF must agree; retain orientation/header/signature golden evidence. Draft mutable; issued invoices immutable snapshots, final PDF and SHA-256; payment transactions are separate linked records. Receipt issued on confirmed payment; no fabricated QR or transaction status.
## Payments
Merchant can use verified ordinary saved bank account (manual reconciliation), provider-created invoice-specific dynamic account, or provider payment link. The last two can auto-reconcile only upon verified provider signals. Merchant funds must settle under their own merchant/provider arrangement, not into Octalve custody. Monnify first candidate, then Flutterwave/Paystack, contingent on official current docs and merchant eligibility. Explicit expiry/refresh/payment-instructions rules; historical issued PDFs never silently change. Partial, duplicate, reversals and refunds must be accounted for.
## Tax and NRS
Tax UI preserves submitted references but tax codes/rates are server-governed; official NRS UBL/resources/IRN workflow and fiscal reporting are distinct from monetary tax remittance.
## Phase order
0A authority and screenshot/source audit; 0B clean UI bootstrap + real Vercel Preview; 1 visual source migration and section components; 2 working two-template live rendering and golden tests; 3 merchant auth, Prisma+Neon, OpenAPI, authorization; 4 persistent profiles, customers, invoice/receipt lifecycle; 5 provider payments; 6 NRS; 7 remaining workflows/hardening and production qualification.
## Hard rules
No force push. No default passwords or secrets in source. No money movement until verified production controls. No mock data passed off as real. Do not merge before CI and visual acceptance. Previous 2026-10-14 no-signup product decision is explicitly superseded.

## Owner-approved Phase 0G record/list architecture
Canonical implementation boundary: `src/features/records/preview-records.ts`, `src/features/records/components/*`. All desktop/table/mobile record lists consume a shared definition and fixture while preserving kind-specific columns, statuses, filters, icons and actions. Mobile tap enters bottom sheet, desktop row enters view. No server-side financial mutation in the UI baseline. Invoice→Payment→Receipt relationship follows `docs/project/INVOICE_RECEIPT_PAYMENT_AUTHORITY.md`: receipt issuance is explicitly optional and independent; do not manufacture payments or create receipts automatically.

## Latest superseding owner corrections / Phase 0H (October 15, 2026)
This historical master is supplemented by [the new-chat handoff](./OCTALVE_INVOICE_NEW_CHAT_HANDOFF_2026-10-15.md), [Phase 0H implementation review](./PAYMENT_AND_RECEIPT_PHASE0H.md), [invoice/payment/receipt authority](./INVOICE_RECEIPT_PAYMENT_AUTHORITY.md) and [DECISIONS.md](./DECISIONS.md) entries D050–D057. Newer owner authority prevails. Especially: merchant signup (not older Octalve-only provisioning); payment is source of cash collections; receipts are optional and can be generated after verified gateway/virtual-account payment only if merchant opts in, including an opt-in email mode; manual bank transfer evidence is separate from provider verification. Phase 0 remains OPEN despite CI passing: owner UI approval, item-tax/NRS design, and complete native PDF/PNG golden parity are outstanding. No Phase 1, Neon, main merge or live financial operations until explicit user permission.
