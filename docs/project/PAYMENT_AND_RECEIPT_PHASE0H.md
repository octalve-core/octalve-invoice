# Octalve Invoice — Phase 0H Implementation Review (15 October 2026)
Branch: `phase/00-finzefy-authority-ui-bootstrap`. No merge to main. No Neon environment variables or backend money movement.
## Owner's 12-point correction audit
| Area | Current status | Explanation / remaining qualification |
| --- | --- | --- |
| 1. Invoice-payment-receipt accounting | UI architecture implemented; live processing BLOCKED | Payment collection is separate from invoice receivable and receipt document. Gateway/dynamic provider-controlled, manual bank evidence review. Receipt automation off/generate/generate_and_email configured in UI, not executing. |
| 2. View invoice/receipt | PRESENT | Two-panel desktop history/detail, reduced mobile layout. Await pixel-by-pixel reference approval. |
| 3. Invoice customer/item selectors, dates, descriptions | PRESENT, document goldens pending | Searchable add/select customer/staff/payment sheets, product/service selection and add-new, native date inputs. Empty description omitted, notes independent of bank setup across browser/native PDF. |
| 4. Item create/edit and discount/tax defaults | PARTIAL | `/dashboard/items/add`, `/dashboard/items/[id]/edit` and catalog presets present. Item discount is imported to invoice row. Per-item tax rate is **not yet safely mapped** into the single invoice tax amount; requires NRS-aware per-line classification and exact arithmetic, no silent application. |
| 5. Quotation workflow and image | PARTIAL | Create form and document status preview exist. Image displays are illustrative only; no upload/storage; actual quotation→invoice conversion and approval rules require backend. |
| 6. Staff create/edit | PRESENT | `/dashboard/staff/create`, `/dashboard/staff/[id]/edit`. Does not grant roles or send invitations. |
| 7. Reports | PRESENT, illustrative | `/dashboard/report`; cash measures from payment projection, not receipt counts. Server-sourced ledger required. |
| 8. Profile editing | PRESENT | Settings Edit Profile routes to `/dashboard/settings/profile`; in-session only. |
| 9. Other Services responsive icons | PRESENT | Faded semantic circles and mobile sizing. Await owner visual check. |
| 10. Unnecessary Preview/Sandbox language | IMPROVED | Repetitive row/count footers removed; small transparent disclosures retained where real financial actions or downloadable unissued documents must not be misrepresented. |
| 11. Announcements/Recent Updates | PRESENT | `/dashboard/announcement` and `/dashboard/updates` use Octalve blue icon/white cards. Await owner visual check. |
| 12. Notifications | PRESENT | `/dashboard/notifications` has categories, read/unread, links, click through to settings; real financial/security alerts need backend outbox. |
## New corrections this checkpoint
- Corrected broken 111-screen qualification: invoice customer edit test now checks live document input value; manual-bank fixture test selects eligible unpaid invoice, not already-paid invoice.
- Locked invoice payment mode to invoice sample record, decoupling from editable current workspace default. Views, action sheet and manual record page enforce consistent eligibility.
- Hardened projection against conflicting replay and cumulative over-refunds with unit tests.
- Omitted blank item descriptions in both Modern and Classic Ledger HTML; notes render independently of optional merchant bank configuration in HTML and native PDF; removed repetitive UI/sandbox text from invoice draft PDF notes.
## Risks and gates
- Current test fixtures are in memory and do not persist. Server transactions must enforce merchant membership, authorization, KYC/provider status, financial-event idempotency, exact money, immutable issued PDFs and data protection.
- Real invoice issuance, manual payment approval, gateway reconciliation, receipt generation/email, tax calculation/fiscalization and image storage NOT IMPLEMENTED.
- Native PDF and browser/PNG pixel golden comparison still pending owner approval. Do not declare PDF visual sign-off from a successful TypeScript build.
- Quotation lifecycle, item tax presets, NRS resource categories, refund settlement and event-triggered notifications require backend design and official provider evidence.
## References
- https://www.zoho.com/in/invoice/help/invoice/invoice-preferences.html
- https://www.zoho.com/in/invoice/kb/payments/thank-you-note.html
- https://www.zoho.com/in/invoice/help/payment-links/
- https://www.zoho.com/en-ng/invoice/help/e-invoicing/overview.html

