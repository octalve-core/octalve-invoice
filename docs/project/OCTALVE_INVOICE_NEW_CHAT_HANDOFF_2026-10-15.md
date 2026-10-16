# OCTALVE INVOICE — AUTHORITATIVE NEW-CHAT HANDOFF
**Prepared:** Thursday, 15 October 2026 (Africa/Lagos)  
**Context:** Invoice-octalve ChatGPT Project; conversation reached context limit  
**Status:** PHASE 0 REMAINS OPEN. NOT APPROVED. DO NOT BEGIN PHASE 1.  
**Product:** Finzefy → Octalve Invoice, merchant-focused web application  
**Verified application HEAD before this handoff:** `4997858e74ba2bcff657d739167347ff7d35b5c1`. Re-fetch HEAD; documentation commits may follow.  
**Development branch:** `phase/00-finzefy-authority-ui-bootstrap`  
**Draft PR:** https://github.com/octalve-core/octalve-invoice/pull/1 (keep DRAFT; never merge without owner approval)  
**GitHub:** https://github.com/octalve-core/octalve-invoice  
**Verified READY Vercel Preview at application HEAD:** https://octalve-invoice-nl1yl0g1c-octalve-vault.vercel.app  
**Last verified GitHub checks at `4997858`:** Browser 111/111, frozen install, TypeScript, lint with 105 WARNINGS / 0 errors, tests, production build and CodeQL passed. CI success is not design approval or proof of native PDF parity.

## A. NEW-CHAT OPERATING RULE: READ BEFORE CODING
This is an existing, owner-led programme. Do NOT rebuild from scratch, ask the owner to restate old decisions, replace the approved Finzefy UX with generic SaaS templates, or start backend work prematurely. First retrieve current repository branch HEAD, draft PR, workflows, Preview deployment, and these authoritative files IN ORDER:
1. `docs/project/OCTALVE_INVOICE_NEW_CHAT_HANDOFF_2026-10-15.md` (THIS FILE).
2. `docs/project/OCTALVE_INVOICE_MASTER_IMPLEMENTATION.md` and `docs/project/state.json`.
3. `docs/project/PAYMENT_AND_RECEIPT_PHASE0H.md` and `docs/project/INVOICE_RECEIPT_PAYMENT_AUTHORITY.md`.
4. `docs/project/DECISIONS.md` — APPEND ONLY; `UI_REFERENCE_MAP.md`; `NUMBERING_AND_CREDIT_AUTHORITY.md`.
5. `docs/project/ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_BASELINE.md`, `PAYMENTS_ARCHITECTURE.md`, `COMPLIANCE_NRS_NDPA.md`, `RELEASE_CHECKLIST.md`, `NEXT_PHASE_PROMPT.md`.
6. `docs/project/FINZEFY_IMPORT_PROVENANCE.md` and imported renderer source/tests.
7. ALL owner-supplied Oct 15 desktop/mobile screenshots in this ChatGPT Project, including latest invoice detail, customer selector, create-invoice page, quotation modal, More screen, and table/mobile action-sheet references; cross-check `UI_REFERENCE_MAP.md`.
8. GitHub source donors, approved pinned commits, official Octalve brand assets and existing CI screenshot artifacts. If an image is not actually accessible in the next chat, state which specific image is missing; do not invent its design.
Source priority: (1) latest explicit owner instruction; (2) verified current Octalve Invoice code/migrations; (3) master implementation + current project-state + this handoff; (4) owner reference screenshots/assets; (5) approved Sapphire renderer golden outputs; (6) current official provider/NRS/OWASP/NDPC documentation; (7) older donor projects as patterns. Earlier handoff's “no public signup, Octalve-provisioned organizations” was SUPERSEDED: current merchant product retains Finzefy-style SIGNUP and verification. Earlier “receipt automatically issued on confirmed payment” was SUPERSEDED by owner-controlled optional receipts (see Section D). Do not silently resurrect either decision.

