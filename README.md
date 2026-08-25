# itsunikki

Private daily tracker: tasks, habits, workouts, nutrition, and review. The client is React + Vite; the API is NestJS.

## Local development

1. Copy `.env.example` to `.env` at the repository root and provide a Supabase development project URL, issuer, and public anonymous key. Both workspaces explicitly load this root file; do not commit it.
2. Start the local database: `docker compose up -d mongodb`.
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev:api`; start the web app separately: `npm run dev:web`.
5. Open `http://localhost:3000`. Configure Supabase email/password confirmation, localhost redirect URLs, and password recovery in the development project.

The Vercel preview is intentionally UI-only. It must not receive MongoDB or server-side Supabase settings, and it clearly identifies the unavailable local API. The SPA fallback is defined in `apps/web/vercel.json`.

## Free cloud deployment

The approved personal-data trial topology is Vercel Hobby (React SPA) -> Render Free (NestJS API) -> MongoDB Atlas M0, with Supabase Free providing authentication. See [ADR-0004](docs/adr/0004-free-cloud-deployment.md) for the security boundary, limitations, and rollback plan.

1. Create a MongoDB Atlas M0 cluster in Singapore when that free-tier region is available; otherwise choose the nearest available region. Create a dedicated database user with read/write access to the `itsunikki` database only. Atlas must allow `0.0.0.0/0` because Render Free does not provide a fixed outbound IP. Keep the generated connection string exclusively in Render.
2. Create a Render Blueprint from this repository using `render.yaml`. Use the free plan in Singapore. Set `MONGODB_URI`, `SUPABASE_JWT_ISSUER`, and `WEB_ORIGIN` as secret environment variables. Render supplies `PORT`; do not set it. The API health check is `https://<render-service>.onrender.com/v1/health`.
3. Create a Vercel Hobby project with root directory `apps/web`. The committed configuration runs `npm ci` from the monorepo root, builds the `@itsunikki/web` workspace, publishes `dist`, and rewrites SPA routes to `index.html`. Set only `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL=https://<render-service>.onrender.com/v1` for Production. Preview deployments remain UI-only and receive no API URL or server secrets.
4. After Vercel provides its production domain, update Render `WEB_ORIGIN` to that exact HTTPS origin. In Supabase Auth, set the Site URL and allowed confirmation/password-reset redirect URLs to the Vercel production domain. Do not expose a Supabase service-role key anywhere.
5. Verify signup/email confirmation/signin, invalid-token rejection, cross-account isolation, one protected CRUD path, the health endpoint, CORS from the production web origin, and a cold start after the API has slept.

This is a personal, zero-cost trial only. Render Free services sleep after inactivity, Supabase free projects can pause after inactivity, and free providers have no availability or backup guarantee. Atlas `0.0.0.0/0` is an accepted trade-off only with TLS, a strong unique database-user password, least privilege, and the URI stored solely as a Render secret. Do not upload production secrets or real data to Vercel previews.

## Validation

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Security boundary

NestJS validates the Supabase Bearer token and derives account ownership from its verified `sub` claim. Tracker records and audit events are queried with that account ID. Do not send sensitive tracker values to logs, errors, analytics, test fixtures, or Vercel previews.
