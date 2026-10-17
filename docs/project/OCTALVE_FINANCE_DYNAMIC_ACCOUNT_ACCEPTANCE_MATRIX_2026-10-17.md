# OCTALVE FINANCE — DYNAMIC ACCOUNT AND INVOICE JOURNEY ACCEPTANCE MATRIX

**17 October 2026. Review-only control checklist.** Linked spec: [Dynamic Account User Journey](./OCTALVE_FINANCE_DYNAMIC_ACCOUNT_USER_JOURNEY_AND_BATCH_PLAN_2026-10-17.md). This is not a declaration that real operations are active.

Legend: `RETAIN` = existing owner-approved requirement/code to avoid regressions; `PENDING UI` = scheduled Preview refinement; `BACKEND BLOCKED` = requires fresh explicit Phase 1 approval and provider/legal setup; `OWNER ACCEPTANCE` = needs visual/policy signoff.

| ID | Requirement / scenario | Status | Target | Evidence needed to mark DONE |
| --- | --- | --- | --- | --- |
| J01 | Existing approved branding, fixed dark desktop sidebar, five mobile tabs, Staff/Report/Tax in More | RETAIN | All | Exact code test and owner responsive screenshots |
| J02 | Existing [merchant initials]-[5+ digit sequence][suffix] including INV/RP/QUO/CR/EXP/SF | RETAIN | All | Numbering contract + invoice screenshot with actual issuer |
| J03 | Existing flexible instalment percentages 50/50, 70/30, custom and milestones | RETAIN; PENDING UI | Q | Exact kobo sum and representative split/milestone tests; do not lock to 70/30 |
| J04 | Current Getting Started canonical Business→Invoices→Payments→Tools | BATCH P REVIEW AUTOMATED PASS; OWNER VISUAL SIGN-OFF OPEN | P | Existing journey and shared settings retained; source contract + targeted 320/360/390/430/768/1024/1440/short laptop QA required; exact Review merged 1d7054e browser 189/189 +64/64 +7/7 PASS |
| J05 | Rename Flex Account description to Dynamic Account and distinguish merchant bank/gateway | BATCH P REVIEW AUTOMATED PASS; OWNER VISUAL SIGN-OFF OPEN | P | PaymentConnectionsPanel distinguishes unverified company bank, dynamic account, gateway and unavailable partner; no provider connected; exact Review merged 1d7054e browser 189/189 +64/64 +7/7 PASS |
| J06 | Monnify Dynamic Invoice vs 40min transfer, Flutterwave v3/v4, Paystack 8h matrix accurate | SPEC WRITTEN; SANDBOX OPEN | O / Phase1 | Official API documentation and real qualified provider response/contract |
| J07 | Dynamic due timestamp never exceeds **actual confirmed** account expiry; invalid issue blocked | PENDING UI; BACKEND BLOCKED | Q / Phase1 | Valid/invalid boundaries, same day time, issuer timezone and provider-shortened expiry tests |
| J08 | Each milestone uses eligible own collection intent (single-use account cannot support arbitrary partial by default) | PENDING UI; BACKEND BLOCKED | Q / Phase1 | 50/50, 70/30, 25/25/50, over/under and reversals |
| J09 | Genuine provider bank number/name never fabricated; expiry visible on issued PDF and client link | PENDING UI; BACKEND BLOCKED | R / Phase1 | Provider-enquiry/source tests, PDF freeze and no draft export |
| J10 | Customer-facing vs merchant-facing invoice = SAME immutable underlying issued record | PENDING UI; BACKEND BLOCKED | R / Phase1 | Snapshot parity, logo/business identity, PDF/print, actions test |
| J11 | Customer Check Payment/Report Transfer never manually marks provider invoice Paid | PENDING UI; BACKEND BLOCKED | R / S | Button semantics, no client spoofing, verify-only workflow |
| J12 | Only eligible company-bank cleared payment may be manually recorded after evidence and role check | RETAIN; BACKEND BLOCKED | R / S / Phase1 | Source-method permission, maker/checker, audit |
| J13 | Payment Received: initiated/pending/confirmed/expired/unmatched/refunded/payout settled, cross-provider | PENDING UI; BACKEND BLOCKED | S / Phase1 | Status taxonomy, correct financial totals and provider references |
| J14 | Provider expiry: renewed payment notice, SAME original invoice and new collection intent | SPEC WRITTEN; PENDING UI | S / Phase1 | Expired old account disabled, new reference, immutable PDF, no double issuance |
| J15 | Late transfer: returned/confirmed/unmatched investigation, proof and reconciliation, no blind Paid | SPEC WRITTEN; PENDING UI | S / Phase1 | Time-of-payment vs webhook-time, reversal, duplicate and suspense tests |
| J16 | Gross collection vs merchant payout, fees/refunds/reversals, optional receipt never new cash | SPEC WRITTEN; BACKEND BLOCKED | S / Phase1 | Money conservation/idempotency/tenant tests |
| J17 | NRS applicability, UBL payload, validated IRN/QR and partial→paid updates distinct from tax filing | SPEC WRITTEN; BACKEND BLOCKED | T / Phase1 | Official schema test, SI/APP agreement, rejection/retry evidence |
| J18 | Possible partner bank issues invoice-specific virtual accounts, NOT unlicensed corporate current account claim | PROPOSED; PARTNER REQUIRED | T / Phase1 | Bank written agreement, settlement/verification API, KYC/KYB, legal roles |
| J19 | Node24 frozen install/TS/lint/test/build, CodeQL, 189+64 browser, owner screenshot and Vercel READY | REQUIRED PER BATCH | Every batch | Run IDs, artifacts, exact SHA and visual signoff |
| J20 | Main/Production/Neon/live auth/provider/NRS/payment implementation not started | HARD BLOCK | Until owner release | Explicit approval trace before any operational phase |