## Continuation checkpoint — same Phase 0H branch, 15 October 2026

### Verified source corrections this session
1. Invoice draft row Add → Remove → Add now allocates collision-free browser-side row identifiers. Previously `preview-item-(rows.length + 1)` could reuse an existing ID and patch multiple rows; now uses `crypto.randomUUID()` in the existing `InvoiceItemsSection`. Added an interactive browser assertion that independently editing two retained rows never corrupts the first.
2. Finance preview rejects replayed refunds that reuse an existing refund ID with a changed amount, status or source payment. An identical event can be retried once without inflating refunded totals. Additional minor-unit overflow checks cover aggregated invoiced/allocated/net amounts. New source tests cover both scenarios. **This remains a deterministic preview projection, not an authenticated finance or payments backend.**
3. Shared record-list active filter uses Octalve blue rather than success green; desktop Invoice Settings shows the same merchant-generated initials prefix as mobile.
4. The 37-route × three-viewport Playwright CI script now downloads both native Modern Invoice and Classic Ledger PDFs; asserts a real `%PDF-` signature, default A4 page geometry, searchable/selectable expected text including the user's revised invoice lines and notes without payment-account setup, and no stale removed descriptions; rasterizes page one of each PDF to PNG for inspection. CSS uppercase customer names in Classic Ledger are checked case-insensitively. PDF and raster output evidence is retained in the existing GitHub Actions artifact.
5. Original screenshot artifact coverage, including mobile action sheets, protected payment choice, business identity, PDF download prompts and responsive tables, remains in the branch browser runner. The automation does **not** perform golden-image pixel diff against missing external Sapphire/owner references; visual signoff remains pending.

### Audit verdict — do not conflate an implemented UI with a production feature
| Owner correction | UI/functionality on branch | Incomplete or blocked |
|---|---|---|
| 1. Accounting/payment receipts | Sample receivables vs payments vs optional receipt model; no double counting; per-issued-invoice method guard; merchant auto-receipt settings OFF/generate/generate+email | Real verified merchant ledger, idempotent receipt jobs, reconciliation, security, delivery/email |
| 2. Invoice and receipt detail | Existing two-column desktop views and mobile document layouts | Owner visual parity; Classic Receipt native PDF and signature golden |
| 3. Invoice selectors/dates/notes | Customer, salesperson, item and payment modal flows, native calendar; new duplicate-row regression guard, conditional description, notes independent of bank | Final owner screen-by-screen and PDF parity |
| 4. Item editor | Add/edit, type/category, description, price, discount and saved UI preset | Item images; per-line NRS tax mapping and exact money |
| 5. Quotations | Quotation page, create modal, non-payment statuses | Real quotation→invoice conversion and image storage |
| 6. Staff | Create/edit UI and list/action architecture | Secure member invite, MFA, RBAC |
| 7. Reports | Fixture-derived cash collection and revenue/receivables separation | Authenticated ledger and real date-filtered reporting |
| 8. Profile | Route and cross-route preview context | Durable authenticated identity |
| 9. More/Other Services | Responsive tiles/icon groups | Owner reference image visual sign-off |
| 10. Customer copy | Engineering jargon reduced; honest non-live notices retained | Owner language approval |
| 11. Announcements/updates | Present with cards and Octalve theme | Owner reference image visual sign-off and genuine publication |
| 12. Notifications | Read-state and navigation UI | Authoritative server events, durable outbox and role guards |

### Qualification conditions still open
- Native Modern + Classic Ledger **technical PDF checks** must pass at the final commit, with browser evidence artifact and a READY Preview that matches the commit. Their text/raster smoke checks are NOT pixel-perfect Sapphire golden acceptance.
- Classic Receipt A5 landscape image-first, signatures, and separate HTML/PNG/native PDF parity are NOT yet proven on Octalve screens. Native receipt download is not exposed as an issued document flow.
- No approved side-by-side visual source: older user images are referenced by `UI_REFERENCE_MAP.md` but not retrievable as pixel files in this new chat's central `02 UI References` folder (currently empty). GitHub screenshots document the current output only, not reference-perfect geometry.
- The source importer/provenance and approved templates stay intact; no Phase 1 auth/Neon/provider/NRS/money/email work is authorized.
- Keep PR #1 DRAFT; the owner has more Phase 0H corrections and has **not** approved Phase 0.
