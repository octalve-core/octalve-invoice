# Octalve Finance — Phase 0I Batch T: NRS Readiness & End-to-End Journey
**19 October 2026.** Review-only frontend scope. Source baseline: `7310a700382df8fd73c1b70841da0679dc137eb3`.

## Verified prior stages — do not rebuild
- Q has completed Review and owner-authorised **frontend UI-only** Production release. Due time and flexible milestones retain exact-kobo checks; real collection account response and issuance still blocked.
- R (PRs #30–32) is a technically complete Review-only merchant/client same-invoice preview, sharing selected Modern or Classic Ledger renderer, visibly watermarked DRAFT and no public customer access.
- S (PRs #33–34) is a technically complete Review-only Payment Received and late/exception sample preview, with ledger-derived verified cash, not incoming provider/live settlement.
- The latest Review contains R+S while Production remains Batch Q frontend. Owner visual comparison of R/S still pending.

## Batch T implemented code and route
- `src/features/finance/nrs-journey.ts` — typed eight-stage explanatory flow and separate authorities for merchant document numbering, NRS IRN/fiscal QR, actual bank/provider payment and tax filing. `officialNrsReadiness` can never grant issue/IRN/QR in Phase 0I.
- `src/features/finance/NrsJourneyWorkspace.tsx` — concise responsive blue-and-white NRS readiness panel + merchant/customer lifecycle + role and external validation responsibilities + published PARTIAL/PAID reference and external official links, plus existing Invoice and Payment Received navigation. No forms accept fiscal keys or create fake submissions.
- `/dashboard/tax-centre/nrs-readiness` — dedicated entry reused by existing Tax Centre NRS tab, not a duplicate taxpayer profile.
- `tests/nrs-journey-preview.test.mjs` — exact ordered stages, authority separation, false-success prohibition, canonical linking and official HTTPS references.
- `scripts/phase-0i-viewport-evidence.cjs` — seven independent Batch T in-browser journeys across 320/360/390/430/768/1024/1440, including short 650px laptop height; preserves earlier 189 core routes, 64 regular viewport, and each seven P/Q/R/S checks.

## External NRS source qualification
Official NRS developer docs v1.1 accessed October 19:
- https://einvoice.nrs.gov.ng/docs/introduction/getting-started — SI/APP onboarding, compliance, build, sandbox validation/go-live.
- https://einvoice.nrs.gov.ng/serivce-providers/introduction — SI integrates merchant accounting systems and maps schema, APP exchanges/validates invoices.
- https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema — UBL (JSON/XML), official BusinessID, IRN schema/validation; no fabricated IRNs.
- https://einvoice.nrs.gov.ng/changelog — April 2026 `PARTIAL` payment update plus `PENDING,PAID,REJECTED`; updates must originate only from confirmed and allocated payment, not chosen instalment plan or receipt.
No universal VAT assumption; invoice fiscalization/IRN, payment verification, tax filing/remittance remain **independent responsibilities**.

## Eight-stage pitch/capability mapping
1. Merchant identity, KYB and taxpayer authorisation
2. Company bank, verified gateway, dynamic-account provider or contracted bank collection
3. Invoice items/tax/date/100%-two-part-custom milestones
4. NRS applicability, structured validation/IRN/QR **when official status supports it**
5. Same issued invoice for customer, only after real issue and secure customer access
6. Signed/verified provider event for pending/partial/paid
7. Payment Received reconciliation including expiries, late transfer, unmatched, payout/refund
8. Separate audit, optional receipt without double revenue, authorised NRS payment update as appropriate
The current UI reflects previews/specifications; it is not an NRS-accredited SI, APP or banker. We make no unsupported claim that Nigeria/Africa competitors do not offer similar features.

## Acceptance
Node 24 frozen install/TS/lint/tests/build, CodeQL, 189 existing browser routes +64 viewports +7 each Batch P/Q/R/S/T, independent exact merged Review CI/Vercel READY, owner visual acceptance of landscape journey, NRS status, mobile legibility. **Pending actual evidence and release records**, not assumed.
This Batch T is strictly Review-only. No backend, NRS tokens/keys, bank or provider accounts, signed IRN/QR, payroll, tax remittance, customer communications, Production or Phase 1 authorisation.
