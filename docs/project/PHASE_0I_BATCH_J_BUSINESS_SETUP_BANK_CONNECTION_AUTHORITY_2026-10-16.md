# Phase 0I Batch J — Business Setup & Bank Connection Authority
Date: 16 October 2026
Status: REVIEW READY / live banking verification NOT ACTIVE
Repository: octalve-core/octalve-invoice
Verified source: `0bbd24bea935ae35b37609216324396bfab175be`
Review-only merge: `9a772b9deac2e7e476ae9f75f7d40a59c4107c76` through PR #11 https://github.com/octalve-core/octalve-invoice/pull/11
Review Vercel READY: https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app ; deployment dpl_38vqkksQn8NZZJ9G38FG4jn3fKSe

## Actual frontend work
- Redirect `/dashboard/settings/business` to canonical `/dashboard/getting-started?step=business`, update Settings navigation. No separate mobile/desktop business forms.
- Getting Started four steps: Your business, Your invoices (existing Customize Invoices), Receive payments, Workspace tools. Responsive, in-session editable fields.
- Business fields: trading/legal names, industry, phone, email, website, RC, independent Tax ID, Nigeria state/city/postal/address, optional image logo/signature (PNG/JPG/WEBP <=2 MB), English & Africa/Lagos, optional invoicing method.
- Logo and signature share current merchant preview state. Preview record still NOT authenticated or persisted, no digital-certificate semantics.
- Bank account information: merchant can prepare name/number, but account holder remains **unverified**, no guessed name. For the future, current dynamic bank directory/lookup will be loaded from a trusted service only.
- `merchantPayment` now returns blank bank details unless an exact trusted-server verified bank code/account-number tuple and resolved name is present; any unverified/manual entry is suppressed on invoice. Changes in canonical form invalidate any prior verified evidence.
- Invoice payment picker disables disconnected gateways; links users to one payments setup step. Monnify, Paystack, Flutterwave and unnamed future Octalve payment connection are placeholders, not merchants connected today.
- Preserve mandatory DRAFT watermark, no unissued PDF/PNG downloads; no NRS activation.
- Changes remain in existing Octalve app; no Sapphire repo changes, no new project, no main/Production merge.

## Nigerian bank directory & validation — future authorized implementation
Research (official sources inspected):
- https://paystack.com/docs/api/miscellaneous/ : list supported Nigeria banks, pagination, codes (not a frozen six-bank dropdown)
- https://paystack.com/docs/api/verification/ : GET /bank/resolve?account_number&bank_code, returns account name and number with Bearer SECRET_KEY
- https://developers.monnify.com/docs/verification-api/verifying-your-customers : GET /api/v2/disbursements/account/validate?accountNumber&bankCode with authorized token, returns account number/name and bank code
- https://teamapt.atlassian.net/wiki/spaces/MON/pages/213909736/Get%2BBanks : provider bank list (archival, do not treat 2023 list as exhaustive today)
Both provider lists are authority for *their supported institutions*, not a legal certificate that literally every current Nigerian financial institution can be resolved. Include supported MFBs and current fintech banks; do not confuse Paystack bank code, NIP code and Monnify bank code.

Suggested server flow AFTER separate Phase 1 approval:
1. Obtain suitable provider merchant authorization and required server-secret credentials. Reconfirm pricing, limits, sandbox/live eligibility and personal-data processing contract. NEVER expose keys in client, GitHub or logs.
2. On authorized tenant-scoped GET bank directory, fetch provider's current complete paginated Nigerian list, normalize `BankChoice { provider, providerBankCode, displayName, institutionType, supportedForNameEnquiry }`, cache with refresh/expiry and fail gracefully if unavailable. UI supports search and display of supported names.
3. On the merchant's selected bank/10-digit account number, authenticated server performs name enquiry through provider; apply per-tenant/rate limits, input validation, audit controls, no public open relay.
4. Return a masked, time-bound verification result, including *actual resolved holder name* for merchant confirmation. Mismatch with registered legal/trading name must require authorized review/ownership proof; name enquiry does not itself prove legal business ownership.
5. On confirmation save separate immutable verification evidence (tenant, operator, provider, bank code, account number encrypted/masked, name, provider proof/ref/timestamp/expiry, agreement). Editing bank/code/number/company identity revokes verified status; never reuse an earlier result on another account.
6. Only verified authorized company accounts can render payment instructions on issued invoices. In frontend now, this remains fail-closed.
7. Security: deny-by-default RBAC/MFA, CSRF/Origin, server-only provider credentials, NDPA minimization, upload security, no account/name in public logs, rate limits, timeouts, idempotency, account-number masking, authorization proof, tenant-bound audit trail.

