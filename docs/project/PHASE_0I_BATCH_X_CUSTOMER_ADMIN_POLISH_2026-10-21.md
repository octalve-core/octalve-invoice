# PHASE 0I — BATCH X CUSTOMER / ADMIN / MERCHANT UI POLISH
21 October 2026. **Review-only. No Production promotion or Phase 1 permission.**

## Owner-reviewed defects and source corrections
- Reuse existing approved PNG `BrandWordmark` on Customer/Admin desktop and mobile headers and Workspace Selection, plus balanced merchant sidebar width (136px).
- Customer recent-invoice and upcoming-payment cards use min-width-zero wrappers, wrapping merchant names, dates and amounts so 320–390px screens are not forced sideways.
- Customer mobile bottom navigation: Overview / Invoices / Payments / Receipts / More. Admin: Overview / Merchants / Support / Subscriptions / More. Each More page lists all remaining actual interface routes, including Customer support/messages/notifications/settings/merchants and Admin customers/verifications/updates/notifications/staff/security/audit.
- Customer sample invoice details, customer support ticket list -> case detail, messages -> message detail are separate pages.
- Admin sample merchant/customer/subscription/verification/support/staff directory -> standalone detail; local filter chips; three-dot actions as desktop dialog or mobile bottom sheet; example role/assignee selection with disabled save. Every administrative mutation remains unavailable.
- Reuse global merchant `components/dashboard/TopNavbar.tsx` from the existing merchant layout instead of building a new toolbar per page. Its global search selects **routes only**; the existing `RecordDirectory` search/filter selects **records only**. No cross-state or fake transaction lookup. Merchant settings and profile allow UI-only switching through `/workspaces`.
- Test script `scripts/phase-0x-human-browser-walkthrough.cjs` starts once at `/workspaces`; all subsequent navigation uses only Playwright click/fill on UI controls/links, and inspects rendered overflow/screenshot. No database editing, direct route hops, intercepted/mocked API calls, or credential operations. Its desktop (1440), mobile (390) and narrow (320) outputs are written under `artifacts/phase-0x-walkthrough/`.

## Distinct authority remains mandatory
The three interfaces belong to the same **planned** identity architecture, not to three copies of finance. Shared email will authenticate one identity but role grants, merchant membership, document permissions and Octalve staff MFA must be checked server-side before live release. Current data is synthetic and the preview `/admin` route is not a secured administrative service. No customer grants, merchant ledger actions, provider bank verification, notification send, official NRS response, real receipts, payment settlements or issued documents are active.

## Verified and pending
- Code edits committed on isolated `phase/0i-batch-x-ux-navigation-polish-20261021`; draft PR #39 stacked on PR #38 (stacked on Batch U PR #37). Do not merge or promote until independent checks and owner approval.
- Prior QA builds on the Batch X branch were Vercel READY. After the final changes, exact-head QA Vercel READY, Node/pnpm lint/type/unit/build, CodeQL and **executed** browser-walkthrough outcomes must be rechecked before qualification claims.
- A browser-walkthrough **script existing in source** is not by itself evidence of passed browser execution. Report its actual result and screenshot archive from GitHub Actions, if available. Never infer from a Vercel build.
- `main` / Production and canonical `review/phase-0i` must remain unchanged until the owner's explicit authorisation.
