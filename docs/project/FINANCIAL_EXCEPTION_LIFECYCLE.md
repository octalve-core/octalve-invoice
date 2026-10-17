# OCTALVE FINANCE — FINANCIAL EXCEPTION AND DOCUMENT LIFECYCLE

**17 October 2026 — PROPOSED, REVIEW-ONLY, NO LIVE EXECUTION.**
Preserve prior owner rules in `INVOICE_RECEIPT_PAYMENT_AUTHORITY.md` and `NUMBERING_AND_CREDIT_AUTHORITY.md`. Proposed extensions below must be signed off before Phase 1 implementation; nothing in this document authorizes money movement, real issuance or provider/tax integrations.

## Independently recorded lifecycles
**Invoice** `DRAFT (watermark, no export)` → internal review/approve (role-controlled) → `ISSUED` transactionally (immutable merchant, buyer, product, tax, currency, terms, template, number and hash snapshots) → delivery queued/sent/delivered/viewed **as separate communications events**. Settlement is server-derived `UNPAID / PARTIAL / PAID` from verified allocations and lawful credit adjustments, not mutable invoice flags. Overdue is due-date logic, not payment proof. Correct issued documents through guarded credit/debit note and version/reference linkage; never edit the original issued snapshot. Rejected, abandoned, expired and failed fiscalization branches retain evidence without fabricated issue/fiscal status.

**Quotation** `DRAFT → SENT → VIEWED → ACCEPTED | DECLINED | EXPIRED`, with version, acceptance evidence and explicit conversion into a **new** invoice draft. Quote has no payment/dynamic account and is not billed revenue.

**Receipt** optional document referring to previously confirmed payment/allocation; either merchant-triggered or merchant-selected `GENERATE`/`GENERATE_AND_EMAIL` for provider-verified online payments **after** final payment verification. Auto-option defaults **OFF**. Separate receipt identity, immutable evidence snapshot and email-delivery status; zero incremental money. Standalone receipt must be supported by its separately recorded actual payment evidence. Disallow replay duplicate issuance.

**Credit note and refund** `CREDIT_NOTE_ISSUED → CUSTOMER_CREDIT_AVAILABLE` or legally eligible invoice reduction. `CREDIT_RESERVED_FOR_REFUND → REFUND_REQUESTED → APPROVED → PROVIDER/TRANSFER_INITIATED → SETTLED | FAILED | REVERSED`; never assume an issued credit note equals cash returned. Reservations lock available value until settled or safely released; idempotent credit allocations and refund requests cannot consume value twice. Debit corrections tracked independently; reversal events never delete originals.

**Supplier bill and expense** `DRAFT → APPROVED → PAYABLE` (if eligible) and `PAYMENT_INSTRUCTED → CLEARED/SETTLED` as separate evidence. Rejected approval, partial supplier settlement, asset purchases, owner drawings, tax remittances, payables and recurrent obligations need distinct classification. Recurring rule only creates an idempotent reviewable occurrence, never guaranteed invoice issue or outgoing cash.

**NRS** taxpayer applicability/approved connection → tax-classified, immutable valid issued document → structured UBL validation/submission → accepted with official identifier or rejected with reason; payment status follow-up is distinct from settlement; filing/remittance is separate. NEVER invent an IRN or QR from merchant display numbers or browser draft. NRS v1.1 documentation requires an alphanumeric original invoice-number component for its IRN recipe, with separate Service ID and issuance date. Proposed display `OL-00001INV` must map immutably to **validated** internal NRS identifier; `OL00001INV` is only a candidate, not certified. See official https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn and https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema; confirm API schema with actual test fixture, merchant eligibility and integration path before approval.

