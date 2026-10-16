# OCTALVE INVOICE — NEXT CHAT ENTRY POINT (CURRENT PHASE 0I)
**Updated 16 October 2026.** This file replaces the stale Phase 0H next-step prompt. The old history remains available in the separate archived Phase 0H handoff, master implementation and decisions.

## REQUIRED FIRST READ — one authoritative, comprehensive handoff
[OCTALVE_INVOICE_PHASE_0I_NEXT_CHAT_HANDOFF_2026-10-16.md](./OCTALVE_INVOICE_PHASE_0I_NEXT_CHAT_HANDOFF_2026-10-16.md)

## One-paragraph instruction for the incoming assistant
Continue the **EXISTING** `octalve-core/octalve-invoice` app, NOT the separate Sapphire Quest project. Keep the Finzefy-derived mobile/desktop look, Octalve blue brand, canonical shared tables/mobile cards, exact invoice/payment/receipt accounting and all OWASP and NRS authority boundaries. Read the Phase 0I handoff and linked source documents; fetch latest GitHub source branch, PRs, CI runs and Vercel Review. The owner has approved developing the remaining frontend but **has not approved Phase 1/backend**. Final invoice template appearance is **deferred at owner's request**, and the owner must supply the new dashboard logo. Finish specialist UI workflows and owner visual review without claiming Preview demos perform actual email/payment/tax/portal operations. Commit to `phase/0i-frontend-finance-workflows`, qualify the full CI/browser suite and publish only one reviewed batch to `review/phase-0i`. Never merge `main`, deploy Production, provision Neon or activate financial authority without a NEW explicit owner instruction.

## Verified latest baseline
- Development source checkpoint: `1890c5d839976cce99b901765a02ab98328e852e` (Batch E finance review + recurring policy/date validation). Subsequent documentation commits do not imply new application code; always compare exact GitHub refs.
- Review Batch E published: `d791b816aae810a9575ca4cc415b7cfcc4a2ed98` via PR #6, READY at https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app .
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
- All new source passed CI and browser regression at `1890c5d839976cce99b901765a02ab98328e852e`; docs-and-code candidate `2556eca` passed separate final CI and was merged to Review only at `d791b816` (Vercel READY). Owner visual acceptance, new dashboard logo, final invoice design, subscription costs and backend approval remain open.

## Published Batch E (verified after review merge)
- Review PR: https://github.com/octalve-core/octalve-invoice/pull/6 (merged to review only).
- Vercel READY deployment: `dpl_7jcK5LgcWX4UKdrWv697joqULbL6` (review merge `d791b816`), stable alias unchanged.
- Final candidate qualification: Node24/test/build 38921320625, CodeQL 38921320650, browser 38921314940 (189+64 checks), artifact 12055770414. Public-route HTTP probing by this chat tool failed; READY and internal browser checks are confirmed, not external authenticated route tests.
- No Phase 0I main merge or backend authorization; PR #2 stays draft.


## Batch F — published and qualified (16 October 2026)
- App source: `134156955ee5bece16560a8d0346744b28457d61`; review-only PR #7 https://github.com/octalve-core/octalve-invoice/pull/7 merged at `318bb8ae1d89bf394903867c0ed6ff44cb11e3dd` into `review/phase-0i` only.
- Vercel owner-facing Preview READY: `dpl_8b2kMjhwB6ZLhb4vd9R9Z7JKp5oD`; stable https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app . Production remains not live; main e01c915 and PR #2 draft.
- Source evidence: build/tests/lint/typecheck https://github.com/octalve-core/octalve-invoice/actions/runs/38933862294 PASS; CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38933862532 PASS; 189/189 desktop/tablet/mobile and 64/64 additional responsive checks https://github.com/octalve-core/octalve-invoice/actions/runs/38933856460 PASS; PNG/PDF/screenshot artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38933856460/artifacts/12059109669 .
- UI: collapsible invoice creation/editing sections with preserved input state, single-open item controls with expand-all, draft-only installment and communications planning, zero-total guard, accurate chosen split preview, concise customer-language pass, merchant logo linkage preserved.
- Remaining: owner screenshot reviews and corrections; some specialized finance/tax/support/portal actions remain frontend proposals. Uploaded logo is not persisted across new sessions until authorized backend. Separate dashboard logo absent. Invoice-template visual fidelity redesign is deliberately next and separate. Subscription economics unapproved. No verified payment, email, NRS, receipt, recurring scheduler, secure portal or ledger enabled by this batch.

- **Post-merge exact Review checks: all PASS.** Phase qualification https://github.com/octalve-core/octalve-invoice/actions/runs/38934451095 ; CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38934451220 ; 189/189+64/64 browser https://github.com/octalve-core/octalve-invoice/actions/runs/38934451152 ; review-merge screenshot and PDF/PNG artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38934451152/artifacts/12060780726 .


## 16 October 2026 follow-up — NRS, consolidated Settings, template and export authority audit (NOT IMPLEMENTED)
- Authoritative **research proposal**, NOT owner-approved code direction: [`docs/project/PHASE_0I_NRS_SETTINGS_TEMPLATE_ISSUANCE_AUDIT_2026-10-16.md`](./PHASE_0I_NRS_SETTINGS_TEMPLATE_ISSUANCE_AUDIT_2026-10-16.md).
- Source audit established duplicated invoice settings, browser-only default template override, unrecorded draft PDF/PNG download, existing customer auto-fill of only contact fields, missing NRS Business ID/Service ID/tax-field and IRN persisted authority. Official NRS MBS references and proposed stage gates are in the audit.
- Owner requests first consolidate Settings, block unrecorded invoice downloads, align customer catalog and document snapshot, support a multi-style template gallery (Octalve Modern/Classic Ledger plus four original general styles, Legal awaiting artwork) and plan future NRS integration/IRN/QR without activating them.
- No active code or live NRS registration/deployment change was made for the audit. No additional review merge; **Batch F READY** remains latest qualified Preview. The previous restrictions on Phase 1, main, money movement, fiscalization, subscriptions and final artwork still stand. Owner decisions on draft export, Legal styling and NRS route are pending.

