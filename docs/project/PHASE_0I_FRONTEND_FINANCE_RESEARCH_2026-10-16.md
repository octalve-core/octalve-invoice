# OCTALVE INVOICE — Phase 0I Pre-Backend UI and Workflow Authority
**Research date:** 2026-10-16  
**Baseline:** `main` frontend release commit `e01c9158616f65b4e08d5b36318b8d27aef3189b`; implementation branch `phase/0i-frontend-finance-workflows`.  
**Decision:** A new, explicitly owner-authorized UI design and workflow stage. Do **not** provision Neon, enable live authentication, payment providers, NRS submission, real emails or external AI data access until the owner accepts the frontend specification and backend rollout.

## 0. Authority / goals / scope
Preserve Next.js 16 App Router, TypeScript, Tailwind, pnpm, future Prisma/PostgreSQL integration, OWASP ASVS 5.0-based security verification, existing Finzefy-derived app component structure, Octalve styling and Sapphire source-provenance. Sapphire is a donor renderer reference and fallback, **not** a reason to permanently freeze our own final invoice appearance. Changes in existing issued documents must be immutable; visual renderer versions distinct from invoice records.

Owner will provide two design references: the precise final invoice template/appearance, and Finance Calculator UI. Owner will also provide a distinct dashboard logo. Do not invent those assets or approve final template geometry in their absence.

**Top priority:** consistent mobile and desktop UI, one code path for business logic, responsive interactions and document-output parity; backend event/payment authority retained.

## 1. Confirmed current source gaps (at baseline)
- `app/(auth)/layout.tsx`, `login/page.tsx` and `signup/page.tsx` use separate `smallScreen` and `largeScreen` markup. The form logic and validations must converge into reusable components; existing submit handlers expressly do not send credentials.
- `app/(auth)/components/AuthHeader.tsx` originally displayed only a back arrow on mobile. Phase 0I adds the current onboarding wordmark to mobile login/signup. Dedicated dashboard logo asset has not been supplied and must not be fabricated.
- `app/(dashboard)/dashboard/report/page.tsx` uses Recharts `ResponsiveContainer` (potentially zero measured width) and a desktop 400px-minimum top customer table in an `overflow-x-auto` container. Phase 0I gives mobile a visible SVG chart and responsive card list; retained desktop charts/table.
- `app/(dashboard)/dashboard/recurring-expense/page.tsx` wraps the older `RecurringExpenseTable`. Recurring invoice and consolidated recurring income/expense experience are not yet built to shared RecordDirectory/filter/action standards.
- `app/(dashboard)/dashboard/taxes/page.tsx` is a tax-rate maintenance UI with hardcoded sample taxes (including unsupported generic rates). It is **not** a verified tax-liability or NRS e-invoice dashboard.
- `src/features/notifications/NotificationCenter.tsx` uses static informational notices; the new message/insight center must remain grounded in verified workspace data rather than a fabricated 'AI' feed.
- `components/dashboard/modals/SendInvoiceModal.tsx` has a local 'success' screen. Do not claim sent/delivered before a real authorized mail outbox provider result.

## 2. Visual systems and screen contracts

### 2A. Onboarding / sign-in / sign-up / verification
- One responsive `AuthShell`: mobile stacked top brand + trusted identity message + form; desktop 2-column shell with **the identical reusable form** on one side and current approved illustration/marketing-image presentation on the other; tablet collapses predictably.
- Existing official Octalve wordmark is auth/onboarding-only as owner currently requests. Dashboard gets a separate owner-supplied mark (not generated or guessed). Use dedicated `AuthBrand` and `WorkspaceBrand` component slots; do not rename existing asset until replacements have been reviewed.
- Screens: onboarding, login, sign-up, email verify/pending, OTP, reset, business identity, currency, completion, wrong-link and expired/invitation states.
- Form fields: visible labels, autocomplete, error summary, 44px touch targets, mobile keyboard hints, keyboard-only navigation, reduced motion, password strength rules set by backend security policy. No duplicate form variants with divergent validation. No fake submitted state.
- Browser viewport tests: 320/360/390/430/768/1024/1440; screenshots; keyboard focus; accessible landmark names; no horizontal overflow.

