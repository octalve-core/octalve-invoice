# Octalve Invoice — Phase 0H release-qualification checkpoint (15 October 2026)

**Status: NOT COMPLETE, NOT OWNER APPROVED.** No main merge, production launch, Neon, live authentication, payment/receipt issuance, provider settlement or NRS submissions. Draft PR #1 remains open.

## Current application qualification
- Verified UI code commit: `666d61cf232b3cfa2457698e8904716cfa37d4a4`.
- Frozen pnpm installation, strict TypeScript, ESLint (warnings remain), source unit tests and production build: PASS, GitHub Actions `38796782591` and `38796789970`.
- CodeQL SAST: PASS, GitHub Actions `38796782597` and `38796788885`.
- Browser: PASS 111/111 responsive route screens, 37 routes × desktop (1440×900), tablet (768×1024), mobile (390×844), run `38796782601`.
- Invoice interactive coverage includes editable customer/item sheets; Add → Remove → Add item row collision regression; two independent rows, notes with missing bank details, per-template switch, mobile row sheets and guarded manual-payment route.
- PNG: BOTH Modern Invoice and Classic Ledger **actual browser-exported PNG downloads** passed PNG magic signature and dimensions assertions at the application commit; retained in run `38796782601` artifact.
- Native PDF: BOTH Modern Invoice and Classic Ledger downloaded as real PDFs, validated `%PDF-`, A4 page profile via `pdfinfo`, selectable text via `pdftotext`, then first page rasterized as separate PNG with `pdftoppm`. Classic Ledger deliberately uses uppercase customer names; text smoke test normalizes case. Same browser run evidence `38796782601`.
- On-screen browser screenshots remain artifacts for all three viewports. Note that rasterized PDF page PNGs and actual exported browser PNGs are different tests.
- Latest passing CI run: https://github.com/octalve-core/octalve-invoice/actions/runs/38796782601
- Last previously verified READY Preview at handoff: https://octalve-invoice-h2kg61ik3-octalve-vault.vercel.app (SHA `14b65b8`); **this URL alone does not certify the new PNG exporter. Revalidate latest Vercel Preview at the current branch code SHA before reporting deployment READY.**

## UI corrections applied
- Collision-free invoice draft row IDs, no sibling edits from reused keys.
- Reject conflicting refund event replays and financial minor-unit total overflow.
- Correct active shared record filters to Octalve blue.
- Correct desktop invoice prefix to merchant-derived initials consistent with mobile.
- Wire existing inherited browser PNG export adapter into Modern and Classic Ledger preview alongside their native PDF buttons, with missing merchant-details warnings. Update generated export file naming to Octalve.
- See `PAYMENT_AND_RECEIPT_PHASE0H.md` for item-by-item audit of the 12 user corrections.

## NOT formally qualified / prohibited
- NO approved Sapphire-to-Octalve browser, browser PNG and native PDF pixel-perfect image golden comparison. No owner-supplied definitive reference PNG bytes in current Library UI References folder.
- Classic Receipt A5 landscape, brand-header artwork, independent signature input and **native PDF + PNG output** not yet compared to approved receipt goldens or exposed via production issuance.
- Multi-page PDF/raster comparison, visual overflow/clipping inspection and font raster parity against owner authority not certified by the current A4 document text smoke tests.
- Per-item NRS tax, quotation conversion and image storage, real server reports, invitations, payments, receipt issuance and automatic email require later approved implementation. No background financial events or database exist.
- Explicit owner approval is required to close Phase 0 and authorize any Phase 1 activity.