### Definition of DONE per batch
A batch can be reported source-qualified only after exact source code tests; reported published only after safe PR to Review, merged-commit check and Vercel READY exact SHA. Owner visual sign-off must be reported separately from automated passes. For technical provider/bank/NRS use, mock/UI tests are NOT live proof.

### Current owner approvals recorded
- 70/30 screenshot illustrative, retain all existing percentages/milestones.
- Screenshot identity/numbering examples are not policy changes.
- Flex Account = Dynamic Account in refined UI.
- Selectable due date constrained by real selected provider expiry while Dynamic Account is chosen; prefer matching invoice/milestone due/expiry.
- Expired-transfer exception recovery policy recommended above, **subject to provider sandbox/owner technical-policy signoff**, not implemented.
- No Phase1, gateway operations, NRS submission/accreditation, production or bank partnership authorised.

### Next-action checklist
- First do **Batch P** with no backend/provider activation.
- Verify current exact branch/Review CI/Vercel and inspect existing Getting Started payment UI rather than reproducing donor designs.
- Update J04/J05 and related responsive QA with evidence, leave blocked rows blocked.
- Wait for owner to approve Batch P visuals before continuing Batch Q.

### Batch P candidate scope, 17 October 2026
- App-only source checkpoint `b2bb828d638f4e4512b2ab85c37b7be2b54c44b5` (before project-record updates): shared session-only `collectionSetup` preferences distinct from authoritative `paymentMode`, existing business bank search and unverified status retained, dynamic Monnify/Flutterwave version-aware product overview and Paystack short-term transfer restriction, gateway choices, unavailable Partner Bank; disabled provider credential preview with no actual API secrets or save.
- Existing invoice instalment planner and numbering remain unchanged; J03/J07–J18 are **not** operationally complete; Batch Q owns due-date selector. Provider capability facts are published examples, not tenant validation or due-date guarantees.
- Automated browser evidence includes 7 additional full-payment setup routes at 320/360/390/430/768/1024/1440 widths (1024+ short viewport), in addition to existing 189 core and 64 extra viewports. Qualification/run IDs and final Review SHA belong in Batch P release report.
- Owner visual inspection required: small screen card density, safe-field disabled affordance, partner-bank wording, settings return path, provider content, 320px without horizontal scroll.

