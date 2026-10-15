# OCTALVE INVOICE — PHASE 0E VISUAL APPROVAL AND DOCUMENT OUTPUT REVIEW

Continue from branch `phase/00-finzefy-authority-ui-bootstrap` in https://github.com/octalve-core/octalve-invoice (draft PR #1). Last application implementation SHA before documentation: `134b7cbf85b1d1821dde7c381d02e1bd363cfc8b`. Read MASTER_IMPLEMENTATION.md, DECISIONS.md, state.json, NUMBERING_AND_CREDIT_AUTHORITY.md, and this file. Always fetch current HEAD, CI and Vercel deployment first.

The owner-approved baseline is Finzefy desktop/mobile UI, not a new design. Phase 0E includes 50/50 composer layout, per-action coloured icon circles, mobile 12-month chart and Dashboard/Getting Started header, direct invoice row navigation, complete official Octalve software assets, in-session merchant business profile and optional per-merchant document logo, payment setup prompts, compact date/status filter modals. User must review latest Vercel Preview and screenshots before merging.

NEXT WORK:
1. Verify latest Preview is READY, inspect login/dashboard/getting started/invoice list/view/edit/create/business settings at 390, 768, 1440px, collect screenshot artifacts and compare against user refs.
2. Test merchant profile edits in Business Settings propagate to modern/ledger invoice header, bank instructions and native PDF without ever displaying Sapphire source branding. Test no merchant logo: choose Business Settings or Continue without logo. No online payment account should be simulated as connected.
3. Qualify actual native Modern/Classic Ledger PDF downloads and browser/PNG/PDF golden comparison with pinned Sapphire source (visual geometries retained, merchant identity intentionally changed).
4. Verify no unexpected page-level horizontal overflow, mobile visible 12-month chart, clickable invoice rows, action-menu isolation and compact date filters. Fix failures in coherent phase commits.
5. Run frozen pnpm install, TypeScript strict, ESLint, unit tests, Playwright browser/screenshots, CodeQL, Vercel Preview build. Update project docs with PASS/BLOCKED/NOT RUN and SHA evidence.
6. Keep Draft PR #1 unmerged and money movement/sign-up/database/NRS off. Await explicit owner visual approval; only then provide Phase 1 Next.js/Prisma/Neon secure merchant-backend prompt.
