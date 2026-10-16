# Octalve Invoice — Batch H Customer Billing and NRS Readiness

**Date:** 16 October 2026
**Review:** Ready, awaiting owner visual approval
**Source:** `f30b727e22358752127e6ce04e2863f745c84b82`
**PR:** https://github.com/octalve-core/octalve-invoice/pull/9
**Review SHA:** `a47027b29a6810dbe006a1e9a338658e3701c45f`
**Vercel:** https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app — READY `dpl_GthKFndetXz6XMYpTksQddZtnPon`
**main:** e01c9158616f65b4e08d5b36318b8d27aef3189b unchanged, PR #2 draft

## Implementation, backed by source inspection
1. CatalogCustomer now retains customer kind, optional tax ID, company registration and ID separately, address, city, state, postal, country, preferred currency and website. AddCustomerForm collects Tax ID explicitly; page save now retains fields rather than discarding them. No server persistence.
2. InvoiceMetadataSection selecting a customer copies billing name, email, phone, address and optional tax/location fields to invoice draft. Changing those fields affects only the draft and never changes catalog state. Empty sample data remains empty.
3. Detached frozen preparation contract `src/features/invoices/lib/issue-snapshot-proposal.ts` captures seller and buyer details, requested number, template preview version and invoice lines; remains `DRAFT_PREPARATION_ONLY` with NRS status not submitted, IRN/QR null. This is not a real immutable server record.
4. NRS readiness on the existing Tax Centre tab shows populated/missing merchant identity but distinguishes provision from verification. Displays Not connected and no official IDs, server credentials, submissions or QR.
5. Invoice Settings displays only currently operating Modern and Classic Ledger as selectable; Standard, Spreadsheet, Continental, Compact and Legal are marked unavailable pending original designs/owner artwork. Merchant default remains shared with create-invoice preview.

## Evidence
- Node24 / pnpm frozen lock / typecheck / lint / tests / production build: PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38951914088
- CodeQL: PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38951914050
- Browser 189/189 and additional mobile/tablet 64/64 PASS https://github.com/octalve-core/octalve-invoice/actions/runs/38951905973
- Screenshot artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38951905973/artifacts/12068804114
- Postmerge Review Vercel Ready `a47027b29a6810dbe006a1e9a338658e3701c45f`. Merge differs from exact tested app source only by existing review-history document `docs/project/REVIEW_PHASE_0I_BATCH_A.md`.

## Unchanged security/accounting authority
Unissued invoice previews have mandatory repeated DRAFT watermark and no PDF/PNG download. Authenticated issuance, tenant isolation, number allocation, persisted immutable snapshots, signed NRS acknowledgements and original document export need explicit Phase 1 approval. Merchant-bank transfer may be manually verified with evidence in a future authorized ledger; provider and dynamic account receipts must be confirmed by trusted provider events, never manual Paid. Receipts do not double-count collections. No main or Production merge, Neon provisioning, live NRS, email or payment processing.

## Next owner review
Check new customer address/Tax ID autofill across desktop/mobile; verify NRS status remains Not connected; test gallery default selection on creating next draft; provide Legal and Octalve design references before any new renderer. A successful code test does not constitute owner's pixel-perfect acceptance.

- **Post-merge Review qualification: PASS**: https://github.com/octalve-core/octalve-invoice/actions/runs/38952605056 (build/tests), https://github.com/octalve-core/octalve-invoice/actions/runs/38952605046 (CodeQL), https://github.com/octalve-core/octalve-invoice/actions/runs/38952604926 (189/189+64/64 browser). Review screenshots: https://github.com/octalve-core/octalve-invoice/actions/runs/38952604926/artifacts/12068754269 . Exact merge SHA `a47027b29a6810dbe006a1e9a338658e3701c45f`, Vercel READY.