## B. PRODUCT INTENT AND APPROVED DESIGN
Owner and Octalve built BOTH Finzefy and this product. This is completion/refinement of Finzefy, not an independent blank-sheet replacement and not Sapphire Quest under a new name.
- Take Finzefy Next.js frontend and approved Flutter/mobile flows as the visual and usability authority: same design structure, cards, density, spacing, responsive information architecture and interaction patterns. Rename/rebrand to Octalve Invoice using EXACT uploaded official logo/icon, with brand blue `#0064E0`, hover `#0052B8`. Keep meaning-based GREEN for paid/success, RED for danger/overdue, amber for pending.
- Desktop: sidebar/top bar, dashboard, table pages, forms, carefully centered settings; no unnecessary horizontal overflow. Mobile: native-feeling blue profile header, notification bell (not hamburger), Dashboard/Getting Started segmented switch, compact chart, bottom navigation, stacked list cards and action bottom sheets; no squashed desktop tables.
- Fixed shared UI visual contract: desktop gray header row + light-gray inset record rows; top status chips, search, filters, Export/Create, pagination; mobile back/title header, search/filter/export row, full-width Create button, status chips, tinted record cards, leading status-specific icon, name/amount/reference/status/dates, ellipsis. **Mobile tapping a row opens its action bottom sheet (not direct view).** Desktop row opens view; ellipsis opens action dialog. Delete is red. Different modules change only fields, statuses, icons, specific actions; do not fork layout.
- Dashboard Recent Transactions uses SAME shared card/icon/action components; keep FOUR owner's original filters: All, Invoices, Expenses, Quotation. All may show receipts and credit notes. Four distinct faded Quick Create icon treatments: invoice blue, customer green, expenses red, quotation orange. Monthly chart must actually display on phone.
- Owner logo assets in repo: `public/branding/octalve-invoice-icon.png` and `public/branding/octalve-wordmark.png`. No invented/AI-regenerated branding. User avatar displays initials or uploaded user photo, NOT Octalve app icon. Merchant invoice logo falls back to merchant initials inside a circle if unset. Merchant identity/payment details originate from Business/Payment Settings, not hardcoded Sapphire company data.
- Finzefy-style onboarding: signup, login, email OTP, password recovery, business information/logo/signature, currency, Getting Started checklist. Business profile and primary currency may be skipped, then completed and edited. The REAL backend must persist and safely rehydrate; UI state today is in-memory and not authentication.
- “Other Services”: four across on desktop, three across on mobile, reduced icon sizing/gaps, accessible links; unavailable destinations show Coming Soon + Back to Overview, never 404.
- Remove repeated engineering terms (test-environment terms, webhook, tenant, migration, database state) and repetitive Preview warnings FROM CUSTOMER UI. Preserve one honest disclosure or disabled/guarded state where otherwise a user would wrongly believe that an auth/payment/email/receipt/financial action succeeded. Never fake success to make UI cleaner.

## C. PINNED SOURCES — DO NOT MERGE HISTORIES
- Target: https://github.com/octalve-core/octalve-invoice ; clean independent Git history, isolated Vercel project, future isolated Neon.
- Primary Finzefy web: https://github.com/octalve-core/finzefy-nextjs-frontend ; pinned donor `4660eda71248266f5b97b52638f6d26429370621` (see provenance doc).
- Finzefy Express API reference: https://github.com/octalve-core/finzefy-expressjs-backend ; pinned `212f3e1f10e4ebf553e0462d213d693202aaff48` — conceptual patterns only, DO NOT copy insecure legacy backend.
- Mobile Flutter UX reference: https://github.com/octalve-core/finzefy_mobile ; pinned `8447e8f67f19dbe7a8ff0eca93e0d28d62fd14d7` — adapt the owner's approved visual flow, do not port Dart code blindly.
- Independent Sapphire Quest: https://github.com/Octalve/sapphirequest-invoice ; pinned `dfd2657fc22f56c4b82808ca4072ad0300cb753c` (“Publish complete Sapphire Quest Invoice application”). Import **rendering**/calculation knowledge only; never mix histories or use Sapphire localStorage as real merchant persistence.
- Older TwiPay/Qart-flow/Octalve Vault: security, provider reconciliations, RBAC/MFA, idempotency and provider abstractions for later evaluation only.
- Former CENTRAL LIBRARY root specified by owner: `/Octalve/Octalve Invoice/` with `00 Project Control/`, `01 Architecture Security Compliance/`, `02 UI References/`, `03 Phase Checkpoints/`, `04 Releases/`. THIS location was not accessible/verified from current Project Files search. Treat GitHub `docs/project/` as the verified currently accessible source. If central Library connector becomes available, inspect and mirror latest approved handoff/checkpoints there; do NOT claim it is synced now.
- The original older authority pathname `/Octalve/Octalve Invoice/00 Project Control/OCTALVE_INVOICE_MASTER_HANDOFF.md` is historical, not a substitute for the newer verified master implementation and latest owner corrections. Find/read it if available; it cannot override current instructions.