## Future connected payments/reconciliation architecture
- `MerchantPaymentConnection {tenantId,provider,merchantProviderId,mode,status,scopes,verifiedSettlementAccountRef,capabilities,activatedAt}`.
- `CollectionIntent {tenantId,invoiceId,providerConnectionId,amountMinor,currency,channel,expiresAt,providerReference,paymentLink?,virtualAccountReference?}`.
- `VerifiedPaymentEvent {tenantId,provider,uniqueEventId,providerReference,verifiedAt,amountMinor,currency,instrument,signatureStatus,processingStatus}` plus immutable ledger allocation and status updates.
- The invoice still represents money owed; a verified payment becomes ledger truth. Receipt optional or generated after confirmed payment according to merchant-approved setting. Never double count receipt.
- Company manual bank transfer: eligible manual evidence, human authorization and audit; provider-generated links/dynamic accounts: ONLY trusted provider verification marks paid.
- A dynamic virtual account may be invoice-scoped and short-lived; settlement account may differ from the merchant's own bank account. Do NOT promise identical account numbers when integrating a future Octalve fintech product.
- Monnify describes virtual/dynamic invoice accounts and collection/payment links: https://www.monnify.com/products/accept-payments/invoice ; https://monnify.com/products/accept-payments/virtual-accounts
- Moniepoint Moniebook couples merchant payments, bookkeeping, POS and reconciliation: https://www.moniepoint.com/moniebook . This supports the concept, not an authorization to copy the product design.
- Before enabling, verify provider scopes, webhook signatures/status polling, duplicate events, settlement timing/fees, refunds/chargebacks, currencies and business ownership.

## Evidence
- Source qualification Node/pnpm/TS/lint/tests/build PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38963372705
- CodeQL PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38963372754
- Browser 189/189 standard and 64/64 additional viewport PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38963367327
- Browser evidence artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38963367327/artifacts/12074470694
- Review merged PR #11 and Vercel Ready. Merge differs from qualified source only by historical review documentation.
- Independent postmerge checks to be verified separately if still running.

## Not accomplished and remaining approvals
- NO online bank list downloaded or certified complete, NO account-name enquiry API called, NO bank holder verified, NO KYC/BVN/NIN activation, NO provider credentials, NO merchant connection, NO actual payment link/virtual account, NO real reconciliation or Octalve fintech activation.
- Bank name is free-text in the preview until the authorized bank catalog service exists. The frontend cannot guarantee correct account numbers, so it refuses to issue trusted bank instructions.
- No Neon/DB provisioning, authenticated account/tenant persistence, immutable issued snapshots, actual NRS IRN/QR, PDF-issued export, or Production merge.
- Obtain separate owner authorization for Phase 1 server authentication and payment/bank verification provider connection; collect merchant/provider eligibility and agreements. Owner should inspect all Getting Started widths and correct exact business fields before final acceptance.

- **Independent Review merge CI PASS:** build/typecheck/tests https://github.com/octalve-core/octalve-invoice/actions/runs/38963994935 ; CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38963994844 ; browser 189/189+64/64 https://github.com/octalve-core/octalve-invoice/actions/runs/38963994989 , screenshots https://github.com/octalve-core/octalve-invoice/actions/runs/38963994989/artifacts/12073384434 . Exact Review merge `9a772b9deac2e7e476ae9f75f7d40a59c4107c76` remains Vercel READY.
