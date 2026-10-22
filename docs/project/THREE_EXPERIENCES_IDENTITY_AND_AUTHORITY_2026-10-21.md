# OCTALVE FINANCE — THREE EXPERIENCES & SHARED IDENTITY CONTRACT
**Date:** 21 October 2026. **Status:** Owner-authorised architectural design and UI demonstration. **NOT Phase 1 permission.**

## Scope / repository
One Next.js 16+ App Router, React, strict TypeScript, Tailwind 4, pnpm repository: `octalve-core/octalve-invoice`.
Preserve existing merchant routes `/dashboard/**`, current financial documents, payment/NRS authorities and Phase 0I acceptance.
Expose three **different user interfaces** under `/dashboard/**` merchant, `/customer/**` customer and `/admin/**` Octalve staff. `/workspaces` is a **UI discovery screen only**, not a role switcher. Existing `/portal` stays a customer-access introduction.
The same verified person can legitimately be merchant owner/staff, customer of other merchants and (when expressly employed and approved) platform staff. Sharing identity NEVER merges roles, permissions or records.

## Proposed authoritative identity model (no schema/migration created)
- `User(id, normalizedVerifiedEmail, credential/securityState)`: one login principal for a verified mailbox; proof of mailbox control required, normalize carefully without aggressive address rewriting or auto-merging existing accounts.
- `Organization(id, merchant-ownedProfile, lifecycle)`: business-scoped records, not a login.
- `Membership(userId, organizationId, merchantRole, state)`: server-granted, revocable membership with explicit scopes.
- `CustomerParty(id, organizationId, billingIdentity)`: merchant-owned debtor/buyer record; **may exist without a User**. A matching invoice email is not an entitlement.
- `CustomerAccessGrant(userId, organizationId, customerPartyId, allowedRecordsOrScope, evidence, expiresAt, revokedAt)`: independently verified document/portal access, invite acceptance, consent/legal basis and revocation; linked records remain organization-scoped.
- `PlatformStaffMembership(userId, platformRole, approvalStatus, mfaState)`: separate Octalve employer-granted privilege, NEVER inferred from merchant ownership, email domain or UI selection.
- `SupportCase, AccessJustification, ScopedSupportGrant, SecurityAuditEvent`: case-bound staff assistance, maker/checker where appropriate, immutable evidence, expiry and merchant transparency under approved policy.
- `Session` binds a server-verified identity, issued/rotated credentials, current active context AND server-resolved permissions; switching context never changes grants.

## Access boundaries (future server enforcement, not preview controls)
| Actor | Merchant invoices | Customer portal | Octalve operations |
| --- | --- | --- | --- |
| Merchant owner | Only own organization under membership and role | Only their separately authorised customer grants | Deny |
| Merchant staff | Only allowed operations in own membership/role | Only separate authorised customer grants | Deny |
| Customer | Deny merchant accounting and financial edits | Read only explicitly granted docs, own verified payments; no forged paid status | Deny |
| Platform support | Deny default; only time-limited case-authorised minimum necessary support access | Deny default; verified case-bound read scope only | Support cases within assigned role |
| Platform billing staff | Deny merchant payments/refunds/ledgers | Deny by default | Subscriptions within assigned role, audited |
| Platform compliance reviewer | Deny default | Deny by default | Verification evidence and decisions per role, maker/checker where required |

Financial truth lives with the source-authorised ledger, not with any dashboard. A receipt does not create more cash. Provider payment status requires validated trusted events; manual bank entries require cleared-bank proof and role review. NRS IRN/QR requires official authenticated response. Tenant-bound immutable invoice snapshots cannot be edited by support staff. Existing owner rules D126–D148 and `INVOICE_RECEIPT_PAYMENT_AUTHORITY.md` remain controlling.

## Required negative authorisation tests BEFORE Phase 1 enablement
1. Unauthenticated `/customer/*` and `/admin/*` business data/API access denied; redirects must not expose protected details.
2. User with customer grant for Org A must fail access to Org B's invoices, even if emails/amounts match.
3. A merchant staff membership cannot grant owner rights, access another merchant, or reach platform operations.
4. A customer who also owns a merchant must be able to switch contexts with one verified account, without session role leakage or changed document ownership.
5. Customer record with matching email but no confirmed portal grant must be denied; invites expire, are single-use and revocable.
6. Altering URL invoice IDs, organization IDs, request bodies, session attributes or role parameters must not elevate access (IDOR/BOLA denial).
7. A platform employee with no permitted case or MFA fails merchant/customer data access; no global superuser read-through by default.
8. Support grant expires/revokes immediately, is scoped to a specific merchant/case, logs who/why/what and never permits marking paid or refunding without financial authority.
9. Cross-organization document search, export, receipts, notifications, attachments, storage paths and webhook events enforce tenant keys at service AND storage levels.
10. User email changes, duplicate invites, account linking, casefold normalization and compromised-session scenarios cannot silently merge identities or memberships.
11. Invoice paid/partial/overdue is source-derived; customer clicking pay, an admin switching status, or a success redirect cannot settle it.
12. Sensitive staff actions require step-up MFA where defined, session revocation, CSRF, idempotency and append-only audit; support audit includes declined attempts.
13. Cross-currency and reconciliation tests follow financial metrics/exception owner contract; tenant boundary must hold during batch exports and report views.
14. Verify role claims against server policy on every API read and mutation, not only page navigation, buttons or hidden menu items.

## Implementation boundaries
Current `/customer`, `/admin`, `/workspaces` pages are purely synthetic UI sketches; **NOT protected operational dashboards**. They have no backend, payment or administrative authority. For the UI preview, visibly label example data, do not mount an API or accept real credentials, and disable any issue/pay/verify/admin mutation.
Before live records, review the Session, MFA, invitation/grant, data-retention/NDPA and support access policies; approve Phase 1 separately. Prisma migrations, real auth sessions, provider/NRS connections, production activation and account provisioning are prohibited in this UI-only batch.