## D. IMMUTABLE FINANCIAL / RECEIPT RULES — DO NOT LOSE
The owner clarified:
1. **Invoice:** an issued claim/receivable with its OWN number, amount, balance and lifecycle. An unpaid/partially paid issued invoice contributes to accounts receivable; a draft is not a receivable and a fully paid invoice is not still outstanding. Payment changes allocation/balance, NOT invoice history/PDF.
2. **Payment:** verified transfer/card/cash receipt event with source, exact minor units, currency, merchant, references, timestamp, evidence and allocations. The payment ledger (less correctly recognized refunds) is source for CASH COLLECTIONS, NOT number of receipts, and receipts must NEVER be counted as additional collections. “Revenue” recognition is a separate accounting/tax question (cash vs accrual); do not blindly sum paid invoices + payments + receipts as revenue.
3. **Receipt:** an optional DOCUMENT ACKNOWLEDGING A PAYMENT, linked to a paid invoice/payment if appropriate or standalone from an independently recorded payment. Payment can be complete WITHOUT a receipt. Merchant must be able to return later, select an already-paid invoice and generate a receipt. A manual receipt must have underlying independently recorded, properly evidenced payment. No double creation on provider retries.
4. **Owner-chosen online receipt policy:** settings modes OFF/manual default, AUTO-GENERATE after fully provider-verified qualifying online payment, or AUTO-GENERATE-AND-EMAIL after verified online payment, if explicitly enabled. Old “never automatically issue any receipts” wording is superseded by this NEW OPT-IN rule. Server must provide per-event idempotency, merchant approval/policy, email outbox and audit. UI toggle today does NOT issue/email anything. Manual transfer policy remains controlled.
5. **Invoice payment channel LOCKED at issuance snapshot**: merchant's own existing static company bank account → manual bank-transfer recording MAY be offered ONLY for an eligible unpaid/partial issued invoice and only after merchant confirms real funds in their own bank, with server RBAC, audit, evidence and suitable approvals. Invoices using Monnify dynamic accounts / Flutterwave / Paystack gateway/virtual accounts MUST NOT expose an effective “mark paid” manual bypass; rely only on verified webhooks plus trusted independent provider verification and idempotent reconciliation. Neither browser redirect nor clicking “mark paid” proves payment.
6. Partial payments, multiple allocations, refund/credit note settlements, reversals and duplicate events need an exact-money transactional ledger. Reconcile source payment once, prevent conflicting replay and over-refund. Manual bank payment cannot be labelled provider-verified.
7. Merchant provider credentials are encrypted per merchant, server-only; provider funds settle directly under merchant's arrangement, no Octalve custody in V1. Monnify is preferred first candidate ONLY after up-to-date official doc and eligibility verification. Dynamic account unique to invoice/payment request so transfers can be reconciled without direct access to ordinary merchant bank transactions.
8. Separate human invoice number and NRS IRN/fiscal document number; use current official NRS MBS/UBL/tax rules, classification, tax status/QR, retry/outbox, audit, signed/frozen document snapshots. Fiscal reporting DOES NOT mean automated tax remittance.
9. Credit note is auditable customer liability/credit allocation/refund adjustment; can carry forward to later invoice or be refunded under rules; never delete historic settled credits or treat refund request as proof of funds moved.
10. Exact number rule: `[MERCHANT_INITIALS]-[at least 5-digit sequence][TYPE]`; e.g. `OL-00001INV`, `OL-00001RP`, `OL-00001QUO`, `OL-00001CR`, `OL-00001EXP`, `OL-00001SF`; `CUS` and `ITM` are PROVISIONAL directory identifiers and require owner confirmation. Freeze validated prefix on first real issuance, unique type-specific merchant sequences allocated atomically SERVER-SIDE, never trust browser numbers.
11. Quote status is draft/sent/accepted/declined, not “Paid”: quote is not a payment. Quote→invoice requires explicit conversion, new issued number and immutable quote reference.
**READ** `INVOICE_RECEIPT_PAYMENT_AUTHORITY.md` and `PAYMENT_AND_RECEIPT_PHASE0H.md`: both have history; latest owner-approved opt-in online receipt settings govern where older text conflicts.

