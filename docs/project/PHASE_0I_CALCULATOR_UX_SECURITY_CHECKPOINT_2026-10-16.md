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
