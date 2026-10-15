# ARCHITECTURE
Single Next.js 16+ App Router at repository root; TypeScript strict; Tailwind; pnpm frozen lockfile; Node 24; Prisma; Neon PostgreSQL; protected object storage; native React-PDF. Dedicated separate Express service is NOT the V1 target.
## Source layout
```
src/
  app/
    (auth)/{signup,login,verify-email,forgot-password,reset-password,onboarding}/
    (workspace)/{dashboard,invoices,receipts,customers,items,taxes,templates,branding,settings,getting-started}/
    api/v1/
  features/
    auth/{components,sections,schemas,server,tests}/
    onboarding/{components,sections,schemas,server,tests}/
    dashboard/{components,sections,server,tests}/
    invoices/{components,sections,forms,schemas,lib,server,tests}/
    receipts/{components,sections,server,tests}/
    documents/{presentation,templates,renderers,export,golden,tests}/
    merchants/{components,sections,server,tests}/
    payments/{components,sections,server,tests}/
    taxes/{components,sections,server,tests}/
    nrs/{components,sections,server,tests}/
    customers/{components,sections,server,tests}/
  server/{auth,security,authorization,db,storage,payments/providers,nrs,jobs,audit}/
  shared/{ui,lib,types,config}/
prisma/migrations/
tests/{unit,integration,e2e,security,visual}/
docs/project/
```
Pages compose section components only; pure business logic lives outside React. Target is short cohesive files (<~250 lines where practical); split responsibility not arbitrarily by line count. All mutations gated server-side by authenticated merchant membership and per-object organization ownership. Versioned schema migrations, never startup auto-alter. Exact money integer minor units/decimal per currency. Separate invoice issuance state, payment status, fiscal state. Durable outbox, webhook inbox, idempotent transactional allocation. OpenAPI 3.1 for /api/v1 and nonproduction docs with protected test access.
## Environment
Local / Preview / Production independent auth secrets, object storage, and DB branches. Preview demonstration may bypass interactive login ONLY into clearly isolated fixture/read-only UI that has no live data access and no financial side effects. Vercel Preview includes screenshots at representative desktop and mobile viewports.