## E. DOCUMENT OUTPUT / EDITOR — EXTREMELY HIGH FIDELITY
- The existing Sapphire-based approved **Octalve Modern invoice** and **Classic Ledger** are the exact rendering authorities. The Classic Receipt engine also exists in source; do not silently claim it is qualified for new receipt issuing. Maintain A4/A5/Letter output contracts where supported, Classic Receipt A5 landscape, image-first `ledger-header.png` and `receipt-header.png` and coded fallback, optional persisted signatures and real selectable PDF text. Golden browser/PNG/native PDF owner comparisons REQUIRED before Phase 0 signoff.
- Finzefy input: customer search/select + add-new modal (desktop) or bottom sheet (mobile); likewise select/create products/services, salesperson and payment method; compact native date picker UI rather than typing day/month/year as primary mechanism. Reuse approved screenshot sizes and spacing; no improvised forms.
- Product/service catalog offers name, type, optional description, unit price, discount default and tax preset. Selecting item imports applicable defaults; EMPTY item description must OMIT its own line from browser AND native PDF. Tax preset cannot silently become official tax until NRS-mapped per-item tax model and exact arithmetic are proven.
- Create/edit invoice: Finzefy structured form with LIVE Modern/Classic rendering, balanced roughly 50/50 desktop, mobile stacked preview; identical presentation data for form/browser/PDF; merchant identity and payment data come from merchant settings. Missing logo/bank prompts with “Go to Settings / Continue without” where valid. Never assume Sapphire company identity.
- Invoice VIEW: approved two-panel design, left compact mobile-style invoice-history list and right selected real document rendering on desktop; receipt VIEW follows same design. Mobile has its own responsive history/detail treatment.
- Issued documents in Phase 1+ must freeze company/customer/items/amounts/taxes/discount/currency/notes/payment info/template version/assets/signatures/NRS fields/final PDF/SHA-256. Profile changes NEVER rewrite issued PDFs.

## F. CURRENT SOURCE ARCHITECTURE AND VERIFIED PHASE-0H PROGRESS
Stack: Next.js App Router currently `^16.1.1`, React 19, TypeScript strict, Tailwind, pnpm `10.18.3`, target Node 24; @react-pdf/renderer 4.9.0. One Next.js full-stack codebase; prepare Prisma/Neon later, and OpenAPI for backend integration/testing. Pages are small composition shells, with cohesive features/sections, not 500–1000-line pages. Do not create a second Express backend without proof of need.

