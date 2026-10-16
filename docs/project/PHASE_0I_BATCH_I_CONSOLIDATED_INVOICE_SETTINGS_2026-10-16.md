# Phase 0I Batch I — Single Customize Invoices Settings

**Date:** 16 October 2026
**Status:** Owner Review READY; UI acceptance not implied
**Qualified app:** `72a2a947a49c41ece629fe458986ce13d07a9502`
**Review PR #10:** https://github.com/octalve-core/octalve-invoice/pull/10
**Review merge:** `6f708b03b4c103f66a5044df2804f88c8bbd5edc`
**Vercel:** `dpl_CosR1UDqVt9PndPEJy7ieYxzPT6x` READY on https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app
**Production/main:** Unchanged e01c9158616f65b4e08d5b36318b8d27aef3189b. Development PR #2 draft.

## Actual implementation
1. Canonical `/dashboard/settings/invoice` uses existing premium Theme page (left settings panels / right illustration), not a new disconnected settings system.
2. Integrated enabled Modern and Classic Ledger templates plus honest disabled gallery styles, shared colour palette/custom HEX, fonts, density, header, logo position, footer and real merchant logo where uploaded.
3. Shared new draft default currency, due period, merchant initials prefix display, payment history, reminders, optional verified-payment receipt preference; receipt automation is not active.
4. Sample preview currency and sample issue/due date use shared new-draft defaults, preview applies choices immediately. The appearance reset is narrowly scoped; no Apply button falsely implies server persistence.
5. Mandatory repeated DRAFT — NOT ISSUED watermark remains on preview paper, independent of optional theme flags. Create/edit unissued download ban unchanged.
6. Old `/dashboard/settings/theme` redirects to canonical /invoice path. Settings list contains one Customize Invoices destination; Getting Started uses it.

## Verification
- Build/typecheck/lint/source tests PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38955806842
- CodeQL PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38955806900
- Browser **189/189**, narrow viewports **64/64** PASS: https://github.com/octalve-core/octalve-invoice/actions/runs/38955799420
- Screenshot artifact: https://github.com/octalve-core/octalve-invoice/actions/runs/38955799420/artifacts/12070049528
- Exact Review merge differed from qualified application source only by historical review documentation.

## Limits and owner acceptance
Front-end session-only settings are not authenticated backend settings; draft sample is not a printable invoice, NRS fiscalization is not connected. Original Ledger/Modern invoice renderer UI and protected PDF engines remain unchanged. Review visual layout on 320/360/390/430/768/1024/1440; test selection and preferences then Create Invoice, and verify historical preview remains draft-only. No new original template/Legal artwork without owner design, no main/Production or Phase 1 activation.

- **Postmerge independent Review verification all PASSED** at `6f708b03b4c103f66a5044df2804f88c8bbd5edc`: build/TS/lint/tests https://github.com/octalve-core/octalve-invoice/actions/runs/38956348528 , CodeQL https://github.com/octalve-core/octalve-invoice/actions/runs/38956348520 , browser 189/189+64/64 https://github.com/octalve-core/octalve-invoice/actions/runs/38956348541 and screenshot artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38956348541/artifacts/12070787870 . Vercel READY exact Review merge.
