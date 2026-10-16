# OCTALVE INVOICE — SETTINGS / TEMPLATES / ISSUANCE / NRS AUDIT

**Research date:** 16 October 2026. **Status:** AUDIT AND DESIGN RECOMMENDATIONS — NOT IMPLEMENTED OR OWNER-APPROVED.
**Repository:** octalve-core/octalve-invoice
**Last proven app source:** `134156955ee5bece16560a8d0346744b28457d61`
**Review:** `318bb8ae1d89bf394903867c0ed6ff44cb11e3dd` (Batch F READY)
**Main:** `e01c9158616f65b4e08d5b36318b8d27aef3189b`, untouched. PR #2 remains draft.
**Inputs:** 10 owner screenshots (Zoho-like 3-step setup, four invoice variants, two sample invoice documents); official NRS MBS docs; public Zoho Invoice template guides; checked repository source. The owner-specific Zoho account URL is session-protected; public Zoho guides and owner screenshots are the evidence for that UX, not an assertion of authenticated access.

## Exact observed implementation gaps (no guessed code findings)

1. `app/(dashboard)/dashboard/settings/invoice/page.tsx` holds its own nonpersistent currency/due-date/tax/reminders preferences. The shown tax input defaults to 3.5% and auto-tax is checked, which must NEVER be treated as legal tax authority or applied automatically. Saving the page does not connect it to the composer.
2. `src/features/merchant-preview/MerchantPreviewProvider.tsx` contains a separate ephemeral `settings`, `invoiceAppearance`, `logoPreview`, `paymentMode`, customer/item lists and receipt mode. Business Settings edits some shared fields; invoice settings edits local fields. Merchant identity and logo are session-only, not authenticated persistence.
3. `src/features/invoices/sections/InvoiceComposer.tsx` reads the appearance default once into local `template` and allows a per-screen two-style override. It does not expose a unified catalog, persistent merchant default or customer template preference.
4. `src/features/invoice/templates/registry.ts` declares `octalve`, `classic-ledger`, `classic-receipt`, including a historical Sapphire-derived reference and a legacy-looking selection key. The live composer only offers Modern and Classic Ledger. Do not delete the Sapphire adapter/engine before parity testing and renderer migration.
5. `src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx` currently exports PDF and PNG from an UNSAVED browser draft and offers to continue without merchant logo/bank details. This bypasses recorded-document lifecycle expectations even though current frontend previews are not legally issued. Production must gate issuance and downloads at the server, not merely disable a button.
6. `src/features/invoices/sections/InvoiceMetadataSection.tsx` already has `chooseCustomer` copying `name,email,phone,address` immediately. Sample customer catalog records mostly have empty address. Future B2B e-invoicing needs separate billing name, postal address, country, Tax ID, buyer-type/classification and invoice-time immutable snapshot; do not require user to retype present catalog data.
7. Invoice renderers and export adapters are independent from the required NRS UBL structured XML/JSON and NRS status records. The current Tax Centre is an informative UI, not fiscalization; no real IRN, NRS QR or authenticated NRS submission exists.
8. Existing code honors owner payment authority separation: invoices are claims, payments verified ledger events, receipts optional nonrevenue documentation; only supported company-bank-transfer evidence may be manually reviewed. NRS PARTIAL is a fiscal payment-state mirror of verified allocations, not a new authority for cash.
9. Existing numbering authority uses display `OL-00001INV` (merchant initials, five-digit sequence and suffix). NRS IRN documentation requires an alphanumeric original invoice-number component. Preserve owner-facing display reference and map to separately stored NRS-compatible document number (e.g. `OL00001INV`, pending official validation), then NRS Service ID and issuance date. Never overwrite the original issued display number; never fabricate an IRN.

## Proposed consolidated Settings IA

