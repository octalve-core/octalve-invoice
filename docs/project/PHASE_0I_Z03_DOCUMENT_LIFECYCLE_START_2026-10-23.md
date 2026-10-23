# Octalve Finance — Phase 0I Z03 document lifecycle and delivery UI

**Start:** 23 October 2026. **Scope:** frontend contract and Preview UX only. **Status:** Z03 first candidate, Review-only and NOT qualified until exact-source CI/browser, independent merge and owner acceptance. **Branch:** `phase/0i-z03-document-lifecycle-delivery-preview-20261023`.

## Source and release authority
- Owner confirmed Z02 visual acceptance and authorised moving to the next stage in the same Octalve Finance project.
- Z02 PR #45 merged into canonical Review at `f2e63842b31767ba7d5b71256a9717b3ed33e88e`; post-merge exact-source qualification and deployment must be checked independently.
- `main` and Production were **not** changed by this Z03 work.
- Authoritative preexisting contracts: `PHASE_0I_Z01_TO_Z05_HANDOFF_2026-10-21.md`, `INVOICE_RECEIPT_PAYMENT_AUTHORITY.md`, `NUMBERING_AND_CREDIT_AUTHORITY.md`, `THREE_EXPERIENCES_IDENTITY_AND_AUTHORITY_2026-10-21.md`, the dated NRS/exception/metrics contracts, and approved Batches P–T.

## Source/dependency matrix

| Concern | Reused current source | Z03 preview addition | Blocker/next gate |
| --- | --- | --- | --- |
| Invoice lifecycle | Existing `InvoiceComposer`, `prepareDraftIssueSnapshot`, shared merchant provider, Modern/Classic renderer and `getPreviewInvoice` | Typed issuance/delivery/collection/refund **independent axes** and fail-closed read-only preview capabilities | No server-persisted issued snapshot, merchant session, approvals, NRS, tax legal review or authoritative record |
| Invoice delivery | Existing `/dashboard/invoice/[id]` details and same customer-facing draft preview | Standalone `/dashboard/invoice/[id]/delivery-preview`, local recipient/channel/message, disabled send/share and explicit status | No authenticated delivery endpoint, verified recipient, PDF attachment, signed link, retry/outbox or gateway data |
| Quotation lifecycle | Existing `/dashboard/quotation/[id]` sample document; catalog snapshots from Z02 | Standalone `/dashboard/quotation/[id]/lifecycle` with internal review, customer response, conversion requirements, disabled action | Actual accepted immutable quote, customer consent, merchant action and new invoice issuance not available |
| Receipt provenance | Existing `INVOICE_RECEIPT_PAYMENT_AUTHORITY.md` and `getRelatedPreviewInvoice` | Pure proof/approval/anti-duplicate requirement contract | Verified bank/provider ledger, receipt issue and optional receipt delivery need Phase 1 |
| Status separation | Existing sample invoice status strings for illustrative merchant lists | New lifecycle axes `issuance`, `delivery`, `collection`, `refund` and distinct quotation status | The sample payment status cannot be promoted to issuance or verified cash |
| Regulatory references | Existing Tax Centre and NRS readiness (not connected) | No new NRS/tax claims or generated IRNs/QRs | Legal/statutory version, official NRS schema and provider contracts remain open |
| Identity | Existing distinct Merchant/Customer/Admin frontend demonstration | No new grants or role switcher | Future Phase 1 secure tenant authentication/authorization separate |

## Strict next acceptance
1. Versioned immutable issued snapshot and lawful edit/void/credit/debit rules are only a **specification**: no UI shall issue or "save" without trusted server.
2. Both Modern and Classic Ledger preview remain the shared renderer; no duplicate PDF, future delivery must use that same server snapshot.
3. Delivery is independent of invoice creation, invoice payment terms, fiscal state, customer permission and receipt issuance.
4. Quotation acceptance cannot create a second invoice without explicit merchant action; a new invoice draft must revalidate tax/buyer/date/currency and allocate a **new** number at issuance.
5. Verified receipt payment is the money event; any optional auto-receipt remains off by default and requires verified allocation, anti-replay, audit.
6. Browser: real navigation from invoice/quotation details to new standalone pages on 320/390/1440, controls remain disabled after local input, no fake actual customer link, no horizontal overflow.
7. Exact final commit Node24/frozen pnpm/type/lint/unit/build, CodeQL, all Z02 and P–T browser regressions, new Z03 browser checks and screenshots, READY QA deployment at exact SHA, owner visual acceptance.
8. No Review/main/Production promotion without separate authorization and release evidence.

## Z03 remaining scope (do not falsely mark complete)
- Full document lifecycle UI with meaningful read-only issuance validation and immutable version/correction states.
- Quotation acceptance/rejection/expiry UX and preview-only conversion to a NEW draft with client/item snapshots preserved.
- Receipt provenance/optional after verified provider payment and separate send/readiness UX.
- Renderer golden parity and long/multi-page document evidence, customer-facing and merchant-facing parity with issued-version authority.
- Delivery queue/send/failed/retry state UX with accurate disabled/preview guards and no fake operational state.
- Owner approval, exact-merged Review qualification and separately gated future backend/NRS authority.

**Nothing in this candidate activates real identity, provider bank accounts, fiscal submission, email, payment, downloads or subscriptions.**
