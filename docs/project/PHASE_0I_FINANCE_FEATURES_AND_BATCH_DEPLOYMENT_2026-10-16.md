# Octalve Invoice — Phase 0I Finance Enhancements & Batched Vercel Deployment
Date: 2026-10-16  
Status: **Owner requested UI + workflow delivery; backend financial authority NOT authorized.**  
Branch: `phase/0i-frontend-finance-workflows`  
Review branch: `review/phase-0i`; `main` remains controlled Production.

## 1. User-confirmed additional finance feature set
All eight prior recommendations are **now mandatory Phase 0I scope**, not optional future ideas. Build the responsive UI and domain/action contracts with existing Octalve component architecture before backend. Do not claim data persistence or real financial operations until explicitly authorized in the backend stage.

| Domain / screen | Desktop component contract | Mobile component contract | Financial truth / security |
| --- | --- | --- | --- |
| Statement of Account | Customer selector, date range/search/filters, summary metrics, dated invoice/payment/credit-note ledger table, PDF/export preview | Customer-style stacked cards showing date, type/reference, debit, credit, running balance; period bottom sheet; no horizontal scroll | One company/customer ledger; receipts are evidence, not extra credits; balances from issued invoices + verified allocated payments + approved adjustments; owner/staff access, portal read-only customer isolation |
| Approval Workflows | Approval queue, status/actor filters, priority cards and detailed side panel with original record, proposed change, diff/evidence, approve/reject notes and history | Invoice-list-style cards, mobile filter sheet, action confirmation sheet and history | Maker/checker for void, refund, manual-bank confirmation, credit/debit note, staff permissions and financial backdating; no self-approval, no bypass by role editing, append-only decisions |
| Receivables Ageing | KPI buckets 0–30, 31–60, 61–90, >90 days; aged invoices table by customer, due date, invoice outstanding, stage and reminders | Four compact KPI cards; customer/invoice cards grouped by overdue bucket; searchable status/time period filter | Age verified net remaining due as of date; exclude void/draft/unissued and prevent double-counting credits, refund/reversals; separate due date from fiscal tax point |
| Credit & Debit Notes | Reuse invoice detail/composer typography, precise line-level adjustments, original invoice reference, review/issue state, immutable original/adjustment preview, PDF/PNG | Existing invoice line cards and bottom action sheet, status filters and full-screen review on narrow widths | Credit notes cannot erase an invoice; debit notes create traceable increments; signed authorized adjustments, exact money/tax and NRS compliant reversal/adjustment links; verify original status |
| Communication History | Unified timeline on invoice/quote/customer detail; email/SMS/WhatsApp channel filters, composed/scheduled/queued/sent/delivered/bounced/failed/cancelled chips, detailed attempt logs | Vertical message timeline, expandable event card, compose/reminder bottom sheet and notification actions | Per-recipient consent, dedupe, idempotency, retry, quiet hours, linked document version; no fake 'sent' or 'read' without provider verification; redact PII on staff roles |
| Bank Reconciliation | Import/review queue, matching suggestions for account statement lines vs verified incoming funds, exception filters, dual-column compare and evidence links | Match/unmatched tabs, payment candidate cards, amount/reference/date display, review drawer/bottom sheet | Only cleared bank evidence under authorized manual-transfer pathway; gateway/virtual-account transactions provider-verified only; no force-paid bypass; no raw bank credentials/browser secrets |
| Audit & Exception Centre | Cross-organization activity table with event type/status/actor/time/correlation id/linked records, webhook retry/NRS/provider failures, drill-down for owner/admin | Mobile activity cards, status filters, timeline, locked evidence drawer | Append-only tenant-scoped log, before/after evidence, idempotent retries, approvals and tamper controls; never delete ledger/audit under 14-day trash rule; no secrets or full PII |
| Multi-currency (future-ready UI now) | Base currency selector, invoice currency and historic rate snapshot, home/reporting equivalent and currency filter in rows; reviewed FX source label | Compact original+functional currency amount, fx-details expandable card, no squeezed wide table | ISO 4217 currency exponents vary; integer minor units + decimal FX rate rational snapshot, no floating-point ledger; historical invoice amounts immutable; FX differences separately recorded; do not invent live exchange rates |