Important source:
- `src/features/merchant-preview/MerchantPreviewProvider.tsx`: ephemeral merchant/user, customers, items, staff, preferences, receipt automation mode, notifications read state.
- `src/features/invoices/sections/{InvoiceComposer,InvoiceEditorSection,InvoiceMetadataSection,InvoiceItemsSection,InvoiceDocumentPreviewSection,InvoiceListSection}.tsx`: form, customer/staff/payment bottom sheets, items, live rendered document.
- `src/features/invoice/`: original ported Sapphire calculation/presentation/Modern/Classic Ledger/Classic Receipt/HTML/native PDF.
- `src/features/records/{preview-records.ts,components/RecordDirectory.tsx,RecordMobileCard in RecordVisual.tsx,RecordActionDialog.tsx,RecordFilterDialog.tsx,RecordDetailDialog.tsx}`: ONE table/card/action architecture for Invoice, Receipt, Quotation, Expenses, Credit Note, Customer, Staff and Items.
- `src/features/catalog/{ItemEditor,StaffEditor}.tsx`; `src/features/payments/ledger.ts`: ONLY preview ledger projection (integer minor-unit examples, duplicate/refund defenses), not authenticated finance.
- `src/features/notifications/NotificationCenter.tsx`: category filters/read state with internal links, sample data.
- `components/dashboard/tables/TransactionTable.tsx`: shared dashboard Recent Transactions.
- `public/branding`: official user PNG.
- `scripts/phase-0c-browser-evidence.cjs`: browser evidence suite.

Key routes ALREADY PRESENT (DO NOT report absent without rechecking):
`/signup`, `/login`, email verification/password flow;
`/dashboard`, `/dashboard/getting-started`;
`/dashboard/invoice`, `/dashboard/invoice/create`, `/dashboard/invoice/[id]`, `/dashboard/invoice/[id]/edit`, `/dashboard/invoice/[id]/record-payment`;
`/dashboard/receipt`, `/dashboard/receipt/create`, `/dashboard/receipt/[id]`;
`/dashboard/quotation`, `/dashboard/expenses`, `/dashboard/credit-note`, `/dashboard/customer`, `/dashboard/customer/add`;
`/dashboard/items`, `/dashboard/items/add`, `/dashboard/items/[id]/edit`;
`/dashboard/staff`, `/dashboard/staff/create`, `/dashboard/staff/[id]/edit`;
`/dashboard/report`, `/dashboard/taxes`, `/dashboard/payment-received`;
`/dashboard/announcement`, `/dashboard/updates`, `/dashboard/notifications`;
`/dashboard/other-services`, `/dashboard/other-services/[slug]`;
`/dashboard/settings`, `/dashboard/settings/profile`, `/dashboard/settings/business`, `/dashboard/settings/invoice`.

Phase 0H owner's 12 requested UI fixes — VERIFIED SOURCE PRESENCE, not visual approval:
1. Payment/invoice/receipt projection and option settings: PRESENT AS PREVIEW, backend BLOCKED. Manual mode is gated by invoice sample paymentMode.
2. Two-panel invoice and receipt views: PRESENT; compare owner screenshots.
3. Customer, salesperson, payment selectors + add-new, native dates, item descriptions: PRESENT in composer; do full end-to-end owner UX/golden check.
4. Item create/edit and preset discount/tax: PRESENT; discount imports; NRS-correct per-line tax remains BLOCKED.
5. Quote create modal/status with sample product images: PRESENT/PARTIAL; actual quote conversion, upload/storage and refinement not complete.
6. Staff create/edit routes: PRESENT; NO real role invitation/auth.
7. Reports: PRESENT with preview ledger; NO server-grade revenue reports yet.
8. Edit Profile routing: PRESENT, temporary session state only.
9. Other Services icon sizing/colours: PRESENT; owner visual confirmation pending.
10. Excess “development-preview” text: reduced; keep one truthful disclosure for disabled financial actions.
11. Announcements/Recent Updates: PRESENT; owner still to approve premium design.
12. Notification UI: PRESENT with categories, read/unread and links; no real events/outbox.
Additional known: receipt creation allows later selection of PAID invoice or separate payment-preview branch; merchant receipt auto policy Off / Generate / Generate+Email is UI only.

