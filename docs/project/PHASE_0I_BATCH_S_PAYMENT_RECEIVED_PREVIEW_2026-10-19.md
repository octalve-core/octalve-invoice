# OCTALVE FINANCE — Phase 0I Batch S Payment Received and Reconciliation Preview
**19 October 2026. Source candidate:** `693ec2acfd486359410334e04ad5f46f8609cdea`, branch `phase/0i-batch-s-payment-received-preview`. Exact Review base `1f2b721a09322b9f042b189b6795aee41d7910c7`.

## Source and visual changes
- The EXISTING `/dashboard/payment-received` route now displays a concise blue-and-white activity workspace, six segmented lifecycle filters, provider/customer/reference search, and mobile stacked example activities; reuses existing dark sidebar, mobile navigation and finance colour system. No change to other financial routes or invoice templates.
- `src/features/payments/activity-preview.ts`: typed collection intents (active/expired), attempts (initiated/pending), source-linked verified collections (from existing `paymentPreview`), awaiting/provider settled examples, late/unmatched/manual-review/overpaid/reversed exception examples, refund pending/refunded examples. Example-only names and references labelled; activity filters do not imply authenticated provider data.
- `PaymentReceivedWorkspace.tsx`: summary cards use ONLY the existing `financeProjection` of verified ledger events; separate collection vs provider payout and fee-like example, no duplicate revenue. Search/provider filtering and read-only accessible dialog with Escape/focus restoration, no fake state mutations.
- Test module `tests/payment-activity-preview.test.mjs`: phase/status validity, unique event identifiers, exact amount, cross-provider filters, ledger money conservation and denial of confirmed cash from intents/payout/refunds. Seven additional responsive/browser workflows at 320/360/390/430/768/1024/1440 and short-height desktop; original 189 routes +64+7P+7Q+7R remain.

## Hard safety boundary
This is NOT live Payment Received, reconciliation, a provider-verified API, signed webhook, bank enquiry, settlement tracking, refunds, NRS, account regeneration or customer self-service. A payment evidence screenshot cannot mark an invoice paid; late transfer must be independently traced and reversed/accepted. A new invoice-specific collection intent may be issued on the SAME invoice only through the separately authorised backend. No server credentials/money actions were added.

## Acceptance gate
- Node 24 frozen pnpm, TypeScript, ESLint, unit, Next build; CodeQL; 189 existing browser checks; 64 standard viewports, 7 P, 7 Q, 7 R and new 7 S; exact merged Review CI/Vercel READY. Screenshot parity requires owner review.
- No current owner permission for Phase 1, main or Production deployment of Batch S. Next Batch T NRS validation/readiness UI after owner approval.
