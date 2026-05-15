## Situation

Your repo is now sitting inside this Lovable project as-is — it's still the original Express + SQLite + Vanilla JS app. Lovable's preview/build pipeline expects **TanStack Start + React + Vite**, so to actually build and preview here, the app needs to be re-platformed. That's a sizeable job (~3,120 lines across 8 pages, 7 server route files, custom JWT auth, multi-tenant logic, scoring engine), so I want to align on the approach before I start churning.

## Approach

**Re-platform incrementally**, keeping your original code as a reference inside the project (moved to `legacy/`) so we can port page-by-page without losing anything. Each phase ends with something visibly working in the Lovable preview.

### Phase 0 — Scaffold (this turn, if you approve)

- Move existing Express/Vanilla source into `legacy/` (reference only, not deleted).
- Initialize TanStack Start scaffolding (`src/routes/__root.tsx`, `src/routes/index.tsx`, router, Tailwind v4, `styles.css`).
- Wire your **external Supabase** (`https://vzbuhwjcozsvloukdfwp.supabase.co` + the publishable key you gave) as the data layer at `src/integrations/supabase/client.ts`.
- Port the 6 CSS files into `src/styles.css` design tokens + section styles.

### Phase 1 — Marketing + Login (validates the pipeline)

- `/` → port `marketing.js` to `src/routes/index.tsx`.
- `/login` → port `public.js` (staff PIN login) using your existing `users` table via Supabase RPC or direct query.
- Build a small `useAuth` hook + protected route wrapper backed by JWT-in-localStorage (matching your current model — option **(i)**).

### Phase 2 — Patient intake (highest-value flow)

- `/intake/$code` → port `intake.js` (the QR / in-store flow). Public, no auth.
- Wire to your Supabase `sessions` / `tenants` tables.

### Phase 3 — CSR + Admin

- `/csr` → port `csr.js` (327 lines).
- `/admin` → port `admin.js` (381 lines, biggest page).
- `/admin-login`, `/setup`, `/dev` ports follow.

### Phase 4 — Server-side logic

Anything in `server/routes/` and `server/services/` that isn't a thin wrapper around Supabase becomes a TanStack `createServerFn`:
- `services/scoring.js` and `services/stats.js` → server functions.
- `routes/auth.js` (PIN verify + JWT sign) → server function using `bcryptjs` + `jsonwebtoken` against your Supabase `users` table.
- Tenant guard / role middleware → reusable server middleware.

## What I need from you to start Phase 0

1. **Confirm the re-platform approach** (the alternative is keeping your Express stack and not using Lovable's preview/build — I'd recommend against that).
2. **Auth confirmation**: you said "4i" — confirming that means **option (i): keep custom PIN+JWT auth** against your existing `users` table in Supabase (not migrate to Supabase Auth).
3. **Tables already in Supabase**: I'll trust the schema mirrors `server/db.js` (tenants, users, sessions, emulation_log). If column names differ, point me at the live schema.
4. **Secrets**: I'll need to add `JWT_SECRET` and `JWT_REFRESH_SECRET` as Lovable secrets (currently in your `.env`). Also a Supabase **service role key** if any server function needs to bypass RLS (e.g. login lookup before JWT exists). I'll prompt for these when needed.

## Technical notes

- Your external Supabase publishable key (`sb_publishable_...`) goes in `src/integrations/supabase/client.ts` and is safe to commit.
- The service role key (if needed) and JWT secrets go through Lovable's secrets tool — never in code.
- Your scoring logic in `client/src/lib/scoring.js` and `server/services/scoring.js` looks identical-ish; I'll consolidate to one TS module.
- Multi-tenant `tenantGuard` becomes a TanStack server middleware that reads `tenant_id` from the JWT.

## Estimated effort

- Phase 0: 1 turn.
- Phase 1: 1–2 turns.
- Phase 2: 1–2 turns.
- Phase 3: 2–3 turns (admin page is dense).
- Phase 4: 1–2 turns.

Approve to kick off Phase 0, or tell me to adjust the order / skip pages you don't need ported.