### Batch P independent merged qualification
Review-only PR #19 merged `1d7054ee21d83bd2f603fd96652839aeb5ad5d49` from qualified source `d0220cf5e2c05a2235aae5ac33cc4019fc56848a`. Source Node/type/lint/tests/build [39034119068](https://github.com/octalve-core/octalve-invoice/actions/runs/39034119068) PASS, CodeQL [39034118906](https://github.com/octalve-core/octalve-invoice/actions/runs/39034118906) PASS, browser [39034118927](https://github.com/octalve-core/octalve-invoice/actions/runs/39034118927) PASS **189/189 + 64/64 + 7/7** screenshot artifact [12101786793](https://github.com/octalve-core/octalve-invoice/actions/runs/39034118927/artifacts/12101786793). Independent merged Node [39034391478](https://github.com/octalve-core/octalve-invoice/actions/runs/39034391478) PASS, CodeQL [39034391482](https://github.com/octalve-core/octalve-invoice/actions/runs/39034391482) PASS, browser [39034391498](https://github.com/octalve-core/octalve-invoice/actions/runs/39034391498) PASS **189/189 + 64/64 + 7/7**, screenshot artifact [12101642932](https://github.com/octalve-core/octalve-invoice/actions/runs/39034391498/artifacts/12101642932). Vercel `dpl_2LZkBNoFpm2d8SPpxgV8JamCq5jA` READY same SHA at stable Review alias. Main `e01c9158616f65b4e08d5b36318b8d27aef3189b` unchanged; no Production/Phase 1. Owner manual visual sign-off still open.
J03/custom splits and J07/provider-authoritative due-date guard are NOT marked complete by this Batch P; remain for Batch Q and restricted Phase 1 respectively. The 7 new viewports verify Preview UI behaviour, not payment security or owner screenshot acceptance.

### Owner corrective pass on Batch P — compact checklist and setup routes (17 October)
- **P-C01** Four-task Getting Started home at `/dashboard/getting-started`; task progress computed from entered profile and customised invoice preview; payment and App Lock cannot be falsely confirmed in Preview. **SOURCE IMPLEMENTED / OWNER REVIEW OPEN**.
- **P-C02** Payment directory lists six real provider/method names (Paystack, Flutterwave, Monnify, Dynamic Account, Bank Transfer, PayPal); each Setup opens a dedicated responsive route and Back returns; Learn setup opens focused FAQ. **SOURCE IMPLEMENTED / BROWSER EVIDENCE PENDING**.
- **P-C03** Bank name picker + NUBAN fields from canonical merchant settings; edit revokes any prior bank verification, real holder-name enquiry/ownership match required before Verify and Add Account. **FRONTEND GATE SOURCE IMPLEMENTED / BACKEND BLOCKED**.
- **P-C04** Provider-specific example credential fields (no actual keys), test/live preview display, webhook requirement, disabled Save & Verify until secure backend exists; no secret in client or browser storage. **PREVIEW SOURCE IMPLEMENTED / BACKEND BLOCKED**.
- **P-C05** Dynamic Account is a collection feature driven by verified Monnify/eligible Flutterwave connections; Paystack long-duration virtual account not claimed. Existing flexible splits, invoice due <= returned virtual account expiry, IRN/QR source and Payment Received remain unchanged and future-gated. **SPEC RETAINED / REAL CONNECTION BLOCKED**.
- **P-C06** Payment checklist completes after genuine connected/verified method only; supporting other methods later must not reset earlier verified methods. **BACKEND REQUIRED**.
- **P-C07** App Lock completion via authenticated security authority, not toggleable Preview checkbox. **BACKEND REQUIRED**.
- **P-C08** Customer-provided visual parity and end-to-end E2E at 320/360/390/430/768/1024/1440 and short laptop heights; full 189+64 route/viewport suites. **OWNER ACCEPTANCE + CI PENDING**.
