# Phase 0I Batch R — same-record customer vs merchant invoice Preview
17 October 2026 · repo `octalve-core/octalve-invoice` · baseline `32d51b3ba0e238f0ffe29e7202cc242047242059`. **Review-only UI candidate; no Phase 1 or Production authorisation for this batch.**

## Owner visual specification
Previously provided landscape example shows two aligned audiences: merchant on the right/left with Send Reminder, Revalidate, Record Payment (manual-only by authority) and Copy Link; customer with Download, Print Invoice and Pay Now / Check Payment. The example 70/30 is illustrative, not a new payment rule. Account data, RC/TIN, QR, issuer/customer text and dates in the graphic are not canonical values. Octalve blue replaces donor green. No screenshot account number, logo, fiscal QR or NRS IRN may be invented.

## Source changes
- `src/features/invoices/lib/audience-preview.ts`: one deterministic public-fixture converter to a shared `InvoiceDraft`, merchant-owned reference, matching fixture amount/date/customer; `formatDocumentNumber` preserves owner series. **Not** an issuance snapshot.
- `src/features/invoices/components/InvoiceAudienceToolbar.tsx`: responsive two-audience action bar and non-operational collection/NRS disclosures. Client Download, Print, Report Transfer/Check Payment/Pay Now disabled. Merchant Send Reminder, Revalidate, Copy Client Link disabled. No simulated success, key storage, clipboard actions, print or network requests.
- Existing invoice detail `/dashboard/invoice/[id]` uses the shared converter and displays merchant controls, while keeping record navigation, existing manual bank vs provider-verification authority and the current editor.
- New route `/dashboard/invoice/[id]/client-preview` renders the same existing `InvoiceDocumentPreviewSection` (Modern/Classic Ledger) using current merchant identity and existing bank-verification gate, inside the merchant workspace. **Not a public share link or issued document.** Original cross-renderer DRAFT watermark, locked export/PDF and logo fallback unchanged.
- `tests/invoice-audience-preview.test.mjs` + seven independent audience parity/browser routes at 320/360/390/430/768/1024/1440 with short desktop height. Compare reference and displayed amount from same renderer, disallow premature buttons and horizontal overflow, take merchant/client screenshots for owner visual acceptance.

## Evidence and outstanding
Source Build/TypeScript/ESLint/tests/CodeQL passed on initial candidate `c05615afd0c015fb7f63127e1cefe555fb31a78d`; responsive run and later exact merged-commit qualification must be verified separately. No promises of pixel-perfect reference parity before owner screenshots reviewed. Generated dummy 2024 amounts/statuses remain labelled Preview and not proof of actual money.
Operational issued invoice stored server snapshot, NRS authority, verified dynamic account, returned expiry, signed URL, actual payment/receipt links, print/PDF after official issuance, customer communications, and independent manual bank clearance are all **BLOCKED until Phase 1 with new approval**.
Batch S handles Payment Received status/late transfer, Batch T NRS; do not conflate this template preview with account expiry or revenue truth.
