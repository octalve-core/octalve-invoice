# PAYMENTS AND RECONCILIATION
## Merchant modes
A. Saved bank transfer: bank name/account number/account name saved and displayed; status manual until independent authorized bank/provider feed exists. Never promise auto-reconciliation for ordinary unconnected bank accounts.
B. Dynamic provider invoice account: invoice-specific verified provider-issued details, expiry and settlement to merchant's provider arrangement. Await webhook/requery before status changes.
C. Provider checkout link: verified URL/account details; await webhook/requery before status changes.
## Core records
PaymentProviderConnection (merchant scoped, secrets encrypted), PaymentRequest, VirtualAccount, PaymentTransaction, PaymentAllocation, WebhookEvent, ReconciliationRun, OutboxEvent, AuditEvent. Unique constraints on provider+merchant+event id / external reference. Reconcile under transactional lock. Allocation amount <= confirmed amount and consider fees, over/underpayment, refunds/reversals.
## Processing
Create provider request via server action -> store provider and internal refs -> freeze appropriate issuance/payment terms -> show bank and link/expiry in issued PDF and dynamic payment webpage -> verify signed raw webhook -> durable event inbox -> independently requery if provider requires -> confirm currency, amount, merchant, unique reference -> transactional allocation -> update derived state -> audit -> optionally issue receipt and NRS payment-status update.
## Risks
Expiry of static PDFs holding temporary account instructions; partial payments vs one-use account closure; external merchant account eligibility; credential exposure; provider webhook retry and reconciliation lags. Must produce provider capability matrix from official documentation and real test credentials before moving money. No platform custody/wallets.
