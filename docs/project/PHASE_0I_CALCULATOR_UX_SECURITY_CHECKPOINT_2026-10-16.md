# Phase 0I — Finance Calculator, Accessible UI, Terminology and Honest Acceptance Status

Date: 2026-10-16 | Authority: Octalve Invoice owner, this morning's corrected finance/UI requirements.
Source branch: `phase/0i-frontend-finance-workflows`.
Review branch: `review/phase-0i`. Production main is NOT touched by this checkpoint.
Owner specifically deferred **final invoice template styling** until all other selected frontend UI flows are completed.

## Source-based design
- Supplied HTML reference: `finance-calculator.html` (one-page "Clarity — Financial Calculator", loan repayment / savings goal / investment growth, responsive two-panel input/result, real-time sliders, principal-vs-return metrics, breakdown graph, projection table, reset, copy and CSV). This source is design guidance only; no Clarity logo, typography identity or unrelated branding was transplanted.
- Referenced external page: https://www.fncalculator.com/financialcalculator?type=savingsGoalCalculator . Verified navigation includes Savings Goal, Loan/Comparison, ROI, NPV/IRR, Margin/Markup, Business Forecast, Discount/Tax, percentage, finance ratios and numerous highly US-specific retirement/auto/tax services. The Octalve audience is a merchant operating in Nigeria: implement relevant general-purpose financial what-if calculations rather than silently copy US-specific tax law.
- Octalve identity: `#0064E0` brand, existing More tile, dashboard width, responsive mobile cards / desktop table, input/result panel, search/category controls, projection chart, accessible labels, export and reset.
- Route: `/dashboard/finance-calculator`. Menu entry is directly navigable via More > Finance & compliance.

## Twenty implemented calculations
Borrowing: (1) fixed-rate loan repayment/amortization, (2) loan comparison.
Savings/investment: (3) monthly savings goal, (4) investment growth with month-end contribution, (5) lump-sum compound interest, (6) Rule of 72.
Sales/pricing: (7) break-even units, (8) gross margin & markup, (9) target selling price, (10) discount and separately user-entered sales tax, (11) inclusive/exclusive sales tax split, (12) proposed two-stage invoice installment allocation.
Cash flow: (13) cash runway, (14) current working capital (listed under Cash Flow), (15) monthly cash-flow forecast, (16) payroll cost budgeting.
Business analysis: (17) ROI, (18) equal annual inflow NPV, (19) days sales outstanding, (20) straight-line depreciation.

All source formulas are pure, bounded, reject invalid/nonfinite values, and check important denominator assumptions; controls do not import customer finance data or post an event. Cashflow, loan, investment, depreciation and NPV projections create real calculated rows from user inputs; their CSV exports are safely escaped. Amounts are illustrative, not audited bank balances or tax returns. Loan terms use nominal APR/12 fixed-rate payment; no borrowing fees; savings monthly deposits at the end; investments may fall in value; outputs are estimates.
- `src/features/calculator/engine.ts`: typed definitions, input validation and model calculations.
- `src/features/calculator/FinanceCalculatorWorkspace.tsx`: responsive dashboard interface and projection interaction.
- `tests/finance-calculator.test.mjs`: all 20 default model finite values plus loan, zero interest, savings goal, ROI/NPV, markups, price, depreciation, runway, forecasts, taxes and edge cases.
- `app/(dashboard)/dashboard/finance-calculator/page.tsx`: app route.

## UI/OWASP hardening
- Scanned all 150 App & components files and 103 src typed/JS/CSS feature files for banned development-environment terminology. No occurrences found. `scripts/check-user-facing-language.cjs` now fails CI if the disallowed term is introduced in customer-facing source. Historical technical documentation and integration-specific configuration are kept intact for traceability.
- `src/features/records/components/useAccessibleDialog.ts` now supplies focus placement, Escape handling, bounded keyboard Tab/Shift+Tab and focus restoration for finance, recurring, Tax Centre, invoice communications and quotation message sheets, on desktop and mobile. Complements, does not replace, user testing and screen reader audit.
- Finance list and recurring mobile list now reuse approved `RecordMobileCard` from `RecordVisual.tsx` with optional finance-specific status/date labels (rather than duplicating full mobile card markup). Existing Invoice/Customer/Receipt display remains unchanged.
- Previous 165 browser route checks had 8 failures; six from retired Pay Tax route/tests, one from tablet tax responsive selector, one from mobile quotation old view. Updated test assumptions to new correct routes. At a later run 167/168, one remaining mobile quotation test was checking list status **after navigating to the quotation detail**; that assertion was corrected. **Only mark complete with a full green browser run at a pinned commit**, do not assume fixed code means passing.
- Browser checks now include the new Finance Calculator tab selection and margin/markup examples in addition to all prior PNG and native PDF previews and responsive routes.