## Batch G — protected draft previews and canonical invoice preferences (16 October 2026)
- Source `1ab692b277adf21fc7a330b1d9b4fb1ed9877243` and Review PR #8 https://github.com/octalve-core/octalve-invoice/pull/8 merged only to `review/phase-0i` at `ec3ab3a4181ce5bf99dcc235a4742c0b3f55766e`. Vercel READY `dpl_3XhyFEbcdsPq27zAA4ziCVALUqDt` at https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app . Production/main unchanged; PR #2 draft.
- Exact source green: build/tests/typecheck/lint https://github.com/octalve-core/octalve-invoice/actions/runs/38948987174 ; CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38948987173 ; browser 189/189 +64/64 https://github.com/octalve-core/octalve-invoice/actions/runs/38948980085 ; screenshots https://github.com/octalve-core/octalve-invoice/actions/runs/38948980085/artifacts/12068170245 . **No native draft PDF/PNG smoke** because unsaved export is now prohibited by owner. Native generators remain in source for future trusted issuance qualification.
- Shared invoice preview displays prominent repeated DRAFT · NOT ISSUED across create/edit/detail papers. Unrecorded PDF/PNG controls and their on-screen delivery dialog removed. Cannot guarantee prevention of OS/browser screenshots; visible marking and future server-side authority are the enforceable product rule.
- Invoice Settings is one responsive shared preference view (currency, due period, default existing template, accent, typography, receipt preference), with no arbitrary 3.5% tax or auto-tax policy. New drafts apply defaults once. Settings and merchant logo are not persisted in a trusted account yet.
- Future work from NRS audit remains: customer tax/billing mapping, immutable issue-time snapshots, gallery original layouts incl. owner artwork, legal/NRS readiness, server-issued documents with protected downloads and official IRN. **No Phase 1, Neon, live authentication, gateway, NRS submission, paid subscription, or Production/main authorization.**


## Phase 0I Batch H — customer billing & issuance preparation (16 Oct 2026)
- **Source:** `f30b727e22358752127e6ce04e2863f745c84b82`; **Review-only PR #9:** https://github.com/octalve-core/octalve-invoice/pull/9 ; merge `a47027b29a6810dbe006a1e9a338658e3701c45f`; Vercel READY `dpl_GthKFndetXz6XMYpTksQddZtnPon` at https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app . `main` unchanged e01c915 and PR #2 draft.
- **Qualified source:** https://github.com/octalve-core/octalve-invoice/actions/runs/38951914088 Node/pnpm/TS/lint/tests/build PASS; https://github.com/octalve-core/octalve-invoice/actions/runs/38951914050 CodeQL PASS; https://github.com/octalve-core/octalve-invoice/actions/runs/38951905973 browser **189/189 +64/64 PASS**, evidence artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38951905973/artifacts/12068804114 . The independent Review-merge CI was still completing when this document was first authored.
- **Actual connected frontend:** preserve complete customer billing and registration details from Add Customer into the session master, autofill chosen customer's Tax ID/type/city/state/postal/country/contact/address on new draft, retain draft-specific changes independent of customer master. Distinct Tax ID vs company registration.
- **Snapshot proposal:** `src/features/invoices/lib/issue-snapshot-proposal.ts` copies seller, buyer, invoice lines and template/version to a detached *DRAFT_PREPARATION_ONLY* structure. It is NOT an issued or stored invoice, not verified tax classification, official IRN, QR, audit history or server authority. The backend must validate and persist a tenant-scoped immutable issue-time snapshot once approved.
- **Tax Centre:** `NrsReadinessPanel` uses shared merchant fields, shows Not connected, Tax ID not verified and no Business ID/Service ID or NRS submissions. No merchant secrets, credentials or fake fiscalization.
- **Template Settings:** responsive `InvoiceTemplateGallery` with two selectable existing renderers; five original styles are disabled, including owner-supplied Legal pending real artwork. No change to Sapphire-derived renderer or printed PDF design; draft watermark and no-download policy preserved.
- **Still pending:** owner screen review, integrated live auth/database/versioned issued snapshots, actual tax/item classification + UBL mapping, NRS provider onboarding with IRN and official QR, email/payment integrations, qualified issued PDF/PNG, original template builds, paid plan approval. No Neon or Phase 1/Production started.

- **Post-merge Review qualification: PASS**: https://github.com/octalve-core/octalve-invoice/actions/runs/38952605056 (build/tests), https://github.com/octalve-core/octalve-invoice/actions/runs/38952605046 (CodeQL), https://github.com/octalve-core/octalve-invoice/actions/runs/38952604926 (189/189+64/64 browser). Review screenshots: https://github.com/octalve-core/octalve-invoice/actions/runs/38952604926/artifacts/12068754269 . Exact merge SHA `a47027b29a6810dbe006a1e9a338658e3701c45f`, Vercel READY.
