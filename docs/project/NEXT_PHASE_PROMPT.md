# OCTALVE INVOICE — NEXT CHAT ENTRY POINT (CURRENT PHASE 0I)
**Updated 16 October 2026.** This file replaces the stale Phase 0H next-step prompt. The old history remains available in the separate archived Phase 0H handoff, master implementation and decisions.

## REQUIRED FIRST READ — one authoritative, comprehensive handoff
[OCTALVE_INVOICE_PHASE_0I_NEXT_CHAT_HANDOFF_2026-10-16.md](./OCTALVE_INVOICE_PHASE_0I_NEXT_CHAT_HANDOFF_2026-10-16.md)

## One-paragraph instruction for the incoming assistant
Continue the **EXISTING** `octalve-core/octalve-invoice` app, NOT the separate Sapphire Quest project. Keep the Finzefy-derived mobile/desktop look, Octalve blue brand, canonical shared tables/mobile cards, exact invoice/payment/receipt accounting and all OWASP and NRS authority boundaries. Read the Phase 0I handoff and linked source documents; fetch latest GitHub source branch, PRs, CI runs and Vercel Review. The owner has approved developing the remaining frontend but **has not approved Phase 1/backend**. Final invoice template appearance is **deferred at owner's request**, and the owner must supply the new dashboard logo. Finish specialist UI workflows and owner visual review without claiming Preview demos perform actual email/payment/tax/portal operations. Commit to `phase/0i-frontend-finance-workflows`, qualify the full CI/browser suite and publish only one reviewed batch to `review/phase-0i`. Never merge `main`, deploy Production, provision Neon or activate financial authority without a NEW explicit owner instruction.

## Verified latest baseline
- Development source checkpoint: `1890c5d839976cce99b901765a02ab98328e852e` (Batch E finance review + recurring policy/date validation). Subsequent documentation commits do not imply new application code; always compare exact GitHub refs.
- Review Batch D currently published: `78122f0759a096cbd6fc88d57b3034dd121124f4`, READY at https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app .
- `main` SHA: `e01c9158616f65b4e08d5b36318b8d27aef3189b`, without Phase 0I. Phase 0I PR #2 remains draft.
- Last pinned Batch E application source/build/CodeQL/browser success at `1890c5d839976cce99b901765a02ab98328e852e`:
  - Phase qualification: https://github.com/octalve-core/octalve-invoice/actions/runs/38920535188
  - CodeQL: https://github.com/octalve-core/octalve-invoice/actions/runs/38920534494
  - Browser: **189/189** core plus **64/64** extra viewport checks: https://github.com/octalve-core/octalve-invoice/actions/runs/38920526112
  - Evidence: https://github.com/octalve-core/octalve-invoice/actions/runs/38920526112/artifacts/12055190247
- Passing smoke/route tests do not establish owner-approved final invoice goldens, live payment security, real NRS compliance or Production launch.

Read the full handoff **before performing any substantive write**; it explains precisely what is finished, preview-only, deferred, prohibited and next.

## Batch E source qualification checkpoint
- Recurring calendar preview now validates true dates, month-end/leap-year anchors, inclusive cutoffs and 1–12 occurrences; captures review/tax/missed-run policies without scheduling.
- Seven specialist finance review action forms include source context and explicit future authorization checklists, without posting financial events or exporting originals.
- All new source passed CI and browser regression at `1890c5d839976cce99b901765a02ab98328e852e`; source-only Batch E is waiting for one intentional merge to `review/phase-0i` at this checkpoint. Owner visual acceptance, new dashboard logo, final invoice design, subscription costs and backend approval remain open.
