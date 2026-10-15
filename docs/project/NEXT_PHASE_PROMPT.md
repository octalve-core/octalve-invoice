# OCTALVE INVOICE — PHASE 0F FINAL VISUAL AND REGRESSION REVIEW

Repository: https://github.com/octalve-core/octalve-invoice
Branch: `phase/00-finzefy-authority-ui-bootstrap`
Draft PR: #1, do not merge.
Last reviewed source before this project-control update: `2ead10693604417f9c00a72fb8b011c211fa3ee6`.
Authority: OCTALVE_INVOICE_MASTER_IMPLEMENTATION.md, DECISIONS.md, UI_REFERENCE_MAP.md, NUMBERING_AND_CREDIT_AUTHORITY.md, state.json.

First fetch current HEAD, CI and Vercel Preview URL. Do not infer passing tests or Preview deployment state from an earlier SHA.

Owner's Phase 0F acceptance references:
1. Receipt/Quotation/Expenses/Staff/Credit Note list references follow [MERCHANT_INITIALS]-[SEQUENCE][INV|RP|QUO|CR|EXP|SF]. Test Octalve Limited → OL; ensure independent type series in future DB.
2. Other Services: four columns on desktop, 3 on mobile, with four differently coloured Quick Create icons; unfinished services have Coming Soon page and Back to Overview, never 404.
3. Responsive Recent Transactions: reference mobile cards with status-specific icon circles, labels, amount, dates and menu; keep desktop clean and feature architecture shared.
4. Constrain/center Business Settings and Invoice Settings main form/header. Prefix derived from Business Settings, not arbitrary editable INV prefix.
5. User name must come from authenticated identity in backend eventually; Preview uses an editable in-session user profile and "Preview User" fallback, never "Abdulsamad" or "Unachukwu Charles". User avatar circular initials without photo; merchant invoice logo uses company initials if absent.
6. Provide logout via desktop account menu and Settings; until backend auth exists, state plainly that it exits/clears the temporary Preview only, not a server session.
7. Verify native Modern/Classic PDF merchant-initial fallback and browser/PDF parity, and all old Phase 0E acceptance requirements. No production invoice creation, email delivery, payments or refunds.
8. Run frozen pnpm install, TS strict, lint, tests including number codes, 69 expanded Playwright route checks across mobile/tablet/desktop, CodeQL, Vercel Preview. Investigate failures before declaring PASS. Download screenshots from GitHub artifacts for owner comparison.
9. Update decisions/state/test report exact verified SHA, preview URL and PASS/BLOCKED/NOT RUN. Obtain explicit user visual approval before merging or starting Phase 1 Prisma/Neon/merchant authentication.

Prompt for user after visual sign-off: "Proceed with Phase 0F visual and native PDF golden qualification only. Retrieve the latest repository/CI/Preview first. Fix documented visual discrepancies, do not merge main or begin Phase 1 until I approve screenshots and PDF output."