`Me & Settings`
- **Business profile**: registered trading/legal name, RC/CAC, verified Tax ID (new NRS legal identifier), contacts, full postal address, country, business logo and signature.
- **Document templates**: per-category invoice/quotation/receipt/credit-note defaults, template gallery, draft preview, paper (A4/A5/Letter), margins, typography, brand accent/label/text/background, optional footer/terms. Set default is one merchant-owned action; optional per-customer override must be explicit.
- **Invoicing & numbering**: seller initials + sequence, issue/due date preferences, currency, PO/contract references, terms, notification policy; issuance settings separated from draft appearance.
- **Payments & receipts**: company-bank accounts, gateway/dynamic-account connection status, authorized bank evidence, verified allocation rules, optional automatic receipt after confirmed online payment, customer communications consent.
- **Tax & NRS**: Tax ID, tax classification rules (taxable/zero/exempt/out-of-scope per line), NRS applicability assessment, enablement status, NRS integration method (taxpayer self-integration or accredited SI/APP), Business ID, Service ID, submission/validation/audit status; credentials **never** shown in frontend.
- **Customers and Items**: structured billing recipient + address + Tax ID, customer default template, products/services classification/UoM codes, exempt/zero/taxable categories.
- **Staff & approvals**, **Notifications**, **Subscription** (commercially UNAPPROVED), **Privacy & archive**, **Support**.
Settings should have ONE canonical typed merchant preference record per tenant and one mapping to create/edit/preview/issued PDF. No duplicated mobile and desktop state machines.

## Suggested easy three-step Getting Started journey (inspired by owner screenshots, not copying artwork)
Step 1 — **Your invoices**: choose a template, upload actual merchant logo, preview changes, set branding defaults. Select Octalve Modern, Classic Ledger, Standard, Spreadsheet, Continental, Compact; **Legal** style is reserved pending owner artwork and must not claim legal certification.
Step 2 — **How you get paid**: company account and/or online payment method preferences, account eligibility and verification. Manual bank transfer is never auto-verified. Gateway/dynamic invoices can never be marked paid by hand.
Step 3 — **Enable services**: quotations, recurring, notes, customer portal, tax/NRS, staff, etc. Explain which are active vs planned. All steps save into the same canonical preference object. An incomplete setup can be resumed or edited later.

## Required invoice/issuance lifecycle

- `LOCAL_DRAFT`: editor state; may preview on screen with a visible DRAFT marker. No PDF/PNG, customer share, QR, sent status, receipt or collected amount. Screenshot prevention is not guaranteed; server data authority is the control.
- `SAVED_DRAFT`: authenticated server creates a tenant-owned draft ID, exact immutable *version history* of changes and relevant payment/tax selections. No legally issued PDF/PNG or public link; optionally print DRAFT only in future if owner explicitly allows.
- `READY_FOR_ISSUE`: validated merchant+buyer identities, tax treatment, items, amount, numbering, permissions, approved template and relevant NRS applicability.
- `PENDING_FISCALIZATION`: only when NRS required: construct versioned UBL payload, IRN source fields, sign/submit via approved integration, correlate retries/idempotency; never label approved while pending.
- `ISSUED`: committed immutable source snapshot and one official server-produced document hash; NRS-required invoices additionally need authentic accepted fiscal status/IRN/QR before customer-issued download or delivery, subject to confirmed legal/regulatory fallback protocols. Non-applicable cases record the documented basis for non-NRS treatment.
- `PARTIALLY_PAID/PAID`: payment derived from verified ledger events, exact allocations and reversals, never browser toggle. NRS status updates mirror these events.
- `ADJUSTED/VOIDED/REFUNDED`: via credit/debit/refund notes and official fiscal transition as applicable, retain original PDF/hash and audit trail. Never silently edit/reissue in place.
- At each document's ISSUE EVENT, capture `merchantSnapshot`, `customerSnapshot`, `templateId`, `templateVersion`, `brandThemeSnapshot`, `taxCodeSnapshot`, `currencyMinorUnit`, `NrsFiscalizationReference`, `contentHash` and `paymentPolicy` to prevent retroactive rewriting by later Settings changes.
- ***Absolute export rule:*** All official PDF/PNG downloads from a server endpoint fetch only an authorized, recorded, issued document; never use arbitrary browser input or a user-supplied status flag to issue an official document. Audit download and share actions. Server forbids exports of unissued/unsaved content irrespective of UI controls. The current frontend demo should stop its unsaved download buttons when implementing this.

## NRS/MBS research — official source-grounded essentials