### 2B. Document design engine (Sapphire references -> Octalve final renderer)
- Keep immutable `DocumentSnapshot` as factual structured values: document id/type, tenant, issue/due dates, parties, issued line snapshot, applicable tax records, currency, payment terms, fiscal state, reference IDs, signature/branding versions.
- Define `DocumentTemplateVersion` separate from snapshot: approved template id, geometry, font family/embeddable fonts, palette, logo layout, spacings, conditional footer, localized date/numeric formats, QR placement, A4/A5 etc.
- Create Octalve `DocumentDesignTokens` and `DocumentLayoutSections`: identity header, party blocks, metadata, items, subtotal/tax, totals, payment terms, QR/authenticity, notes, legal footer. Both invoice and quotation use shared blocks with type-safe conditional differences.
- One JSON-renderable presentation model feeds browser HTML, downloadable PNG and native PDF, with explicit compatibility/version semantics. Avoid ad hoc style props that only affect the browser.
- Distinguish (1) official NRS QR verifying fiscalized invoice, (2) Octalve secure portal QR, (3) provider payment QR. A portal URL QR is not evidence of fiscalization or payment. Never mint a fake official IRN/QR.
- Golden parity acceptance: reference image comparison desktop/mobile, PNG exported and PDF first/all pages rasterized, overflow/pagination, font embedding/licensing, page-specific legal footer and A5 receipt signature. Missing owner invoice design = no final golden claim.

### 2C. Invoice detail + communication workspace
Shared invoice detail layout with tabs `Overview | Activity | Payments | Documents` (mobile compact tab strip) and contextual action menu. Actions on draft/sent/part-paid/paid states:
- Download PDF/PNG (issued snapshot vs clearly labelled preview).
- Copy secure share link / QR (recipient scoped, expires and can be revoked), send initial email, resend existing email, due/overdue reminder, friendly account-statement update, payment receipt email only on verified payment.
- Sender/from/reply-to, recipient, language, subject/body variables, attachments, preview before sending, consent/preference, reminder schedule with quiet hours, retry/cancel/status and delivery log. Billing/payment request cannot be sent as if `PAID` until verified.
- Communications are `OutboundMessage` records with `status=queued|sent|delivered|bounced|failed|cancelled`, delivery provider reference, idempotency and privacy filters. Browser-only mock must NOT show fake sent/delivered.
- Safety: suppress reminders when invoice settled/cancelled/disputed or a pending verified provider event is still reconciling; avoid duplicate sends across retries.

### 2D. Part payment / milestones
- Invoice contains one original legal face value (issued snapshot), optionally negotiated `PaymentSchedule` with stages `id, order, percent/amount, scheduledDueDate, graceDays, state`. Example: 70% deposit / 30% completion; arbitrary valid N-stage allocations allowed.
- Enforce `sum(stage amounts) === invoice payable` exactly in minor currency units; percentages do not become money until deterministic banker's/approved rounding rule and final residual allocation. Cannot create negative balances.
- `PaymentAttempt` separate from independently verified `Payment`; `PaymentAllocation` links to invoice and optionally schedule stage. Payment receipt references actual verified allocation. Refund/credit notes adjust balances without changing historical payment existence.
- Stage state can be `not due|due|partial|satisfied|overdue`. Invoice overall can be `issued|partial|paid|overdue|void`; due vs payment vs fiscal status are separate dimensions.
- Company-bank-transfer manual approval only for eligible direct transfer, with evidence, bank checking, required role, audit and anti-duplicate checks; gateway/virtual account must only move after provider verification and reconciliation. **Never** enable manual paid for gateway/dynamic account invoices.
- NRS official April 2026 update supports `PARTIAL`; map only after compliant workflow and receipt of actual payment. See authoritative API changelog.

