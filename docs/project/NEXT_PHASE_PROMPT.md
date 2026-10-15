# OCTALVE INVOICE — PHASE 0D FINAL ACCEPTANCE CONTINUATION

Resume from https://github.com/octalve-core/octalve-invoice branch `phase/00-finzefy-authority-ui-bootstrap`, Draft PR https://github.com/octalve-core/octalve-invoice/pull/1.
Known qualified application source: `a5a4ead60834b370e06f27e828e4b2939d8dc145`; fetch latest HEAD and CI before proceeding.

1. Verify exact official source PNGs at `public/branding/octalve-invoice-icon.png` and `octalve-wordmark.png`. If missing, ask owner to upload files supplied in chat; do not redraw, recolour, invent or accept temporary fallbacks as final.
2. Confirm favicon and all logo placements visually across signup/login/onboarding/splash/mobile header/desktop shell.
3. Inspect Vercel Preview `https://octalve-invoice-p24arn6l9-octalve-vault.vercel.app` and screenshot artifact https://github.com/octalve-core/octalve-invoice/actions/runs/38744966614. Check invoice list, View `/dashboard/invoice/1`, Edit `/dashboard/invoice/1/edit`, Create `/dashboard/invoice/create`; match desktop/mobile reference images supplied by owner.
4. Run deterministic Modern and Classic Ledger browser/PNG/native PDF golden comparison using pinned Sapphire commit dfd2657fc22f56c4b82808ca4072ad0300cb753c. Never claim PDF parity based on a successful Next.js build alone.
5. Correct any layout/reflow defects and keep all money movement, signup/session and provider operations unimplemented. Document numbering and credit-note authority already recorded in `NUMBERING_AND_CREDIT_AUTHORITY.md`; server must use atomic allocation later.
6. Record source SHA, Vercel deployment, golden screenshot approvals and PASS/BLOCKED/NOT RUN results; use coherent phase commits, protect main and obtain explicit owner visual sign-off.

Only after those acceptance gates PASS, prepare Phase 1 merchant platform: strict Prisma/Neon PostgreSQL, authenticated signup and recovery, organization isolation/RBAC, OpenAPI and secure session architecture. Request Neon Preview/DIRECT URLs via Vercel encrypted environment variables then, not before. Server-authoritative invoice issuance and payment reconciliation in later phases.