Sources checked 16 Oct 2026:
- https://einvoice.nrs.gov.ng/ ; https://einvoice.nrs.gov.ng/docs/introduction
- https://einvoice.nrs.gov.ng/docs/introduction/getting-started
- https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn
- https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema
- https://einvoice.nrs.gov.ng/docs/authentication
- https://einvoice.nrs.gov.ng/key-definitions
- https://einvoice.nrs.gov.ng/changelog
- https://einvoice.nrs.gov.ng/docs/resources/get-payment-means
- https://einvoice.nrs.gov.ng/resources
- Government public notice dated 17 Feb 2026 reproduced https://matrixngr.com/wp-content/uploads/2023/10/E-Copy-17.02.2026.pdf page 10; crosscheck https://kpmg.com/us/en/taxnewsflash/news/2026/02/nigeria-phased-rollout-e-invoicing-electronic-fiscal-system.html .
- Zoho public guide https://www.zoho.com/za/invoice/help/pdf-templates/create-template.html and https://www.zoho.com/ca/invoice/help/settings/templates.html .

### Jurisdiction, dates, roles
Official Feb 2026 NRS notice: large taxpayers above ₦5bn go-live completed, enforcement Apr-Jun 2026; medium ₦1bn–₦5bn go-live 1 July 2026, enforcement Jan–Mar 2027; emerging below ₦1bn go-live 1 July 2027, enforcement Jan–Mar 2028. **Indicative, subject to adjustment.** July 2026 press updates on large taxpayer deadlines show why we should validate current applicability rather than hardcode compliance calendar or liability.

NRS July 13, 2026 update: **Tax ID replaces TIN** for legal identification. Some API v1.1 examples still say `TIN`; create an internal Tax ID model and versioned adapter to reflect actual currently accepted API field names, after official staging verification. Do not demand Tax ID from every B2C contact until business category and documented rules justify it.

NRS e-Invoice ≠ PDF/PNG. Structured UBL XML/JSON, business/tax identity, seller/buyer data, line-level tax breakdown, monetary totals, currency, issue date, document kind, classification codes and official fiscalization are separate from visual renderers. API docs list BusinessID, IRN, issue date, invoice type/kind, supplier, invoice lines, tax totals and legal totals; standardized UoM added Apr 2026.

IRN guidance combines alphanumeric invoice number + NRS Service ID (8 chars) + issue-date stamp YYYYMMDD, often represented with separators. Never display a guessed NRS IRN as authentic; store `nrsCandidateSourceNumber` separately from `displayDocumentNumber`, and final NRS validated value/status separately.

NRS supports `PENDING`, `PARTIAL`, `PAID`, `REJECTED` payment-status reporting (April 2026 update). Updates must derive from verified payment/allocation events and maintain idempotency.

NRS QR must be derived from valid official data and verification evidence. Do not use customer portal QR or payment QR as fiscal QR. Cryptographic stamps / signatures / secure key management must be fulfilled by the chosen qualified NRS integration and never invented in the PDF styling layer.

### Merchant connection model to verify with NRS before implementing backend
1. Merchant enters Tax ID and business registration details in Octalve; selects invoice type and confirms applicable compliance category.
2. Merchant either uses NRS self-integration, authorized SI/APP connection, or manually operates the government portal when integration is not yet activated. Do not assume Octalve is accredited.
3. Server verifies merchant NRS enablement / Business ID / assigned Service ID and securely stores appropriate provider/merchant authorization linkage. A public UI must not accept or expose raw permanent API secrets.
4. Octalve produces validated structured e-invoice data; server securely authenticates and submits, signs/validates/confirms according to approved NRS role/endpoint sequence and version. Handle network errors, duplicate attempts, uncertain status, rejects and amendments.
5. Store raw acknowledgements/reference, IRN, QR verification payload, receipt/transmission status, version, timestamp, audit and hashes. Merchant sees simple actionable states: Not connected → In review → Ready → Submitted → Validated / Needs attention / Rejected.
6. Upon valid fiscal status, freeze invoice-issued snapshot and enable real PDF/PNG/share. Buyer access via signed, scoped, expiring link. Not every company is subject to same rollout timeline; distinguish not-enrolled/not-applicable/not-ready without claiming tax exemption.