### 2E. Customer portal
Two access modes: (A) short-lived, scoped invoice/quote link for limited view and document download; (B) verified customer identity account for all of that specific business customer's allowed historical documents and statement.
- Routes e.g. `/p/invoices/[opaque-token]`, `/p/quotes/[opaque-token]`, and `/portal` with explicit tenant/customer scoping.
- Document inbox; invoice detail/status/schedule; quotation accept/reject and comments; secure downloads; verified historical receipts/credit notes; statement; communication; optional online payment when provider live; notification preferences, account settings.
- Per-contact invitations, email OTP verification, MFA option for sensitive portal functions; never infer customer access merely from a client ID in the URL. Tokens stored hashed, short TTL, independently revocable, no PII in URL/referrer, no public indexing.
- Reject repeated payment attempts while provider status pending; no card data stored in Octalve; store only authorized provider tokens where permitted.

### 2F. Quotation / estimate
- Reuse `DocumentDetailShell` for quotations with `documentType="quotation"`, tabs/action sheet and business/recipient/line items. Explicit `ESTIMATE / QUOTATION` header, expiry, terms, acceptance and optional signature.
- NEVER show bank account, Pay Now, paid stamp, payment schedule demands, receipt controls or an NRS invoice fiscalization QR on the quotation.
- `QuoteAccepted` triggers an **authorized conversion intent**, not mutation of an immutable issued invoice. Preserve quotation number, ID, version, approval and amount source link; create *new* invoice draft requiring owner review, tax recomputation/version selection, fiscalization once required.

### 2G. Recurring income and expenses
- Unified workspace under `Recurring` with `Invoices (income)` and `Expenses` tabs; shared list/filter/search/pagination/status cards; consistent mobile card and responsive desktop table; same bottom-sheet/desktop dialog, empty/loading/error states.
- Form schema: customer/vendor, source item snapshot, template/tax rules, currency, cadence `weekly|monthly|quarterly|annual|custom`, timezone `Africa/Lagos` by default, start/end or count, next date, catch-up policy, draft-first/approval vs auto-issue if permitted, payment terms/reminders, pause/resume, preview next N runs.
- `RecurringRule` != `GeneratedInvoice` != `Payment`. Scheduler: UTC execution, timezone-aware local dates, unique `(ruleId,occurrenceDate)` idempotency, atomic event state, retries/backoff, immutable generated instances, audit + manual catch-up. No money is collected merely because a recurrence fired.
- Recurring expenses reflect actual incurred/payable obligations separately from payment proofs; no income counted until verifiable payment. Auto-charge only by express future consent and provider mandate.

### 2H. Tax Centre and NRS reporting
Create distinct `/dashboard/tax-centre` screens using same dashboard width and mobile cards:
1. Overview: **estimated output VAT**, **eligible input VAT**, net estimate (not filed), invoices requiring tax-classification review, WHT/stamp duties where relevant, calendar of filing tasks, NRS submission status.
2. Invoice tax details: each line/category `STANDARD_VAT`, `ZERO_VAT`, `EXEMPTED`, `Withholding_Tax`, `Stamp_Duty` etc. Values/versions **must come from official NRS resource API and updated legislation**, not a single generic “tax %” field. Distinguish invoice tax assessment, payment collection, tax remittance and creditable input tax; do not equate them.
3. Period obligations: taxable supplies and adjustments, input eligibility, withholding credit, estimated payable/credit, exceptions, tax period, filing due date based on relevant legislation and taxpayer eligibility. Standard VAT return may be due on/before the 21st of the following month for taxable persons, with exceptions; do not auto-apply that deadline to every business/tax category.
4. Compliance ledger: `draft|ready|submitted|validated|signed|confirmed|rejected|cancelled`, IRN, CSID, official verification QR, NRS status payloads, retry/outbox, error classification, document revision, immutable audit.
5. Return packs/export with immutable generated period snapshot and NRS acceptance acknowledgment; no “tax filed” label until an authoritative filing submission acknowledgment is verified.
- Taxable invoice issue date / tax point, actual verified payment date, and due date are separate. Show “estimated liability, requires accountant review” on preview-only or missing classification.
- Two QR types specifically guarded; user must never think an ordinary portal QR is an official NRS validation code.
- Compliance adapter patterns are **not** claims of NRS SI/APP accreditation. Integrate through a qualified provider/partner when approved; official creds in server-side vault, never browser/client bundles.
- NRS IRN format uses compliant internal invoice number + taxpayer Service ID + YYYYMMDD issue date; NRS “Tax ID” guidance has evolved in 2026 and requires dynamic eligibility/identifier mapping.
- Legal effective dates, threshold exemptions, tax rates and filing calendar require fresh NRS/legal review before live use. Distinguish NRS reporting from direct actual remittance.

