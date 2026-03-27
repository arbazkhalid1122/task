## Cryptoi Frontend

`cryptoi` is a Next.js App Router frontend for the public user-facing product. It handles localized pages, authenticated user state, live updates through Socket.IO, and feed-style review and complaint surfaces.

## Setup

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

The frontend expects environment variables for backend communication:

- `NEXT_PUBLIC_API_URL`: base URL for REST API requests
- `NEXT_PUBLIC_SOCKET_URL`: base URL for Socket.IO, if different from the current origin

`NEXT_PUBLIC_API_URL` is also used on the server for SSR fetches in [`lib/server-api.ts`](./lib/server-api.ts).

### Dev vs Production mode

Mode is determined by `NODE_ENV`:

- `development` when running `npm run dev`
- `production` when running `npm run build` and `npm run start`

In production mode, the frontend now enforces secure public URLs:

- `NEXT_PUBLIC_API_URL` must use `https://` (except localhost)
- `NEXT_PUBLIC_SOCKET_URL` must use `https://` or `wss://` (except localhost)

If an insecure URL is configured in production, startup/build fails with an explicit error.

## Commands

- `npm run dev`: start local development
- `npm run build`: production build
- `npm run start`: run the production build
- `npm run lint`: run ESLint

## Structure

- `app/`: Next.js routes, layouts, and top-level providers
- `features/`: domain-oriented UI, hooks, and API clients
- `shared/`: reusable UI primitives and generic hooks
- `lib/`: cross-cutting infrastructure such as env access, API wrappers, types, and contexts
- `messages/`: locale message catalogs

## Standards

- Keep domain behavior in `features/*`; use `lib/*` for shared infrastructure, not feature-specific logic.
- Prefer typed API clients over inline `fetch` calls in components.
- Keep large interactive components thin by extracting formatting and stateful behavior into hooks, utilities, or focused child components.
- Treat server fetch failures explicitly when the page should distinguish between empty data and backend failure.

## Verification

Before shipping changes, run:

```bash
npm run lint
npx tsc --noEmit
```

## Notes

- The root route redirects to the default locale.
- Auth state is hydrated through `next-auth` plus backend cookie checks.
- Real-time updates are optional; the UI should remain usable when the socket is unavailable.

## CDN and Edge Caching

- Put `cryptoi` behind a CDN that honors origin `Cache-Control` and `Vary`.
- Anonymous HTML responses are intended to be cached at the CDN with `s-maxage=180` and `stale-while-revalidate=900`.
- Authenticated HTML responses are intentionally `private, no-store` so user state never bleeds across cache keys.
- Public API endpoints in the backend now emit explicit edge-cache headers. Endpoints with optional auth vary on `Cookie` and downgrade to `private, no-store` when auth is present.
- Versioned Next assets under `/_next/static/*` are served with `public, max-age=31536000, immutable`.
- Image derivatives under `/_next/image` are expected to be cached at the CDN with `s-maxage=86400` and `stale-while-revalidate=604800`.
- Keep CDN cache keys bounded to URL path + query string for public routes, and include cookie/auth context only where the origin already varies on it.
- Treat files in `public/` as non-immutable unless they are filename-versioned. Hashed assets should live in the Next build output or use explicit versioned filenames.