## 2. Source/component reuse: hard requirement
- **No alternate table system.** Desktop list/table semantics must reuse `src/features/records/components/RecordDirectory.tsx` design and the existing invoice/customer filters, header layouts, pagination, status chips, row action dropdowns and date selectors; specific columns and row actions may be extended through typed variants rather than cloning unrelated table UI.
- **Mobile:** model after `MobileInvoiceList`, `MobileCustomerList` and the responsive `RecordDirectory` card treatment, using stacked amounts, labels and status badges, not sideways scrolling. Use the same bottom-sheet component pattern for search filters, confirmation and record actions.
- **Dialogs:** responsive mobile sheets and desktop accessible dialogs, focus trap/return, Escape/cancel, destructive confirmation, loading/empty/error/success-as-reported-by-authority.
- **Shared code:** `src/features/finance/records` selectors, pure calculation libs, typed `FinancialEvent`, `ReceivableBucket`, `StatementLine`, `ApprovalDecision`, `CommunicationAttempt`, `ReconciliationMatch`, `AuditEvent`, `CurrencySnapshot`. Never store independent manually maintained 'paid' totals in the UI.
- **Financial calculation:** first-class invoice face-value, outstanding receivables, verified allocations, credit adjustments, refunds and cash collections remain separately defined. Receipt creation cannot count as revenue.
- **Integration with Phase 0I:** Invoice detail tab, user portal, part-payment scheduler, recurring income/expense, Tax Centre/NRS and Insight & Support must link to these records, without recomputing inconsistent totals.

## 3. Implementation staging, no fake backend
**Batch 0I-A — Foundation/UI fixes:** mobile report charts and Top Clients cards, mobile auth wordmark, research/golden approval. Continue shared UI primitives and typed contracts.
**Batch 0I-B — Core money/document workflows:** invoice detail shared with quotation; installment plan UI; statement of account; receivables ageing; invoice credit/debit notes; recurring income/expense.
**Batch 0I-C — Communications and customer portal:** real UI scaffolds of QR provenance, email/reminder compose + history, customer portal, notifications, grounded Insights & Support.
**Batch 0I-D — Control/compliance:** approvals, reconciliation, audit/exception, tax centre/NRS reporting and currency snapshots; Finance Calculator final UI after owner reference.
**Batch 0I-E — qualification:** 320/360/390/430 mobile, 768 tablet and 1440 desktop screenshots, screen reader/keyboard accessible dialogs, per-flow unit/model tests, both document renderers vs user goldens, native PDF/PNG parity, OWASP security verification, explicit owner approval for backend.

Ensure UI is honest about sample/in-memory state and preview-only gates. Deferred live behaviour includes actual mail/SMS sends, payment-provider webhooks, NRS tax submissions, real merchant AI context, customer-portal identity, currency feed calls, document issuance and staff money authority.

## 4. Vercel branch-controlled build policy — FIX for deployment quota
### Observed cause
Project `octalve-invoice` in Octalve Vault (Vercel team `team_048l7k9uaP1YfuEx5KaxO3dh`; project `prj_BsKnGaFpC4CNAbKffvWxbhS2SemX`) currently has GitHub integration and has deployed every Phase 0I development commit, including docs and failed intermediate builds. Vercel Hobby has **100 deployments per 86,400 seconds**; Pro publishes **6,000 per day** (check plan entitlement before any spending). An ignored-build-step skip can still count as a deployment according to official Vercel documentation and is **not** the quota fix.

