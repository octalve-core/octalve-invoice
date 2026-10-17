# OCTALVE FINANCE — PRODUCT IDENTITY AND OPEN OWNER DECISIONS

**17 October 2026. Owner-approved working customer-facing name: Octalve Finance.** Existing source and repository `octalve-core/octalve-invoice` stay unchanged. Builder/legal software company remains Octalve Limited; the merchant is independently named in its own invoices/receipts. No representation that Octalve is a licensed financial institution, tax agent or payment gateway. The separate fintech idea, if approved later, is not connected by the product name.

## Source-audited string map (Review Batch N proposed)
| Existing surface | Old customer-facing value | Scoped replacement |
| --- | --- | --- |
| `app/layout.tsx` metadata | Octalve Invoice | Octalve Finance; measured non-banking description |
| `app/(auth)/layout.tsx` metadata | Octalve Invoice · Account | Octalve Finance · Account |
| `AuthHeader`, `UnifiedAuthScreen` | Octalve Invoice welcome / artwork | Octalve Finance welcome / artwork |
| `app/(auth)/onboarding/page.tsx` | Welcome to Octalve Invoice | Welcome to Octalve Finance |
| `BrandWordmark` compact/fallback text and screen-reader caption | Octalve Invoice / Invoice application | Octalve Finance / Finance workspace. **Do not alter official PNG image or change its existing alt “Octalve”.** |
| `app/portal/page.tsx` introduction | Octalve Invoice | Octalve Finance; customer portal remains unavailable without private access |
| `settings/faqs` | Stale draft-download language; payment=earned revenue implication | Draft exports blocked; collections not necessarily recognised revenue |
| Internal repository, package, code file paths | octalve-invoice | **No rename** without separate migration decision. |
| Merchant issuer, legal identity, uploaded logo, frozen invoice/receipt snapshots | Business-supplied identity | **Never replace** with product name. |
| Functional menu and records | Invoice, Receipt, Quotation, Tax Centre | Preserve module words; changing product name does not change transaction meaning. |

Keep `#0064E0` primary, `#0052B8` hover and `#000A16` fixed desktop sidebar; preserve responsive five mobile tabs and original assets. Change only exact audited strings and requalify all route/viewport/export guards. No mass replacement.

## Open owner decisions (PROPOSED, not silently approved)
- **Financial scope:** L1 business-financial management first, L2 bills/credits/reconciliation by scope, L3 double-entry only on explicit approval.
- **Revenue/accounting:** recognition basis/timing, merchant classifications, tax applicability, expense vs asset/drawings, multi-currency and profit reporting.
- **Payment exceptions:** legal mixed channels/thresholds, manual proof/maker-checker, processor fee treatment, chargebacks/refunds and per-provider dynamic-account expiry, including renewal policies. Provider/account expiry differs from invoice due date.
- **Tax/NRS:** applicable taxpayer categories, approved integration partner and authenticated test fixtures, NRS-compatible source invoice number mapping, official QR/IRN, correction and filing rules.
- **Commercial:** first paid merchant segment, pricing/entitlements, billing provider economics; illustrated Free/Starter/Growth/Business and 25-invoice threshold are **not approved**.
- **Design:** actual different dashboard artwork and Legal/Octalve templates remain owner-provided; historical template snapshots and branding unchanged. Normal/short desktop heights and mobile owner screenshot parity still need visual sign-off.
- **Implementation:** strict prohibition on main/Production, real auth/DB/Neon, payments, NRS, customer access/email or Phase 1 until fresh authorization. Pending authoritative docs are a proposal, not implicit consent.

## External compliance comparison (verified October 2026, not a provider certification)
Official NRS MBS v1.1 references: https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn and https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema . Official API changelog notes PARTIAL status support (April 2026): https://einvoice.nrs.gov.ng/changelog . Zoho Books Nigeria has a documented Remita/NRS connected workflow: https://www.zoho.com/en-ng/books/help/e-invoicing/ . This proves competitive functionality exists; do not claim unmatched features without merchant trials.
