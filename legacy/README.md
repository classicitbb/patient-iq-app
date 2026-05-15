# Legacy reference — original Express + Vanilla JS app

This folder contains the original `patient-iq-app` from
https://github.com/classicitbb/patient-iq-app at the time of import.

It is **not** wired into the build — it's kept here as a reference while the
app is incrementally re-platformed onto TanStack Start + React + the external
Supabase project (`vzbuhwjcozsvloukdfwp.supabase.co`).

Porting status:

- [x] Phase 0 — TanStack Start scaffold + Supabase client wiring
- [x] Phase 1a — Marketing page (`/`)
- [x] Phase 1b — Login page UI (`/login`) — auth wiring pending
- [ ] Phase 2 — Patient intake (`/intake/$code`)
- [ ] Phase 3 — CSR (`/csr`), Admin (`/admin`), Setup, Dev
- [ ] Phase 4 — Server functions for auth, scoring, stats
