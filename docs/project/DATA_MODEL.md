# DATA MODEL — IMPLEMENTATION CONTRACT AND PROPOSED FULL DOMAIN RECONCILIATION

**17 October 2026 — existing core authority retained; all expansion below PROPOSED and NOT IMPLEMENTED.** This file is a model contract, **not** a Prisma schema or permission to start Phase 1.

## Established baseline from the earlier data-model contract
Merchant/Organization, User, Membership (owner/staff), ActivationChallenge, PasswordResetChallenge, Session, MfaCredential, MerchantProfile, BrandAsset, AuthorizedSignature, BankAccount, MerchantSetting, NumberSequence, Customer, Item, Invoice, InvoiceLine, InvoiceSnapshot, GeneratedDocument, Receipt, ReceiptSnapshot, PaymentProviderConnection, PaymentRequest, VirtualAccount, PaymentTransaction, PaymentAllocation, WebhookEvent, ReconciliationRun, TaxCodeCache, TaxRule, NrsConnection, NrsResourceCache, NrsSubmission, AuditEvent, OutboxEvent.

All business-owned records must be merchant-scoped, with service-side and storage-level ownership validation. Unique sequence and public identifiers are scoped by merchant/type. Avoid floating-point financial truth, silently backdating/correcting issued snapshots, reused numbers, hard-delete of fiscal records or local browser status as authority.

## Reconciliation matrix — proposed logical concepts, not one-table-per-name
| Bounded context | Required concepts and important relationships |
| --- | --- |
| Identity & tenancy | Organization, User, Membership, RoleAssignment, Session, MfaCredential, Invitation, ApprovalAuthority, scoped permissions and session revocation. |
| Merchant profile | Registered/trading business identity, tax/RC/contact/address, MerchantSetting, BrandAsset, AuthorizedSignature, MerchantBankAccount, verified ownership evidence and versioned change history. |
| Customer & catalog | Customer, BillingAddress, TaxIdentity, Consent, Item/Price/TaxClassification. Issued Customer/Item snapshots **must not be pointers to mutable present values**. |
| Quotations | Quotation, QuotationLine, QuotationVersion, Acceptance/DeclineEvidence, ConversionLink to a **new** invoice. |
| Billing/issuance | Invoice, InvoiceLine, DraftRevision, Approval, NumberSequence, IssuedSnapshot, GeneratedDocument(hash), document Version/CorrectionLink. Atomic number allocation only on approved issue. |
| Collections | PaymentProviderConnection, CollectionIntent (legacy PaymentRequest), PaymentAttempt, VirtualAccount, VerifiedPaymentEvent (legacy PaymentTransaction), PaymentAllocation, UnappliedPayment, ProviderFee, Settlement, WebhookEvent, ReconciliationRun. Reconcile synonyms rather than duplicate monetary records. |
| Receipts | Receipt, ReceiptSnapshot, ReceiptPaymentLink, ReceiptDelivery; no financial inflow created by receipt itself. |
| Credits & reversals | CreditNote, DebitNote, CustomerCredit, CreditAllocation, Refund, RefundAttempt, RefundAllocation, Chargeback/Dispute, AuditEvent. Reservation and available balances transactional. |
| Suppliers, bills & expenses | Vendor/Supplier, SupplierBill, Expense/ExpenseCategory, Purchase/Asset, Disbursement/BankOutflow, ApprovalRequest, Attachment/Evidence, opening payable and recurring obligation. |
| Staff/governance | StaffProfile distinct from authenticated User/Membership, assigned Role, ApprovalRequest, ExceptionCase, AuditEvent, retention/soft-delete. Staff SF code is administrative, not fiscal. |
| Recurrence | RecurringRule, RecurringOccurrence, generated target ID, explicit approval, retry/cancellation audit; unique merchant+rule+occurrence. |
| Communications | MessageDraft, OutboxEvent, DeliveryAttempt, ProviderReceipt, Consent, Read/ViewAcknowledgment, Bounce, opt-out. Queued ≠ delivered. |
| Customer access | PortalInvitation, scoped opaque token/session, expiration/revocation, authorised customer-document grants, access audit. |
| Tax/NRS | TaxCode/RuleVersion, fiscal classification, NrsConnection, NrsResourceCache, FiscalizationRequest, NrsSubmission, official Identifier/IRN/QR metadata and rejection, payment-status update, separate filing/remittance. |
| Reports/import | MetricDefinition/Version, ReportingPeriod, OpeningBalance, ImportBatch/Row/Source, DuplicateResolution, FXRate/RateSource, period/date mapping, reconciliation evidence. |
| Commercial | ProductPlan, Subscription, Entitlement, UsageCounter, BillingEvent and trial transitions **only after commercial approval**; current UI prices illustrative. |
| Full accounting **conditional** | ChartOfAccounts/Account, JournalEntry, JournalLine, AccountingPeriod/Closing, TrialBalance, accrual/depreciation/reconciliation **only if Level 3 is approved**. |

For every logical concept, the Phase 1 design review must supply: tenant key and authorisation guard, natural and surrogate unique keys, FK constraints (including cross-tenant protection), immutable event versus mutable workflow projection, amount currency and minor-unit scale, lifecycle/status transitions, source-of-truth provider and proof, snapshot/version, timestamps (event effective, recorded, cleared), role visibility, GDPR/NDPA-sensitive fields, encryption/retention/deletion, retry/idempotency key, and trace to UI route/domain rule/test.

## Required financial integrity edges
- `Invoice` 1-to-many `PaymentAllocation`; `VerifiedPaymentEvent` 1-to-many allocations but every allocation references exactly one source proof, one currency and one tenant; a receipt may reference proven allocations without double-counting.
- `InvoiceSnapshot` immutably freezes issuer, buyer, logo/signature selection, tax, lines, terms, template and original PDF/hash. `CreditNote`/debit adjustments link back; historical numbers remain immutable.
- `CustomerCredit` availability cannot be less than zero after concurrent `CreditAllocation` and `RefundReservation`. A refund attempt is not a paid refund.
- `MerchantBankAccount` must not be confused with invoice-specific `VirtualAccount` or final provider settlement account.
- `TaxCodeCache` and local tax calculations are not official NRS acceptance; fiscal identifiers only from authenticated NRS validation response and validated mapping.
- `OpeningBalance` and imported external documents preserve original provenance and must never obtain fake platform-issued or NRS-validated status. FX adjustments independently sourced/versioned.
- `Document delivery` and `customer portal viewed` do not imply payment; `RecurringRule` due does not imply issued invoice or completed payout.
- `Preview` fixture objects map to no genuine tenant-authoritative record; no generated Prisma migrations, real provider keys or live queues until explicit backend authorisation.

## Mandatory pre-schema decision and test gate
1. Confirm Phase 1 scope: L1 business financial tracking; L2 supplier bills/reconciliation/credits; L3 accounting optional, separately approved.
2. Approve financial metric/basis vocabulary (see `FINANCIAL_METRICS_AND_EVENT_AUTHORITY.md`) and exceptions (see `FINANCIAL_EXCEPTION_LIFECYCLE.md`).
3. Map actual existing code/state/test constructs against each row; mark `present preview only / proposed / intentionally deferred`, never assume a UI card is a database entity.
4. Review tenant cross-FK tests, immutable issuance/refund conservation, concurrency/sequence lock, duplicate webhook and evidence classification, access/MFA/CSRF/rate/retention/backup/restore, import and NRS schema.
5. Only after owner issues a new explicit Phase 1 approval may Prisma migrations or real authenticated money/tax workflows be implemented.
