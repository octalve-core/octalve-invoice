# Phase 0I Batch Y — Merchant header consistency
Date: 21 October 2026. UI-only, stacked draft Review; no Production or Phase 1 authorisation.

## Verified source diagnosis
The merchant global TopNavbar was **already a single shared component** rendered by `app/(dashboard)/layout.tsx`. It contains the route-only `Find a workspace page` search, notification and account entry points. Inconsistent top-of-page appearance came from the merchant page **heading layer**: Invoice/Receipt/Credit Note/Payment Received/Other Services/Settings/Overview and the generic `RecordDirectory` used separately authored heading markup or no description.

## Batch Y changes
- Added `components/dashboard/ui/MerchantPageHeading.tsx` with one h1, description, optional eyebrow/actions, inverse variant for the existing Settings gradient and hide-on-mobile flag to prevent duplicates with the record-directory mobile header.
- Adopted in the named primary Merchant pages: Overview, Invoice, Receipt, Quotation, Expenses, Payment Received, Credit Note, Other Services and Settings.
- `RecordDirectory` adopts the same heading for its other default-heading lists (Customers, Items, Staff); Quotation and Expenses no longer use its duplicate desktop header.
- Preserved the existing merchant TopNavbar **once** at the shared layout. The page finder offers *page navigation only*. `RecordDirectory` search, Payment Received search, and Other Services tool search retain independent component-local state and unique accessible names.
- Kept the Overview dashboard tabs, Settings gradient, mobile list back buttons, responsive bottom navigation and established merchant visual style.
- Added `tests/merchant-page-heading-consistency.test.mjs` and a browser UI evidence scenario `scripts/phase-0y-merchant-nav-evidence.cjs`, which enters through `/workspaces` and then uses visible navigation and text entry to compare headings at 390px and 1440px; it checks that global page search does not filter Expense records and local Expense search does not change the global page finder. Captures screenshots and measurements under `artifacts/phase-0y-navigation/`. The Review browser workflow is configured to run this case.

## Strict release boundary
Stacked draft PR #40 → Batch X PR #39 → Batch V/W PR #38 → Batch U PR #37 → canonical `review/phase-0i`. No merge, Production promotion, backend, authentication, financial mutation, payment provider/bank/NRS integration or branch deletion is authorised by this UX batch. A Vercel READY status demonstrates build/deployment success only. Require exact-source CI/CodeQL/browser evidence and owner visual acceptance before considering a canonical Review merge; owner separately controls Production promotion.
