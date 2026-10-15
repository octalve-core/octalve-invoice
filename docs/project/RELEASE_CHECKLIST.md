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
- **Verified Vercel Preview READY:** https://octalve-invoice-15k58ai9u-octalve-vault.vercel.app at commit `37b476ff78a60d996d5d468a4e694eac2a710339`. Vercel API identified deployment `dpl_5juwc6yMMn2CvdEHooF1JJcyDwgj` from the correct GitHub phase branch and confirmed `READY`. The live `/dashboard/invoice/create` Preview returned HTTP 200. This contains the application at verified UI commit `666d61c` plus subsequent documentation-only commits. Do not claim subsequent docs-only commits are already deployed unless their SHA is checked.
- **Deployment history:** A manual deployment attempt encountered a Vercel HTTP 402 daily API-deployment quota response (over 100/day), but a delayed **automatic GitHub-connected Preview deployment succeeded afterward**. The quota is no longer a blocker to inspecting the currently READY application, although another manual redeploy may still be restricted.


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