## G. WHAT REMAINS — PHASE 0 NOT FINISHED
HARD acceptance blockers (DO FIRST, not Phase 1):
- Owner must inspect latest Vercel desktop and mobile routes/screens and decide exact deviations against reference images. No owner approval yet. Review EVERY requested flow and option sheet, particularly invoice detail/history layout, receipt view/history, customer/item selectors, quotation editor/image placeholder, staff/item add/edit, reports, profile links, announcement/update cards, notification screen, responsive mobile charts and Other Services.
- Independent **golden document regression**: render Modern, Classic Ledger and relevant receipt output in browser, PNG and native PDF; capture layout, totals, pagination, searchable/selectable text, headers, company initials, optional descriptions/signatures. Compare to approved source and record exact results with screenshot/file evidence. Currently NOT RUN as complete parity qualification.
- Per-item tax preset semantics: owner specified presets but applying tax into invoice sum must await verified legal/NRS tax categories and EXACT money math. Define/test tax classification, line/discount/tax order and rounding; no arbitrary percentage change, no inaccurate tax in PDF.
- Verify quote UX/business rules, where image preview placeholders should not mean real uploads, storage or issuance; may need owner visual correction before signoff.
- Audit interaction coverage beyond route smoke tests: actual selection, add-new forms/sheets, item edits, staff edits, report tabs, notification destinations/read actions, receipt creation/manual-payment guard, invoice/receipt two-panel detail interaction, dashboard chart and mobile scroll/overflow; screenshots at 390x844, 768 and 1440x900.
- ESLint latest CI has 105 warnings, zero errors. Do not call it “clean lint” or all warnings resolved. Reduce relevant imported warnings surgically without arbitrary redesign, and record accepted residue if any.
- Ensure no accidentally executable “Save/Send/Mark paid/Refund/Receipt created/Email sent” success before real backend. Preview-only route demonstrations must be guarded honestly. No production database or payments.
- Project Library sync/access NOT VERIFIED. Update repo docs/state/decision append-only and sync to central Library only if actual access exists.
- FINAL owner's explicit UI + document PDF approval before phase-branch merge or starting Phase 1. No silent move because CI is green.

KNOWN CI evidence at last verified `4997858` (UTC 2026-10-15 18:51):
- GitHub Browser run 38789013887: **111/111** (37 routes × 3 viewports), screenshot artifact uploaded; check artifacts directly.
- GitHub Phase qualification 38789022745: frozen pnpm installation, TypeScript, ESLint (105 warnings, 0 errors), unit tests, production build all workflow PASS.
- GitHub CodeQL run 38789022830: PASS.
- Vercel READY deployment https://octalve-invoice-nl1yl0g1c-octalve-vault.vercel.app at exact same `4997858`. New docs commits are not equivalent to a newly qualified application until their CI runs.
- Draft PR #1 remains unmerged; `main` baseline `87ad423dba3ced2445e109baa85114aea3d30037`.
- Database migrations NONE; Neon NOT provisioned; do not ask for secrets/URL during UI finalization.
- Production deployment URL NONE.

## H. PHASE 1+ ARCHITECTURE (DESIGN NOW, DO NOT EXECUTE NOW)
A future SINGLE Next.js App Router platform, strict TS, sections, Prisma + Neon PostgreSQL, OpenAPI schemas and realistic contract tests. Multi-merchant scoped schema from start. First backend phase secure user signup/verification, owner accounts, password reset, MFA foundation, sessions in Secure HttpOnly cookies, sessions revocation, merchant membership/RBAC/deny-default. Verified secure company/item/customer/signature/provider config persistence, migrations then immutable invoice/receipt snapshots and ledger. Payment providers only after secure data and authorization.
Plan: Organization/Merchant, User, Membership, Activation/EmailChallenge, Session/MfaCredential, CompanyProfile, BrandAsset/AuthorizedSignature, BankAccount, Settings/Currency/NumberSequence, Client, CatalogItem, Invoice/Line/Snapshot/GeneratedDocument, Quotation/Line/Snapshot, Receipt/Snapshot, PaymentRequest/VirtualAccount/PaymentTransaction/Allocation/ReceiptPaymentLink, ManualPaymentEvidence, Refund, CreditNote/CreditAllocation, WebhookEvent/ReconciliationRun, ProviderConnection/NrsConnection/NrsResourceCache/NrsSubmission, AuditEvent/OutboxEvent, Staff invitation/RBAC.
Security: OWASP ASVS L2, tenant/object checks on EVERY operation, exact money, transactional state/number allocation, password hashing, MFA, CSRF/origin protection, rate limits, CSP/HSTS, uploads/SSRF, encryption at rest for credentials, verified webhooks with replay resistance, zero trust of redirects, masked logs, CodeQL/SCA/secret scanning, negative authorization tests; comply with NDPA 2023/NDPC. Official NRS verification before production, no fabricated remittance. Do not mix Finzefy donor / Sapphire histories or databases.
**Neon:** Owner offered to connect a development DB, but explicitly deferred until secure backend/database phase is AUTHORIZED. At that phase ask for DEVELOPMENT-ONLY connection configured in Vercel (environment-variable names according to Prisma/Neon version; NEVER paste credentials in chat/Git). No live money endpoints until separately accepted.