## Payments: proof precedence and exceptions
1. **Provider link or invoice-specific dynamic account:** create a merchant-authorized `CollectionIntent` referencing original invoice/currency/amount/provider, virtual account reference and provider-provided expiry/lifecycle. On verified webhook **plus independent provider enquiry when required**, check verified merchant identity, signature, amount, currency, reference, finality and replay-safe provider ID. Only verified successful events allocate money. The account may be temporary, recycled or provider-defined; **do not promise “infinite until paid”** without verified provider contract. Invoice due date and collection-account expiry are different; expired collection instruction does not automatically void the invoice. Re-issue collection instructions through an auditable fresh intent only.
2. **Manual merchant bank transfer:** only an allowed merchant bank route with tenant-verified bank setup, clearing evidence and role-gated approval may create a classified **MANUAL_CONFIRMED** payment. It is never labelled provider-verified. A screenshot alone cannot reconcile money.
3. **Mixed channel (owner decision required):** keep the original provider intent immutable. Permit only separately authorised bank-cleared second allocations supported by a fresh bank/payment source proof, e.g. ₦120,000 gateway + ₦80,000 merchant bank on one ₦200,000 claim. No arbitrary global “mark paid”.
4. **Partial, over/under, duplicate, failed:** allocate at most remaining eligible claim; extra confirmed money becomes customer advance/unapplied cash until owner decision. Insufficient event stays partial. Duplicate callback repeats no posting, invalid signature/out-of-order pending events never settle; record unsupported currencies and reference mismatches as exceptions. Failure/retry has monotonic event state and reconciliation evidence.
5. **Fees, chargeback, settlement delay:** provider gross customer payment, provider fee, net merchant payout and eventual reversal are distinct records. Never mistake settlement amount after fees for invoice principal. Reversal reopens or adjusts balances only by approved policy with link to original allocations and customer credit.
6. **Refund by receipt:** receipt documents evidence; refund must be separately approved, submitted and independently confirmed before outflow/status. A refunded receipt remains auditable; a credit-note adjustment does not itself issue a refund.

## Idempotency, invariants and security gates
- Uniqueness scope: tenant+provider+providerTransactionRef+semantic event type; plus event replay ID and payload hash. For receipts: unique protected issue request or alloc-set fingerprint; for recurring: tenant+rule+occurrence; for number allocation: tenant+record type+sequence, all under transaction and lock.
- Money invariants: confirmed payment >= total active applied allocations + outstanding unapplied/held/refunded classification; invoice allocation cannot exceed invoice due except explicit overpayment liability; credit face >= available + applied + reserved/settled refunds under well-defined adjustments. Prevent negative available balances and cross-currency offset without approved conversion event.
- Authenticated tenant/membership check on every read/action; deny-by-default permissions, maker/checker for sensitive exceptions, session/MFA/Origin-CSRF, rate limits, provider signature verification and secrets server-side only. Immutable audit/outbox, retry/dead-letter and restorable encrypted backups are Phase 1 mandatory acceptance, not Preview guarantees.
- Customer portal uses invitation with tenant/customer scope, opaque token, expiry/revocation, explicit consent and access events. Draft/send/delivered/viewed/accepted statuses are independent of payment status. No public access to real records in Preview.

## Scenario test table
| Case | Required invariant |
| --- | --- |
| Same ₦120,000 webhook 5 times | One verified event and one allocation, no extra receipt. |
| Gateway ₦120,000 + authorised bank ₦80,000 on ₦200,000 invoice | Two distinct proofs, one Paid derived status, no gateway spoofing. |
| Invoice ₦200,000, actual ₦210,000 | Allocate ≤₦200,000, hold ₦10,000 unapplied; no invented revenue. |
| Credit ₦50,000: reserve refund ₦20,000, apply ₦30,000 | Available ₦0 and no double-spend; only settled refund counts as outflow. |
| Provider payment reversed after “Paid” | Linked corrective event, role/risk checks and accurate reopening/credit status, immutable earlier history. |
| Dynamic account expires before due date | Collection intent expired, invoice still open, authorised regeneration with fresh provider account reference. |
| NRS rejects validation | Preserve rejection & retry audit; no official IRN, QR, “filed” or fake tax proof. |
| Bill approved today, transfer settled next period | Outstanding bill today; money out next period only. |
| Customer portal invite expired/revoked | No customer record access; no cross-merchant access. |

**Unresolved owner approvals:** mixed-channel limits, provider timeout/expiry handling, manual-payment approver threshold, fee allocation, refund reservations/chargebacks, accounting basis, tax scope, record retention, customer/recurrence commercial access, and any server go-live.
