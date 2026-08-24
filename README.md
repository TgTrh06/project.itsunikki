# itsunikki

Private daily tracker: tasks, habits, workouts, nutrition, and review.

## Local development

1. Copy `.env.example` to `.env` at the repository root and provide a Supabase development project URL, issuer, and public anonymous key. Both workspaces explicitly load this root file; do not commit it.
2. Start the local database: `docker compose up -d mongodb`.
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev:api`; start the web app separately: `npm run dev:web`.
5. Open `http://localhost:3000`. Configure Supabase email/password confirmation, localhost redirect URLs, and password recovery in the development project.

The Vercel preview is intentionally UI-only. It must not receive MongoDB or server-side Supabase settings, and it clearly identifies the unavailable local API.

## Validation

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Security boundary

NestJS validates the Supabase Bearer token and derives account ownership from its verified `sub` claim. Tracker records and audit events are queried with that account ID. Do not send sensitive tracker values to logs, errors, analytics, test fixtures, or Vercel previews.
