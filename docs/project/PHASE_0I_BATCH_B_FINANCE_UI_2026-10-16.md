# Octalve Invoice — Phase 0I Batch B UI Checkpoint
Date: 2026-10-16
Branch: `phase/0i-frontend-finance-workflows`
Pull request: #2 to main remains DRAFT and NOT authorized for merge.
Production/main: unchanged by Batch B. Git-connected Vercel automatic deployment suppressed on phase/**, review/phase-0i remains intentional owner-facing Preview branch.

## Scope implemented in committed source
### Mobile & desktop navigation
- `src/features/other-services/feature-links.ts` now lists the eight finance recommendations as direct working routes: Statements of Account, Approvals, Receivables Ageing, Credit & Debit Notes, Communication History, Bank Reconciliation, Audit & Exceptions, Multi-currency.
- The More icon grid uses each tile's strongly typed `icon` key and consistent Octalve colours. It no longer depends on positional icon arrays that break when services are added.
- Added direct tiles for unified Recurring income/expense, NRS-aware Tax Centre, Insights & Support and the public customer-portal design preview. Legacy More statement/recurring/tax URLs redirect to their current screens.
- Existing Dashboard, Invoices, Receipts, More, Me navigation remains untouched. Desktop existing sidebar remains the owner-preferred design.

### Eight additional finance UI workspaces
Common route: `/dashboard/finance/[slug]`; shared typed `FinanceWorkspace` with the same desktop table, mobile stacked-card layout, rounded Octalve-blue status filters, search, date/customer filter bottom sheet (desktop dialog), row detail sheet, mobile safe-area and preview-only safeguards.
1. `statement`: derives issued claims and independently verified sample allocations from existing invoice/payment fixtures; running balance for a selected customer uses complete history unaffected by search/date filter, not a sum of other tenants/customers. Receipt records never add revenue.
2. `approvals`: approval queue and states, correctly EMPTY (no authenticated approval actor or maker/checker exists).
3. `receivables`: calculates remaining invoice amounts from verified allocation; classifies due-age buckets as of the inspection date (sample records are dated 2024; not a business's real receivables).
4. `adjustments`: uses existing credit-note examples and reserves debit-note workflow; no record is issued or reduced in financial balances.
5. `communications`: zero actual delivery history; local editable message drafts, no outbox provider and no fictitious success.
6. `reconciliation`: sample verified payment source/allocations visible without claiming a bank statement was imported or cleared in production.
7. `audit`: no invented security events; empty authenticated log while preserving future actor/correlation/retention contracts.
8. `currencies`: NGN invoice samples only and explicitly zero real FX rate sources; no made-up rates.

### Other connected Phase 0I UIs delivered
- `/dashboard/recurring` plus existing recurring-expense route use one consistent tabbed recurring invoice / recurring expense preview. Search, cadence filter, desktop table, mobile cards, detail sheets, editable locally calculated schedule dates (weekly/monthly/quarterly/annual); no generated records, auto-pay mandates, scheduler tasks or saved rules.
- `/dashboard/tax-centre`: period controls, tax classification-review list, calendar/eligibility information and NRS e-invoice status (none). NO generic blanket VAT multiplication, IRN/QR fabrication, "tax paid" claims, or auto-filing.
- `/dashboard/insights-support`: Business Insights and Octalve Support two-tab screen linked from desktop/mobile message icon. Verified sample ledger metrics and traceable read-only insight questions; support FAQ search and local-not-sent message drafts, no unverified AI or fictitious live agent.
- `/dashboard/invoice/[id]`: 70/30 or custom first/remaining installment design with exact BigInt minor-unit kobo arithmetic; separate multi-stage percent-distribution helper and source tests. Email reminder/issue/update/paid-confirmation drafts, client portal/QR authenticity distinctions. No actual payment schedule written to issued invoice or email sent.
- `/dashboard/quotation/[id]`: invoice-style responsive quotation estimate layout, with no bank account, Pay Now, receipt or fiscalization QR; conversion/acceptance is not falsely reported. Quotation list view now routes to its detail.
- `/portal`: client-facing design preview with documents, payment, messages and account sections; **no customer or tenant data served**, auth/invitation/OTP required in future.
- Older `SendInvoiceModal` previously displayed fictitious "Invoice Sent!" success; changed to a delivery-selection preview and prevented the send callback while backend outbox is disabled.

## Accounting and OWASP invariants
- No actual money movement, subscriptions, account logins, banking access, NRS filings, customer QR issuance, support tickets, public document access, communications, refund, credit issuance, role approval or immutable audit event has been activated.
- Client-side guards only demonstrate design. Production requires OWASP ASVS 5.0, tenant-scoped BOLA authorization, MFA/step-up, immutable finance/security events, document versioning, idempotency, maker/checker, rate limiting, verified provider/bank reconciliation, secret storage, NRS integration authority, valid official IRN/QR and audited export.
- The 14-day display archive must never remove issued financial history.
- For multi-currency, require effective-dated signed FX snapshots and correct ISO 4217 minor-unit exponents; never use float exchange-rate arithmetic as the authoritative ledger.
- Invoice/receipt/payment financial separation must be retained through Phase 1.

## UI/QA gates
- Existing screenshot/Playwright script extended to test 8 finance routes at 3 viewports, recurring workspaces, tax centre, Insights & Support, quotation detail, installment and unsent-email drafts, and no-data customer portal. Screens use 1440x900 desktop, 768x1024 tablet and 390x844 mobile; user-reported widths 320/360/430 require further explicit golden checks.
- Unit tests cover exact 70/30 allocation, arbitrary integer N-stage allocation and rejection of invalid splits.
- Review output will be deployed via `review/phase-0i` only after the branch CI passes, preserving one batched Vercel Preview per review package.
- **Do not claim exact visual acceptance** for Sapphire-derived Modern/Classic/Receipt native PDF appearance or for the owner’s as-yet-unprovided invoice-design mockup, separate dashboard logo or Finance Calculator interface.
- Remaining high-sensitivity work: actual customer portal identity/security, complex installment schedules linked to immutably issued invoices, outbound message outbox/retry, recurring scheduler, NRS tax engine and filing, reconciled bank ingestion, durable maker/checker/audit workflows, actual foreign currency conversions, real merchant AI, persistent data. These require separate approved backend Phase 1 implementation and test cases.

## Acceptance conditions for owner
1. Desktop tables and mobile cards/layout match Octalve component language; screens are reachable from More and no page-level sideways scroll.
2. Money authority remains unchanged in Preview; explanatory text is not mistaken for an issued event.
3. Code builds, tests, CodeQL and browser/PNG/native PDF regression green on same commit.
4. One READY Vercel review URL matches actual reviewed batch SHA; explicit owner visual corrections applied before main release.
5. Phase 0I remains open until the owner explicitly approves the UI and later authorizes backend separately.