### 2I. Finance Calculator (owner-supplied UI pending)
Do not invent final layout. Architect an isolated `src/features/finance-calculator` domain with pure deterministic minor-unit math, input validation, test fixtures and `CalculationEvidence`.
Potential calculators: inclusive/exclusive VAT, multi-tax line total, item-level discounts, partial-payment schedule and allocation, invoice net due, receivables aging, cashflow forecast, financing/markup margin. Do not conflate calculator's *simulation* with saved obligation or taxable event.
Any future statutory calculation must use effective-dated verified tax configurations and accountant review, not a general LLM result.

### 2J. Business Insights & Octalve Support (message beside notifications)
Header entry `Insights & Support`, two views via segmented tabs:
- `Business Insights`: deterministic daily/weekly/monthly merchant summary (verified collections, overdue receivables, invoice conversion, quotations awaiting acceptance, recurring events, send failures, NRS exceptions, service status) with timeframe, data-as-of timestamp, source link and ability to drill down. “No verified data” rather than fabricated figures.
- Assistant asks questions over tenant-scoped read-only metrics and can draft follow-up messages or reports; it may **not** alter invoices, mark paid, email a customer, post a tax return or issue refunds autonomously. Require an explicit user review and separate permission-checked action gateway for any proposed execution later.
- `Customer Support`: articles, searchable FAQs, open ticket, threaded messaging, attachments subject to malware/privacy scanning, reply history, support SLAs/status, read/unread states, agent escalation. The company support agent is distinct from merchant's customer conversation.
- **AI product trust:** synthetic “training data” cannot be represented as merchant-specific facts. Authoritative source = backend event/ledger projection, retrieval uses tenant scope and time window; LLM generates narrative only. Ground every insight in links/metric calculations. Keep provider data retention and model-training choices explicit; merchant financial data not shared for training by default.
- Defend against prompt injection from messages/attachments, cross-tenant data leakage, unbounded costs, PII exposure, unauthorized tool calls and incorrect recommendations; rate-limit, sanitize, audit, mask and impose budget/circuit breakers.

## 3. Security and operational controls (OWASP, not “OSWAP”)
Use **OWASP ASVS 5.0**, Top 10 and API Security guidance plus NDPA/NRS requirements as security validation baseline. Explicit checklist:
- Server-side organization and resource RBAC/ABAC + least privilege for each UI action (deny by default, customer vs staff principal isolation); no tenant ID trust from browser.
- Phishing-resistant MFA for owner/admin where available, secure sessions, CSRF/Origin protections, recovery hardening, login throttling, expiry/revocation, password hashing.
- Structured schema validation for every state transition; avoid client-calculated financial authority; database integer/decimal amounts, currency bounds, idempotency keys and transactional uniqueness.
- Immutable security, finance and fiscal audit events: actor, UTC timestamp, tenant, object, version, correlation id, before/after references, no raw secrets/PII. Financial archive and refunds never erase original history.
- Outbox/inbox message processing with provider signature and replay verification, HTTPS, webhook timestamp, poison-queue handling, retries, dead letter, reconciled provider state.
- Secure customer portal links, abuse detection, rate limits and CSP/SRI where relevant, allowed attachment types, scanning, signed short-lived URLs and export auditing.
- NRS API keys/secret keys server-side only; key rotation, network least privilege, verified partner status, API schema updates and effective-dated tax rules.
- Automated testing: unit (money, rounding, tax/partial); model-based state transitions; permissions/BOLA; provider replay; mail deliverability; QR provenance; PDF snapshot parity; mobile 320-430; accessibility WCAG; CodeQL, dependency updates, secret scanning.

