# itsunikki

Private daily tracker: tasks, habits, workouts, nutrition, and review. The client is React + Vite; the API is NestJS.

## Local development

1. Copy `.env.example` to `.env` at the repository root and provide a Supabase development project URL, issuer, and public anonymous key. Both workspaces explicitly load this root file; do not commit it.
2. Configure a Supabase development project or local Supabase CLI stack, then set its server-only `DATABASE_URL`. Run `supabase db reset` to apply [`supabase/migrations`](supabase/migrations).
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev:api`; start the web app separately: `npm run dev:web`.
5. Open `http://localhost:3000`. Configure Supabase email/password confirmation, localhost redirect URLs, and password recovery in the development project.

The Vercel preview is intentionally UI-only. It must not receive database or server-side Supabase settings, and it clearly identifies the unavailable local API. The SPA fallback is defined in `apps/web/vercel.json`.

## Free cloud deployment

The approved personal-data trial topology is Vercel Hobby (React SPA) -> Render Free (NestJS API) -> Supabase Free (Auth and Postgres). See [ADR-0005](docs/adr/0005-supabase-postgres-tracker-storage.md) for the security boundary, limitations, and rollback plan.

1. Create a Supabase project in Singapore. Apply the repository migrations. Create a dedicated database login role for Render with only `USAGE` on schema `tracker` and CRUD on its tables; do not use the `postgres` owner. Set the role password directly in Supabase and build a Supavisor session-pooler connection string with it.
2. Create a Render Blueprint from this repository using `render.yaml`. Use the free plan in Singapore. Set `DATABASE_URL`, `SUPABASE_JWT_ISSUER`, and `WEB_ORIGIN` as secret environment variables. Render supplies `PORT`; do not set it. The API health check is `https://<render-service>.onrender.com/v1/health`.
3. Create a Vercel Hobby project with root directory `apps/web`. The committed configuration runs `npm ci` from the monorepo root, builds the `@itsunikki/web` workspace, publishes `dist`, and rewrites SPA routes to `index.html`. Set only `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL=https://<render-service>.onrender.com/v1` for Production. Preview deployments remain UI-only and receive no API URL or server secrets.
4. After Vercel provides its production domain, update Render `WEB_ORIGIN` to that exact HTTPS origin. In Supabase Auth, set the Site URL and allowed confirmation/password-reset redirect URLs to the Vercel production domain. Do not expose a Supabase service-role key anywhere.
5. Verify signup/email confirmation/signin, invalid-token rejection, cross-account isolation, one protected CRUD path, the health endpoint, CORS from the production web origin, and a cold start after the API has slept.

This is a personal, zero-cost trial only. Render Free services sleep after inactivity and Supabase free projects can pause after inactivity. Free Supabase projects do not include automatic backups or point-in-time recovery; make regular off-site logical exports before relying on real data. Do not upload production secrets or real data to Vercel previews.

## Validation

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Security boundary

NestJS validates the Supabase Bearer token and derives account ownership from its verified `sub` claim. Tracker records and audit events are queried with that account ID. Do not send sensitive tracker values to logs, errors, analytics, test fixtures, or Vercel previews.