### Applied safer branch policy (without disconnect)
`vercel.json`:
```json
{
  "$schema":"https://openapi.vercel.sh/vercel.json",
  "git":{
    "deploymentEnabled":{
      "phase/**":false,
      "review/**":true,
      "main":true
    }
  }
}
```
- `phase/**`: frequent code commits/PR CI/CodeQL/Playwright, **no Vercel automatic Preview per commit** once policy takes effect.
- `review/**`: owner-facing Preview batch; move/sync code **only after CI is green and a meaningful package is ready**. Expected once per milestone/batch, not every micro-fix.
- `main`: Production Git integration stays enabled, but pushes/merges require explicit owner approval and passing release checks; no future backend work without owner signoff.
- Unspecified branch patterns still default to auto-deployment in Vercel; create dev branches under `phase/` to receive suppression.
- **Do not** set `previewDeploymentsDisabled` globally, disconnect GitHub, or use legacy `github.enabled=false`, because these would interfere with reviewing approved batches. **Do not** use `github.autoJobCancelation=false`; keep queued commit cancellation available.
- Phase updates: ~3–10 meaningful commits grouped by function/component as appropriate; one review deployment after the whole functional batch passes, not a time-based guarantee. At most one release per accepted phase. No arbitrary build loops or repeated manual API deploy on top of auto Git builds.
- Prefer actual Git SHA/Preview URL verification after each batch, keep PR #2 DRAFT, and check GitHub status **before** merging/syncing review branch. If Vercel still returns quota 402, no bypass exists: wait for rolling window or separately approve paid upgrade; meanwhile CI artifact PNG/screenshots + locally served Next app are independently reviewable.
- Owner can keep one stable human-facing `review/phase-0i` branch; later named releases create `review/phase-0i-b` etc. Optionally configure a reviewed preview branch alias/domain when provider plan allows—do not invent custom DNS.
- If a project-wide settings change is ever necessary, inspect existing config first, apply the narrowest branch-specific setting, and verify project Git link remains attached.

### No-guess acceptance
1. `git.deploymentEnabled` schema and branch minimatch follow Vercel official Git Configuration.
2. After the rule is applied, verify a development phase commit creates **no new Vercel deployment**, not merely `CANCELED`.
3. A batched push to `review/phase-0i` produces one READY Preview and its expected source SHA.
4. `main` stays Git-connected with Production enabled; release awaits owner approval.
5. Count actual Vercel deployments over 24 h and link CI evidence; do not state quota fixed until observed.

## 5. References verified 2026-10-16
- Vercel plan and deployment quotas: https://vercel.com/docs/limits
- Vercel Git configuration per branch and glob patterns: https://vercel.com/docs/project-configuration/git-configuration
- Vercel Ignored Build Step cancellation quota caveat: https://vercel.com/docs/project-configuration/project-settings
- Vercel GitHub integration/review branches: https://vercel.com/docs/git
- Existing Octalve authority: `docs/project/PHASE_0I_FRONTEND_FINANCE_RESEARCH_2026-10-16.md`, `docs/project/INVOICE_RECEIPT_PAYMENT_AUTHORITY.md`, `docs/project/COMPLIANCE_NRS_NDPA.md`, `docs/project/RELEASE_CHECKLIST.md`.

## 6. Actual verification — initial batch (2026-10-16)
- The branch-specific `vercel.json` rules were committed at `c85457b337bc9d5f744baf1f2fa2026ceb135c8c`.
- Subsequent `phase/0i-frontend-finance-workflows` commits `f3f26f83...`, `1de08d3...`, `318a4fd...`, `934de366...` continued to trigger GitHub Actions but **did not create further Vercel Preview deployments** in the inspected deployment list. This demonstrates the suppression path rather than an Ignored Build Step that consumes quota.
- A deliberate `review/phase-0i` commit `9e44b875aa394c3578b8581f50f2fbb0c19c1386` produced Vercel deployment `dpl_DF14NhMLgq1UwGiVz3EmmSCeP37p`, status **READY**. Stable branch alias: https://octalve-invoice-git-review-phase-0i-octalve-vault.vercel.app . Browser GET to `/dashboard/report` and `/login` both returned HTTP **200**.
- Review deployment is derived from reviewed application source `88830a2184ca0be6fc427a99d03b96950fdca98f` plus the Vercel deployment config and a review note. The subsequent Phase 0I development branch contains additional documentation/CI-only commits and is intentionally not published for every update.
- Initial development code qualification passed TypeScript, ESLint, source tests, Next.js production build, CodeQL and existing 123/123 desktop/tablet/mobile regression before enabling batched rollout. The review version is **not Phase 0I owner-approved**.
- **Important:** future batching should use a merge or reviewed GitHub pull request from `phase/0i-frontend-finance-workflows` into `review/phase-0i` only after CI passes and the owner review package is ready. The review branch already has its own checkpoint commit; a naive forced branch reset is unnecessary and discouraged. A normal merge preserves the review history and creates exactly one intended review-branch update/deployment per batch.
- GitHub workflows now apply branch-scoped `concurrency` and `cancel-in-progress` to eliminate redundant test jobs during rapid pushes. Review branches also get qualification, CodeQL and browser regression. These cancellations save CI usage; **it is the Vercel `git.deploymentEnabled` policy that controls deployment quota**.