## I. EXACT FIRST EXECUTION CHECKLIST FOR NEXT CHAT
1. Read this handoff and linked docs, fetch latest HEAD/CI/Vercel/PR, compare `state.json` against actual evidence and update stale fields.
2. Build owner-facing PASS/PARTIAL/BLOCKED gap list for each Oct 15 request, anchored to actual routes/components and latest reference screenshots. Do not restart a completed feature.
3. Address missing/partial Phase 0 UI/document behaviour with small, coherent section-component edits, show Git diffs/tests, keep all existing functions intact.
4. Run frozen pnpm install, strict typecheck, ESLint warnings inventory, unit tests, production build, CodeQL and 37-route × 3-viewport Playwright (expand with behavioral tests for new changes); verify Vercel READY on PHASE BRANCH. Ensure source commit and deployed commit match before claiming qualification.
5. Capture browser/PNG/native PDF goldens and report **PASS / BLOCKED / NOT RUN** explicitly; do not confuse build success with visual parity.
6. Update `DECISIONS.md` APPEND ONLY; `state.json`, master/gap docs, `NEXT_PHASE_PROMPT.md` and optional central Library *if verified*; push ONLY to `phase/00-finzefy-authority-ui-bootstrap`.
7. Present Preview link, exact SHA, test run, remaining gaps and ask only for owner's VISUAL APPROVAL of the result — **PHASE 0 REMAINS OPEN** until user explicitly approves. DO NOT merge PR #1, ask for Neon, create real auth or trigger payments.

## J. COPY-PASTE CONTINUATION PROMPT FOR A NEW CHAT
**OCTALVE INVOICE — PHASE 0H CONTINUATION, NOT PHASE 1.**

We are continuing the SAME Octalve Invoice project. Read `docs/project/OCTALVE_INVOICE_NEW_CHAT_HANDOFF_2026-10-15.md` FIRST at https://github.com/octalve-core/octalve-invoice on branch `phase/00-finzefy-authority-ui-bootstrap`, then the master implementation, `state.json`, Phase 0H correction review, all authority/decision/UI-reference files and latest GitHub Actions/Vercel Preview. Treat the latest owner-provided screenshots and explicit directions as authoritative. Do not start from scratch, redesign Finzefy, re-explain the project, assume old commit HEAD, or merge to main.

Phase 0 is STILL OPEN. First audit what's ALREADY DONE and what's incomplete in ALL 12 corrections from October 15: payment/invoice/optional receipt governance and auto policy; invoice and receipt two-panel views; customer/item/salesperson/payment selectors and native dates; catalog descriptions/tax/discount; quotation workflow; staff create/edit; reports; profile settings; Other Services; repetitive engineering text; announcements/recent updates; notifications. Preserve the shared desktop table/mobile cards and action bottom sheets, blue Octalve branding, source-derived rendering, independent Sapphire and Finzefy repos, and exact numbering.

Complete remaining UI and document issues only, including exact Modern/Classic browser/PNG/native PDF golden regression and mobile interaction parity. Run frozen pnpm, typecheck, lint, tests, 37 × 3 browser/screenshot checks, CodeQL and confirm real Vercel Preview. Record precise commits, qualifications, screenshots and blockers in docs. Keep live authentication, Neon, payment processing, NRS production submission, automatic receipts and merchant financial mutations disabled. Do not merge PR #1 or initiate Phase 1 until I explicitly approve Phase 0.

**END HANDOFF.**