### Security and reliability
Multi-tenant deny-by-default RBAC/MFA; tenant-bound per-merchant NRS mappings; encrypted secrets or vaulted tokens; no browser secrets; CSRF/Origin; verified callback signatures (where offered), dedupe/idempotency and replay protection; attempt/response audit; robust retry and dead-letter queue; correction/credit/refund linkage; schema versioning and monitoring.

## Zoho template workflow to ADAPT, not copy
The owner images illustrate Standard, Spreadsheet, Continental, Compact, cash/payment setup and a modular setup wizard. Public Zoho docs confirm template gallery, per-category defaults, clone/edit, fonts, backgrounds/colours, customer overrides, preview and filename customization. Template previews shown with sample totals should NOT be copied as financial calculation authorities.
Proposed initial Octalve invoice catalog:
- **Octalve Modern** (current renderer adapter; rebrand independent of Sapphire source identity).
- **Classic Ledger** (current renderer adapter).
- **Standard**, **Spreadsheet**, **Continental**, **Compact** (new original Octalve-built styles inspired by broad layout patterns, not copied Zoho assets).
- **Legal** (placeholder entry only; do not render or certify until owner supplies actual design; may be called Legal style but it is not NRS/legal certification).
For each template: assign stable templateId/version, renderer, native PDF mapping, theme support, category support, logo behavior, preview thumbnail, default status and migration rules. A receipt is distinct from an invoice template. Test browser/PNG/PDF parity, pagination, line overflow, empty fields, RTL/unicode fonts where applicable and actual NRS-generated QR only when valid.

Branding: Merchant-uploaded logo and explicit brand theme are independent of Octalve blue global shell. Default system accent may be Octalve blue until merchant changes it, but changing default theme cannot recolour already-issued immutable documents. An original invoice must reproduce its issued template/version on future downloads regardless of new merchant preference.

## Stage-gated implementation plan (requires owner approval)
1. **Settings IA refactor and control audit**: one responsive canonical interface, typed merchant defaults; delete conflicting 3.5% demo tax and auto tax assumptions, separate 'appearance' from tax applicability and operational delivery. Keep mobile and desktop same data source.
2. **Customer/item metadata mapping**: auto-populate billing identity/contact/address + Tax ID when available, invoice-time snapshots, source-of-truth customer catalog; per-line tax categories, classification and UoM. Keep merchant edits specific to draft without accidentally overwriting master.
3. **Export/issuance gate**: disable unsaved PDF/PNG; prepare distinct Save Draft, Issue Invoice, Download Issued Invoice. Server-side enforcement only once Phase 1 approved; until then no real issuance claim.
4. **Template gallery**: wire merchant default + customer override + selected per-document style; prove live HTML/native PDF parity with golden screenshots and multiformat tests before retiring Sapphire-derived adapter.
5. **NRS-readiness *frontend contract only***: enrollment UI, Tax ID/Business ID/Service ID conceptual fields and status states, schema mapping contracts and integration strategy evaluation; NO keys, live test submissions, actual IRN or QR.
6. **Backend Phase 1 (separate authorization)**: secure ledger, tenant/customer records, immutable revisions, number allocation, NRS integration and payment reconciliation. No database provisioning without owner approval.
7. **Owner visual sign-off**: 320/360/390/430/768/1024/1440 widths, keyboard/accessibility, missing logo/account, tax status, valid and invalid NRS scenarios, issued PDFs and prohibited draft downloads.

### Blocking owner decisions before coding workflow changes
- Confirm no downloadable unsaved draft at all (strongly recommended), including Preview-specific PDF/PNG. Decide whether saved drafts may optionally export visibly watermarked DRAFT later (default No).
- Approve revised Settings organization and which setup steps can be skipped.
- Confirm Legal is a template name reserved for owner artwork; do not invent official/legal design.
- Confirm current customer invoice template override preference and default policy.
- Decide future NRS connection architecture (self-integration, accredited SI/APP), only after official engagement; do not claim Octalve is NRS certified.
- Provide intended Octalve and Legal original artwork for final theme fidelity.
- Approve separate Phase 1 backend before persistent issuance, token storage, payments or NRS submissions.

**No application code changed in this audit. No deployment, NRS registration, authentication or financial issuance executed.**
