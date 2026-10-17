# Phase 0I Batch G — Draft Protection and Shared Invoice Settings

Date: 16 October 2026. Status: Review-only implementation qualified; owner visual approval still pending.

## Authority and scope
- App source: `1ab692b277adf21fc7a330b1d9b4fb1ed9877243`
- PR #8: https://github.com/octalve-core/octalve-invoice/pull/8, Review merge `ec3ab3a4181ce5bf99dcc235a4742c0b3f55766e`
- Vercel stable Preview READY: https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app ; deployment `dpl_3XhyFEbcdsPq27zAA4ziCVALUqDt`.
- Main unchanged at e01c9158616f65b4e08d5b36318b8d27aef3189b. PR #2 draft.

## Changes
1. Full-paper repeated DRAFT / NOT ISSUED watermark on shared create/edit/detail invoice preview, independent of appearance settings. OS screenshots cannot reliably be blocked; do not represent otherwise.
2. Unissued browser PDF/PNG downloads and missing-details bypass are absent. Existing native PDF engines remain in source, deliberately inaccessible until a trusted issued-record path is approved.
3. One shared invoice preference authority and responsive settings page. Currency and due-date defaults apply only to NEW drafts, default Modern/Ledger and theme settings apply consistently. Removed local 3.5% tax and automatic-tax control; no tax liability assumed.
4. Added typed lifecycle export eligibility test with fail-closed preview evidence. Source tests and browser checks cover visible watermarks and prohibited export controls.

## Qualification
- Node24, frozen pnpm, TypeScript, ESLint, source tests and Next build PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38948987174
- CodeQL PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38948987173
- Browser 189/189 PASS, extra viewports 64/64 PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38948980085
- Screenshot/browser evidence: https://github.com/octalve-core/octalve-invoice/actions/runs/38948980085/artifacts/12068170245
- Prior browser run 38948306041 failed because of outdated old-logo-copy assertion. Corrected and reran full suite at 1ab692, which passed.

## Owner acceptance/remaining gates
Business profile persistence and canonical tenant-backed config, saved drafts and authorized issuance, NRS credentials/ServiceID/BusinessID/IRN/official QR, tax classification, native issued PDF/PNG, email/payment integrations, immutable history, customer data snapshots and full template gallery are **not** active. Review with owner before next frontend batches; Legal and final Octalve artwork remain pending. No Production or backend approval.
