# Finzefy Source Import Provenance
Source: octalve-core/finzefy-nextjs-frontend commit 4660eda71248266f5b97b52638f6d26429370621
Source folders: app/, components/, lib/, public/; copied exact original JPEG and SVG assets as a frozen initial visual baseline.
Copied root configs: .gitignore, components.json, next.config.ts, postcss.config.mjs, tailwind.config.ts, tsconfig.json, package.json.
Excluded: donor .git history, README, npm package-lock, repomix-output.xml.
Bootstrap adjustments: app package renamed; pnpm lockfile created; lint/typecheck/test scripts added with ESLint 9+Next 16 config.
IMPORTANT: this is *unrefactored* Finzefy donor UI. Octalve branding, approved logos/icons and native Sapphire documents are NOT YET integrated; do not claim visually qualified.

## Sapphire renderer source
Imported exact subtree src/features/invoice from commit dfd2657fc22f56c4b82808ca4072ad0300cb753c.
Vendor source is isolated; the merchant platform must never call donor localStorage persistence for issued records.
The reusable presentation/PDF/rendering modules are here; historical tests not yet requalified.
Document geometry/CSS is preserved. Product-level reset removed from donor CSS to prevent site-wide conflicts.
Placeholder demo company constants removed; signed-off snapshots and official merchant profile wiring remain future work.
