# Octalve Finance — Z04: three-experience authorization specification and UI

**Date:** 24 October 2026. **Stage:** Z04 initial frontend/specification implementation. Do not label Z04 fully released until the owner accepts the exact qualified release and a separate Review merge.

## Verified before this batch

- **Production \`main\`:** \`6bfa293ebbc29bc0c9fa4f14d2a6fd301b862a64\` (unchanged at inspection).
- **Canonical Review:** \`f2e63842b31767ba7d5b71256a9717b3ed33e88e\` (Z02).
- **Z03 qualified head:** \`b02eb41e9d70259f02583384dfe6095303844284\`, QA READY, PR #46 still **OPEN DRAFT** and **unmerged** when Z04 began. Prior interrupted release request did not change the repository.
- **Z04 branch:** \`phase/0i-z04-three-experience-authority-20261024\` branches from exact tested Z03. This is a **stacked** change: Z03 must be separately accepted/merged before retargeting or merging Z04 into canonical Review. No force push or Production.
- Existing \`PreviewShell\`, \`CustomerWorkspace\`, \`AdminWorkspace\`, \`RecordDirectory\`, customer support and record detail pages already fulfill much of the 320–1440 UI baseline. Reuse; do not rebuild the three experiences.

## Z04 source-of-truth and dependency matrix

| Domain | Existing baseline | This Z04 batch | Real dependency before launch |
| --- | --- | --- | --- |
| Shared identity | \`/workspaces\` UI demo; no actual role switch; \`/login\` is UI | Strictly proposed \`User\`/session matrix, denies missing/unverified/expired session | Auth service, verified email proof, session binding/revocation/step-up MFA |
| Merchant | \`/dashboard/**\`, staff directory | \`/dashboard/staff/access\`: explicit per-organization membership and role scopes. Read-only proposed checks | Server membership, tenant record ownership, finance permission enforcement |
| Customer | \`/customer/**\`, sample invoice/merchant info, no real access | \`/customer/access\`: explicit accepted merchant/party/document grant, expiry/revocation | Invite evidence, server-validated grants, signed/revocable document links, real document records |
| Platform | \`/admin/**\`, sample staff/support/billing and security | \`/admin/access\`: approved platform staff role/MFA and case-bound support conditions | Employment/role approval, support case and time-limited grant service, append-only audit |
| Separation | No live financial backend | Pure \`evaluateProposedAccess\` test matrix, **NOT middleware**; never activates account roles | Deny-by-default enforced at API, DB/storage, search/export, notifications and object access |
| Financial authority | Existing invoice/receipt/payment/NRS owner contracts | Mark paid, refund, fiscal submission and platform grant mutation **always rejected** by illustrative policy | Phase1 source-verified ledger/NRS, maker/checker and auditing |
| UI routing | Existing fixed desktop nav and mobile footer | Link existing staff/customer settings/admin security to new standalone access-readiness pages | Actual secured navigation conditional on verified server grants |
| Testing | Z02 + Z03 baseline browser checks, 84 customer/admin routes | Negative tests for tenant/party/doc forgeries, expired/revoked invite/case, absent MFA, role switching, financial mutation, and 3 journeys × 4 widths | Comprehensive integration, penetration/IDOR, server/broker and production-domain protection tests in Phase1 |

### Explicit prohibitions
Do **not** introduce or activate Prisma schema/migration, API routes, real login/account sessions, actual customer invitations, staff role writes, fictitious platform activity, email payment states, backend webhooks, real PDF/signed links or NRS submissions. The pure evaluator is a **policy example**, not a runtime protection. The three UI pages expressly state they are non-operational, and they accept no secrets or real records.

### Strict next gates
1. Node 24, frozen pnpm, TypeScript, ESLint, existing and new node:test, Next build; CodeQL.
2. Existing full browser/screenshot/mobile and P–T, Z02, Z03 suites **at exact final SHA**, then Z04 320/390/768/1440 link/navigation/responsive/browser screenshots.
3. Separate exact-SHA QA Preview READY; owner checks at 320, 390, tablet, desktop.
4. Authorised Review promotion only after Z03 is merged or its changes are included in a separately approved Review merge; Production needs separate release approval.
5. Remaining Z04 before full sign-off: exhaustive route/access/role-specific navigation matrix; independent record page scenarios, invitations expiry/revoke, support case lifecycle and negative integrated authorization specification, multi-merchant customer access, accessible mobile dialogs. The server authority checks are impossible to certify from frontend alone.

### The 14 owner-denial test cases
1. Anonymous/customer/admin data denied in operational APIs.
2. Org A customer grant cannot access Org B.
3. Merchant staff cannot own/promote or reach platform admin.
4. One verified user switching contexts cannot carry grants into a different organization.
5. Matching billing email does not grant access; invite acceptance/expiry/revocation required.
6. Forged organization/doc ID, request fields, session claims and storage URLs denied.
7. Unapproved/no MFA Octalve staff lacks support access.
8. Case-bound staff grant needs approved reason, merchant/record scope, expiry and audit.
9. Search/export/receipt/notification/file/storage must enforce tenant keys.
10. Account link/change requires explicit verified proof and revocable sessions.
11. Payment statuses cannot be changed by customer/admin or navigation.
12. Sensitive staff actions need step-up MFA, approvals, audit and idempotency.
13. Foreign currency and tenant isolation preserved in reporting.
14. Checks must occur on every server-side read/action, not CSS or a client-side redirect.

**The initial Z04 proposal/unit tests cover some negative cases directly; all 14 require future server integration tests.**
