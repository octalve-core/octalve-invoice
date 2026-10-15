# UI REFERENCE REGISTER — 2026-10-15
Authoritative visual source is user-submitted screenshots in conversation. Original source frame IDs are represented here by descriptive scene identifiers. Do not redraw or replace screens by preference. Compare screenshot frame proportions, form density, spacing, typography, cards, mobile behaviour, toolbar actions. Replace green brand accents with APPROVED Octalve blue; keep semantic paid/success colour separate.
## Earlier screen batch
Desktop-01 invoice table with KPI cards, filters, pagination/action menu.
Desktop-02 create invoice three-column form, line items/payment details.
Desktop-03 invoice list+selected exact invoice preview.
Desktop-04 dashboard quick actions, receivables chart, recent transactions.
Mobile-01 Getting Started checklist and gateway selection; Paystack/Flutterwave connection.
Mobile-02 bank account save and provider setup fields.
Auth-01 desktop forgot password/check email.
Auth-02 desktop reset/new password and completion.
Auth-03 desktop email verification.
Mobile-03 dashboard expanded/collapsed chart + quick actions, transaction cards.
Mobile-04 Sales overview and create-action bottom sheet.
Mobile-05 invoice list/filter/action bottom sheets and long create form.
Mobile-06 add product/service and item-augmented invoice.
Mobile-07 customer selection/creation, resulting invoice and invoice details.
Mobile-08 taxes, tax selection, tax rates/groups/settings.
## Latest auth/onboarding batch
AuthMobile-01 splash, illustrated onboarding, signup empty/filled/loading.
AuthMobile-02 six-digit verify-email empty/filled/loading with native keyboard.
AuthMobile-03 business information logo/signature empty/filled + primary currency empty/loading.
AuthMobile-04 login empty/filled/loading.
AuthDesktop-01 side-by-side login/signup with white form area and photographic illustration panel.
## Key semantics
Desktop inherits the SAME form steps and validation as mobile even where designer supplied a mobile-only image: put flows into desktop white-space/panel area without deleting any controls. Business information and primary currency steps skippable; Getting Started must show incomplete and allow saving/editing. Persist saved profile and currency; rehydrate after reload. Live invoice form uses SAME presentation model as modern Sapphire output; second Classic Ledger. Receipt distinct. Mobile displays invoice cards, not cramped desktop tables. Recreate UI assets only from verified supplied brand and licensed sources; do not guess absent wordmark.
## Validation
Golden visual screenshots at 1440x900 desktop and 390x844 mobile (also 768 tablet). Compare reference-matches and documented approved deviations; Playwright snapshots must be attached to CI; user reviews Preview before merge.

## Owner October 15 Phase 0F correction references
- Desktop Receipt table screenshot: header/3 KPI cards, status chips, search/actions row, 7-column receipt table, and merchant-type RP references.
- Desktop Quotation screenshot: filter pills, search, export/filter/create controls, clean tabular hierarchy and type QUO references.
- Desktop Expenses screenshot: supplier/category, amount/date/payment channel/status columns and EXP reference.
- Mobile "More": compact toolbar/back, 4-across Quick Create icon circles with four distinct tones, 3-across Other Services; for desktop render larger icons in 4-across grid.
- Mobile Recent transactions: inset light-gray rounded cards, leading status-colour icons, clear name/amount, rounded reference/status pills, date/due metadata and secondary action ellipsis. Apply shared architectural pattern across desktop/mobile, with per-kind behavior rather than unrelated styling.
- Desktop Invoice Settings & Business Settings: keep approved fields, center the form and header in a constrained main column, no right-heavy empty width.
- User profile identity: no default named test person or Octalve app icon as avatar; user initials unless photo uploaded. Merchant invoice mark similarly defaults to company initials until logo is supplied.
- Log out at top-account/settings locations, preview-only confirmation.