## Strictly unfinished tasks / owner decisions
1. The owner has not yet supplied the distinct official dashboard logo; do not generate it.
2. The owner postponed final invoice layout and PDF/PNG theme/font fidelity. DO NOT claim it approved; separate Classic Receipt and multi-page export parity still pending.
3. Backend Phase 1 is NOT authorized. No Neon/production users, real billing, NRS, gateway callbacks, outgoing email/AI, customer portal access, persistent recurring rules, true bank-reconciliation/maker-checker or any money-writing operations.
4. Eight finance module routes are preview-first: statement, receivables, audit, approvals, credit/debit notes, communication, reconciliation, currency. Their backend-specialized workflows and some detailed layouts are NOT completed by this calculator checkpoint.
5. The remaining desktop finance tables and action-sheet markup are not fully unified with canonical RecordDirectory. This phase did reuse the canonical RecordMobileCard for eight finance lists and recurring and added shared accessible modal behaviour; more component extraction remains.
6. Customer-facing preview explanations must never be mistaken for actual issued/paid/compliant business records. Do not invent transaction history, legal tax rates or investment results.
7. No full accessibility/manual browser/device pixel-perfect signoff yet; the final invoice template remains explicitly deferred.
8. Commercial subscription proposal and free-tier rules remain proposals until the owner approves price/volume/provider fees.

## Staging and deployment
Keep daily commits in `phase/0i-frontend-finance-workflows` under Vercel auto-deployment suppression, and publish only an approved **CI-green** review batch to `review/phase-0i`, never to main. Stay on PR #2 draft for main until owner explicitly approves release. Confirm production runtime domain and authorization before any backend phase.


## 2026-10-16 — Post-audit Batch C frontend corrections
- `app/(auth)/components/SharedAuthForm.tsx` centralizes Zod/react-hook-form validation, first and last name, email, phone, secure password visibility and provider-disabled Google action. Browser submissions disclose no real account is created and do not transmit credentials.
- `app/(auth)/components/UnifiedAuthScreen.tsx` preserves Octalve's split desktop artwork and mobile headings but now mounts **exactly one** actual form instance. `app/(auth)/layout.tsx` renders the route child once (formerly twice, duplicating state and controls). `/login` and `/signup` are thin wrappers, removing legacy donor business naming/placeholder terms.
- `src/features/finance/FinanceActionSheet.tsx`: seven personalized bottom-sheet/desktop workflows: statement request, maker/checker approval request, collections follow-up, original-invoice credit/debit-note proposal, bank statement reconciliation parameters, audit investigation and currency-rate request. Inputs are validated and reviewable locally, but **nothing is persisted, issued, imported, approved or transacted**.
- Tax consolidation: `/dashboard/taxes` redirects to `/dashboard/tax-centre` instead of exposing four unrelated hardcoded and misleading rates or console-only pretend creation; the old mobile tax list instead links to Tax Centre with no assumed tax rates.
- Browser suite now asserts one DOM form per identity route and checks that valid submissions cannot enter a user session, expands coverage for password-reset/email/OTP pages, validates disabled-by-default seven finance review sheets and the retired tax route. Additional widths 320/360/430/1024 and browser/native PDF/PNG tests remain mandatory.
- **Known historical failure:** browser run `38904664698` found 6 duplicate-form counts (162/168), correctly traced to two simultaneous shared form instances. `UnifiedAuthScreen` has been rewritten as one responsive tree; confirm the final full regression before marking resolved.
- **Latest changed application code candidate:** `e8ab0ab0330e930f5051d503541f6fb5ef989c1d`. Source and browser CI must qualify a post-documentation HEAD before any review merge. No changes have been merged to main or Production as part of these Batch C fixes.

### Deferred / still pending by explicit authority
1. Final Sapphire-derived invoice presentation and custom native PDF appearance (owner postponed until the other frontend work is finished).
2. A **new official dashboard logo** (owner has not supplied its asset).
3. Authenticated storage/MFA, immutable money event model, server-approved installment posting, receipt/credit issuance, real recurring scheduler, authorization and data isolation, actual approval decision engine, bank data matching, actual NRS fiscalization, rate sources and tenant-bound customer portal; these are backend Phase 1+ and not authorized by these UI commits.
4. Final subscription price/free-tier cost model, provider-fee contract and real subscription billing remain proposals awaiting owner approval.
5. Owner visual approval of Phase 0I screens and golden design references; browser route checks prove structure and action safety, not perfect pixel matching.
