# Phase 0I Batch K — Premium Setup and Invoice Continuation

**Date:** 16 October 2026
**Status:** Review-ready, owner visual acceptance pending
**Exact qualified source:** `9c1d9449a1fe2513115854b42a77033a7b32d5e5`
**Review PR #12:** https://github.com/octalve-core/octalve-invoice/pull/12
**Review merge:** `99262ad1c582a01844a8d7d0ac038f161244811e`
**Vercel:** `dpl_GcSydbjmkBxwHusS9aX5R3h34T2Z`, READY on https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app
**Production:** main unchanged e01c9158616f65b4e08d5b36318b8d27aef3189b; PR #2 draft.

## Owner feedback implemented
- Rebalanced the existing Getting Started gradient, side summary and card depth with controlled shadows and smaller, shorter payment text.
- Bank transfer/payment verification/provider explanation is available via reusable accessibility-aware `SetupInfoNote`; supports pointer hover, keyboard focus, click/touch and Escape without permanently displaying long caution paragraphs. Still displays `Account not verified` and `Not connected`.
- Searchable `NigerianBankPicker`: curated named bank/fintech suggestions, input filtering, ARIA combobox/listbox/options, keyboard Up/Down/Enter/Escape, selection with parent merchant setting updates and invalidation of previous verification. It does NOT fetch the complete Nigerian financial institution directory and does NOT claim a provider-resolved account holder.
- On Getting Started Invoices step the Customize link carries `?from=getting-started`. Customize Invoices shows a contextual Back link; `Save & Continue` retains in-session settings and routes to Payments. Direct Settings open has `Save preferences` without redirect.
- Existing shared merchant profile, invoice settings controls, draft watermark and unrecorded PDF/PNG prohibition retained; no actual bank API, backend, payment or NRS activity enabled.

## Verification (qualified source)
- Phase qualification run https://github.com/octalve-core/octalve-invoice/actions/runs/38971513286 — PASS
- CodeQL run https://github.com/octalve-core/octalve-invoice/actions/runs/38971513335 — PASS
- Browser 189/189, extra 64/64 run https://github.com/octalve-core/octalve-invoice/actions/runs/38971505795 — PASS
- Screenshots https://github.com/octalve-core/octalve-invoice/actions/runs/38971505795/artifacts/12077736438
- Review-only merge differs from qualified source only by historical review documentation; independent post-merge checks will be recorded separately.

## Bank authority boundary
The user requested searchable access to all Nigerian banks. The new accessible picker is a curated preview directory **not a complete authoritative list**. Paystack's List Banks is provider-supported and may require pagination; account resolution takes a bank code, ten-digit number and SECRET_KEY on the server: https://paystack.com/docs/api/miscellaneous/ and https://paystack.com/docs/api/verification/. A separate approved Phase 1 must fetch the live provider-supported complete list, verify exact code/account/name with consent and authenticated tenancy, confirm ownership/mismatches, retain verification evidence, invalidate on edits, and apply secure provider error/rate-limit controls. Never enable a bank-only 10-digit form as trusted payment instructions without actual verified name lookup.

## Owner acceptance
Inspect Getting Started Payments and Invoices steps and invoice customization in desktop/mobile (320/360/390/430/768/1024/1440). Confirm hover/touch notes, bank search/selection, Back and Save & Continue redirect, and document watermark. Keep Phase 1, Neon, live gateway, actual NRS IRN/QR, issuance and Production unapproved.

- **Independent post-merge PASS** at `99262ad1c582a01844a8d7d0ac038f161244811e`: https://github.com/octalve-core/octalve-invoice/actions/runs/38972017716 (build/tests), https://github.com/octalve-core/octalve-invoice/actions/runs/38972017653 (CodeQL), https://github.com/octalve-core/octalve-invoice/actions/runs/38972017741 (**browser 189/189+64/64**); artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38972017741/artifacts/12077667518 . Vercel READY exact Review merge.
