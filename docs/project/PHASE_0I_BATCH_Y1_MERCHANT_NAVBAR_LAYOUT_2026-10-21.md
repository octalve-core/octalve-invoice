# Octalve Finance — Phase 0I Batch Y.1 (merchant navbar layout)
**Date:** 21 October 2026. **Scope:** isolated visual/layout correction in stacked Review; no main/Production promotion, Phase 1 or financial authority changes.

## Root-cause evidence
The merchant `TopNavbar` was already a shared component rendered by `app/(dashboard)/layout.tsx` exactly once; it used `h-16` but lacked `shrink-0` and `min-h-16`. The sidebar logo wrapper used `h-16 shrink-0`. The merchant flex column was the scroll owner (`lg:overflow-y-auto`) with a flex-growing child page. On content-heavy routes, flex layout could contract the navbar despite its desired 64px height. Owner screenshots showed sidebar/header bottom misalignment. The preceding Batch Y shared heading component addressed visual headings, **not** navbar flex dimensions or scroll ownership.

## Narrow correction
- `components/dashboard/TopNavbar.tsx`: preserve existing search/buttons/account menu and add `min-h-16 shrink-0` alongside `h-16`.
- `app/(dashboard)/layout.tsx`: replace desktop outer-column `lg:overflow-y-auto` with `lg:overflow-hidden`, keep sidebar independent; set `main[data-merchant-scroll-region]` to `min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain`. Keep mobile header/footer and mobile scroll semantics.
- `scripts/phase-0c-browser-evidence.cjs`: migrate prior browser check from outer-column scroll to the dedicated main region. It now checks 64px sidebar/logo/header alignment, fixed navbar while content scrolls, and unchanged sidebar positioning.
- `scripts/phase-0y1-navbar-geometry.cjs`: visible user navigation from `/workspaces` through merchant sidebar/mobile bottom bar at 1024×600, 1280×768, 1440×900, 320×700, 390×780, 430×900. Geometry is read-only; scrolling uses browser wheel; output includes route-by-route header/scroll measurements and screenshots.
- `tests/merchant-fixed-navbar-layout.test.mjs`: test exact markup and evidence setup.

## Non-goals
No new navbar or sidebar. No duplicate per-page global search. Page finder only finds routes; document/payment local searches keep independent state. No logo substitutions, auth/API/DB operations, invoice issuance, provider/NRS work, or branch deletions.

## Qualification and release gate
Do not treat source assertions or Vercel build READY alone as browser-qualified. Require Node 24 frozen-pnpm lint/typecheck/tests/build, CodeQL, and actual browser screenshot/geometry evidence from the **exact source SHA** before proposing canonical Review merge. Owner visual acceptance and separate explicit Production authorization remain mandatory. Existing stacked PR #40 and earlier PRs remain unmerged until qualifying evidence.
