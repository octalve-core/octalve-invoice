# Octalve Invoice

Octalve Invoice is an Octalve-built merchant invoicing platform, continued from the Finzefy web product and refined using the approved Octalve Invoice brand and the Sapphire document-rendering reference.

## Authority
- **Product authority (15 October 2026):** self-service merchant sign-up; visual fidelity to Finzefy designs with Octalve-blue branding; mandatory tenant isolation, server-backed invoice/payment status and official NRS integration.
- **UI source:** `octalve-core/finzefy-nextjs-frontend` at `4660eda71248266f5b97b52638f6d26429370621`.
- **Mobile reference:** `octalve-core/finzefy_mobile` at `8447e8f67f19dbe7a8ff0eca93e0d28d62fd14d7`.
- **Backend audit reference only:** `octalve-core/finzefy-expressjs-backend` at `212f3e1f10e4ebf553e0462d213d693202aaff48`.
- **Invoice rendering source/reference:** `Octalve/sapphirequest-invoice` commit `dfd2657fc22f56c4b82808ca4072ad0300cb753c`.

This repository must have independent Git history and separate deployment, database and environment variables. Do not merge reference repository histories.

## Bootstrap status
The initial main branch contains only this authority marker. Implementation proceeds on the `phase/00-finzefy-authority-ui-bootstrap` branch. No production-readiness or live-payment claims are made by this bootstrap.

See `docs/project/` on the phase branch for architecture, reference map, security controls, payment/NRS plans, decision log and qualification state.