## 4. Order of work / handoffs
**0I-A — Today / no external designs needed:** fix mobile report chart/table, add mobile auth wordmark, audit auth desktop/mobile variants, normalize recurring table/filters, document requirements and security invariants; GitHub branch only, not main or Production.
**0I-B — After owner visuals:** finish brand slots/new dashboard logo, chosen invoice design, finance calculator; complete HTML/PNG/native PDF golden parity, no fake NRS QR or customer payments.
**0I-C — Workflow UI:** quotation shared detail, installment builder, invoice communication modal+history, QR distinction, recurring invoice rule editor, portal landing/documents, Tax Centre, Insights & Support tabs. Screen uses seeded deterministic fixture and preview-only banners. Full desktop/tablet/mobile keyboard testing.
**0I-D — Owner review and UI contract freeze:** sign off screenshots, states, keyboard, documents, tax formulas/eligibility labels, auth form consistency and security data/action contracts; establish CI golden baselines.
**Backend Phase 1 (separate approval):** tenant identity/roles/ownership, DB schema and migrations, messaging outbox, document snapshot store, fiscal adapter, provider reconciliation, customer portal auth, verified analytics, job scheduling, observability. Never pre-enable financial movement.

## 5. Acceptance matrix
- Mobile report: chart visible at 320/360/390/430 and 768, no horizontal scrolling; customer cards readable and no 400px minimum table.
- Auth: brand visible on mobile login/signup; identical fields/errors/validation on desktop and mobile; marketing artwork retained desktop; no false sign-in success.
- Invoice/quote: same item/party calculations and style version, no account details in quote, image/PDF parity, no payment/manual-paid bypass.
- Part payment: exact 70/30 and arbitrary N-stage sum, over/underpayment, discount/tax allocation, retries, refunds, correct receipt count.
- Portal: anonymous scoped link cannot see neighboring customer/tenant documents; expired/revoked links fail closed; emails and QR display only authorized document.
- Recurrence: DST/timezone, month-end/leap cases, pause/cancel, duplicate job replay and manual catch-up all invariant-preserving.
- Tax: source classification, input VAT eligibility, effective date, reversals, NRS failure and duplicate event, “pending vs paid” independent from tax payable, no false submitted/paid labels.
- AI/support: no hallucinated tenant facts, source timestamps and URLs, zero model-authoritative accounting operations, support escalation evidence and privacy controls.
- Every route: same Octalve card/list/table/modals, responsive action sheet, contrast/keyboard/aria, lazy and error states, PNG/PDF where relevant.
- **Owner must explicitly approve Phase 0I** before backend work.

## Sources checked 2026-10-16
- NRS e-invoice official docs: https://einvoice.nrs.gov.ng/ , https://einvoice.nrs.gov.ng/changelog , https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn , https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema , https://einvoice.nrs.gov.ng/docs/access-point-providers/validate/tax-total , https://einvoice.nrs.gov.ng/key-definitions .
- NRS/Nigeria tax legislative context: https://finance.gov.ng/ministry/federal-government-issues-transition-guidelines-for-tax-acts-2025/ ; Nigeria Tax Administration Act 2025 on official NRS website; accountant/legal validation required.
- Heirs Technologies SI profile (no UI copied): https://heirstechnologies.com/heirs-technologies-accredited-by-nrs-to-support-nigerian-businesses-on-e-invoicing-compliance/
- Zoho Nigeria portal, invoice and reminders: https://www.zoho.com/en-ng/invoice/ , https://www.zoho.com/en-ng/books/accounting-software/customer-portal/ , https://www.zoho.com/en-ng/billing/help/settings/customer-portal/customer-portal-preferences.html , https://help.zoho.com/portal/en/kb/zoho-invoice/power-dialer/articles/how-do-i-send-reminders-for-overdue-invoices .
- OWASP ASVS: https://github.com/OWASP/ASVS/blob/master/5.0/en/0x17-V8-Authorization.md , https://github.com/OWASP/ASVS/blob/master/5.0/en/0x25-V16-Security-Logging-and-Error-Handling.md .
