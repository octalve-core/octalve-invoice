# Octalve Finance — Phase 0I Batch Q
**Date:** 17 October 2026. **Working branch:** `phase/0i-batch-q-due-milestone-guard` on exact baseline `026f49774ee774726811d4387acdf60fa419c8ba`. Preview-only; no changes to actual issue/download/payment/fiscal authority.

## Implemented
1. Pure `src/features/invoices/lib/collection-expiry.ts`: Lagos local timestamp → UTC instant (Nigeria +01 year-round), strict provider-UTC parser rejecting impossible dates, exact invoice/milestone date and amount constraints. Dynamic plan requires per-milestone server-confirmed amount/provider/distinct reference/expiry and server issue time; expiry equality valid, over-expiry and expired accounts invalid. Returns `readyForIssue:false` ALWAYS in Phase 0I even if a simulated server fixture passes.
2. Existing `InvoiceMetadataSection` now includes merchant-visible due time in Africa/Lagos, default 23:59, passed to original invoice workflow and draft details; no duplicate composer or persisted authority created.
3. Existing `InvoiceWorkflowPanel`: full payment, original arbitrary two-part percentage slider (includes 50/50 and 70/30) with optional date-times, and 2–6 custom percentage milestones with optional Lagos date-times; dynamic-account planning choice and Monnify/Flutterwave product reference only. No actual account/expiry is invented. The proposed split review button stays disabled for a disconnected dynamic account. Company-bank scheduling remains a preview, not proof of payment.
4. Explicit error messages for invalid invoice due, out-of-order or post-invoice milestone, invalid percentages, missing provider returns and mismatched/short expiry; date input `max` uses only contractual invoice due date, never an invented provider max.
5. New `tests/collection-expiry.test.mjs` and additional seven responsive browser interactions under `scripts/phase-0i-viewport-evidence.cjs`, alongside all original 189 route, 64 viewport and seven Getting Started checks.

## Provider authority and safety
- A provider-confirmed expiry is per issued collection intent, not a per-provider constant. For partial payments issue separate authenticated intents when supported. Static limits are not used to silently truncate a due date.
- The frontend has **no merchant authentication**, bank verification, API credentials, webhook connection, dynamic virtual account, payment authority, secure storage, live financial ledger or NRS. Issuance, draft saving, real receipt and customer communication remain disabled. Factual provider restrictions must be qualified per contract and version in Phase 1.
- The invoice due clock time is **local Preview state only**; it is not an immutable server issuance timestamp or persisted document attribute yet. Final server validation must check due <= provider expiry at issue after provider response; event settlement and late payments belong to Batch S/Phase 1.

## Branch governance
Older phase and QA branches have no currently open PRs and appear historical. Avoid force deletion, especially `main`, `review/phase-0i` and this active Batch Q branch. Any clean-up should be based on confirmed ancestor/merge evidence, branch use and permissions. This GitHub connection permits branch creation/update but does not expose a branch-deletion operation; never claim a branch was deleted if it was not. Prefer GitHub branch-list manual cleanup once a final candidate inventory is verified.

## Acceptance and handoff
Node24/pnpm frozen install, TS, ESLint, tests, build, CodeQL; original 189+64+7 and Batch Q +7 checks; exact source and independently merged Review CI, Vercel READY; owner visual verification. **Review only.** Pending Q corrections stay separate from R invoice templates, S Payment Received and T NRS. No Phase 1/Production without explicit renewed consent.
