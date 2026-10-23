# Octalve Finance — Z02 verified-source frontend contract audit
Date: 22 October 2026. **Draft Review — no merge or Phase 1 authority.**
Base: main and review/phase-0i at merge commit `6bfa293ebbc29bc0c9fa4f14d2a6fd301b862a64`.

## Guiding rule
One merchant-scoped ephemeral React provider is the CURRENT frontend owner, but it is **not** a secure server of record. Document-specific changes are intentional snapshots. Merchant/customer/admin remain separate frontends with no live authorization.

## Actual ownership & changes
| Domain | Owner in source / consumers | Verified original duplicate or risk | Z02 source correction / canonical owner | Remaining tests or decisions |
| --- | --- | --- | --- | --- |
| Merchant currency | MerchantPreviewProvider.invoicePreferences.currency → invoice-preferences.ts → InvoiceComposer; quotation form used independent hardcoded NGN | Quote did not inherit currency; changing merchant defaults could diverge | New invoice inherits once; quotation modal reads same preference on initialization; USD/GBP/EUR/NGN; document-specific changes do NOT update merchant preferences | Cross-page browser choice NGN/USD, no synthetic FX rate; never retroactively convert |
| Tax | Tax Centre status, catalog's arbitrary taxPercent, invoice draft's arbitrary tax%, independent quotation 7.5% | Blanket VAT guessed, no legal evidence, no effective-date fields or mixed-line scheme | Added versioned TaxCentrePolicy in existing provider, line TaxClassification treatment/review/state/date and exact-minor proposed calculator; invoice preview refuses unreviewed treatment; quote removed 7.5% guess; catalogue quick editor chooses categories only as unverified proposals | Counsel must resolve differing official Act text versions and 2026 Gazette orders; NRS UBL code/version; no automatic eligibility or real invoice issuance |
| Customer | MerchantPreviewProvider.customers; invoice picker, quotation picker and Customer directory | Separate quick forms duplicated customer field definitions; quote used minimal fields; numeric ID by list length could collide | One QuickCustomerEditor/createQuickCustomer and snapshotCustomer; UUIDs; copied billing tax/contact/address fields; invoice-specific overrides isolated from master | Master edit/archive/restore UX across all entry points, selected customer archival guard tests, no implicit customer portal grant |
| Item/service | MerchantPreviewProvider.items; InvoiceItemsSection, ItemEditor and quotation picker | Independent add forms and unchecked tax defaults; numeric IDs; quote matched catalogue by NAME instead of stable ID | QuickItemEditor/createQuickItem and snapshotItem; stable UUIDs; invoice line has catalogItemId and independent price/description/tax snapshot; quote stores same item ID; archived entries not reselectable | Full edit/add/restore/archival UX and catalogue validation across routes |
| Payment plan | InvoiceWorkflowPanel local useState, pure installments.ts and collection-expiry.ts | Milestones lost when workflow component unmounted; mismatch with merchant collectionSetup | Typed DraftPaymentPlan owned by InvoiceDraft; new draft copies verified preference *only as proposal*; stage mode, amount shares, dates/provider/collection channel are draft-level; pure validators and exact allocation unchanged | Browser test custom two/six stages; invalid dates, provider-confirmed expiry; no account issuance in UI |
| Document tax/amounts | calculateInvoiceTotals legacy global %; preview renderer | Historical demo amounts and renderer can imply 0% when classification unknown | New calculateDraftPreviewTotals supplies explicit unassessed notice, only uses line tax proposal once reviewed; money safe-integer guards; no legal issue action | Renderer tax-row distinction and one canonical PDF output deferred Z03; do not call this official fiscal truth |
| Quotation | CreateQuotationModal embedded editor, common provider catalogues | Fake hardcoded 7.5% VAT; item chosen by name; fixed currency | Quote uses common customer/item editor, adds shared catalogue records, snapshots item ID/treatment/price and inherits merchant currency; no automatic VAT | Formal quote lifecycle, acceptance/conversion and issued PDF in Z03 |
| Archived catalogues | MerchantPreviewProvider.archivedRecords and RecordDirectory | Archived customers/items could still be selected in new documents | isCatalogArchived predicate shared by invoice picker and quotation selectors, preserves archived objects for restoration | Test route-level archive and restore; permission controls require Phase 1 |
| Customer/Admin projection | CustomerWorkspace and AdminDirectory use independent UI samples | No authoritative customer access grants, staff MFA or tenant isolation | No new store introduced; preserve preview-only boundaries | Z04 negative authorization test matrix and separately approved backend |

## Critical legal constraints
The Z01 tax research report documents materially different original 2025 Gazette vs edited 2026-hosted VAT section numbers and unresolved 2026 orders. No classification automatically confers eligibility, no implied VAT on basic goods, medical supplies or exports, and no tax registration/Tax ID or IRN fabricated.

The frontend proposed calculation is based on *reviewed line fixtures* only. Category proposals created via the UI are `needs-review`, deliberately fail closed and cannot generate an official tax liability. No provider, bank, billing, email, NRS or money-movement API was created.

## Dependency order / uncompleted Z02 work
1. Exact-source CI, CodeQL, independent browser click path on two viewport widths; preserve screenshot evidence.
2. Owner checks five-step invoice creation and quote picker visual quality (modal desktop / bottom sheet mobile).
3. Full catalogue edit/archive/restore and customer billing override tests, including uniqueness after deletes.
4. Tax Centre rule approval workflow and verified statutory version, line-level renderer parity, quantity codes and discount rounding beyond preview model — **legally blocked**.
5. Z03 document lifecycle and communication work only after a separate approval.

**Status:** in-progress. Do not mark Z02 fully complete or promote to main/Production from this document.
