# MarineAIQ — MERN build

A MarineAIQ-inspired platform for marine engineers: a marketing site with working lead capture, an account-gated prompt library, a mock Razorpay-style checkout, and an admin dashboard.

> This is an original implementation inspired by the public marineaiq.com site. All prompt text is placeholder demo content — replace it with your own reviewed material before real use.

## What's included

| Area | Details |
| --- | --- |
| Marketing site | Hero, interactive sample troubleshooting prompt with copy-to-clipboard, services, pricing, free-prompt signup, approach, safety notice, contact form, policies |
| Accounts | Register, login, logout, httpOnly cookie sessions, free vs full-library access |
| Prompt library | Search, category/access filters, prompt detail pages, locked states with upgrade CTA |
| Checkout | Simulated Razorpay order + confirmation; unlocks the full library. No card details, no real money |
| Admin | Overview stats, prompt CRUD, lead list, order list |
| Data | MongoDB via Mongoose when `MONGO_URI` is set; otherwise a local JSON store so the app runs immediately |

## Quick start

Requires Node 18+ (tested on Node 24).

```bash
npm run install:all     # installs root + server + client dependencies
npm run dev             # API on :5000, React on :5173
```

Open <http://localhost:5173>.

Seed data is created automatically on first API start: 24 demo prompts (6 free) and an admin account.

- Admin login: `admin@marineaiq.local` / `change-me-now`
- Change this before exposing the app to anyone: copy `server/.env.example` to `server/.env`, set a long `JWT_SECRET` and a new `ADMIN_PASSWORD`, then run `npm run seed`.

## Using real MongoDB

Copy `server/.env.example` to `server/.env` and set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/marineaiq
JWT_SECRET=a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Then:

```bash
npm run seed
npm run dev
```

Without `MONGO_URI`, data lives in `server/data/db.json` (gitignored). Delete that file to reset the demo.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs API and Vite together |
| `npm run dev:server` / `npm run dev:client` | Runs one side only |
| `npm run seed` | Seeds prompts and the admin user into the active store |
| `npm run build` | Production React build into `client/dist` |
| `npm start` | Starts the API; it also serves `client/dist` if it exists |

## API

Public: `GET /api/health`, `GET /api/prompts`, `GET /api/prompts/:slug`, `POST /api/leads`, `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`.

Authenticated: `GET /api/auth/me`, `POST /api/checkout/orders`, `POST /api/checkout/orders/:id/confirm`.

Admin: `/api/admin/overview`, `/api/admin/prompts` (GET/POST/PUT/DELETE), `/api/admin/leads`, `/api/admin/orders`.

Auth uses a JWT in an httpOnly cookie. Validation is handled with Zod; rate limits protect auth, lead and general API routes.

## Moving from mock checkout to Razorpay

`server/src/controllers/checkout.controller.js` intentionally returns an order object shaped like a Razorpay order (`providerOrderId`, `amount` in cents, `currency`, `receipt`). To go live:

1. Add `razorpay` to `server/package.json` and load `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` from env.
2. Replace `createOrder` with `razorpay.orders.create({ amount, currency, receipt })`.
3. On the client, open Razorpay Checkout with the returned order id and key, then call your confirm endpoint with the payment id, order id and signature.
4. In `confirmOrder`, verify the signature server-side **before** setting `plan: 'pro'`, and record the event id for idempotency.

Never grant access based on a browser redirect alone.

## Project structure

```text
server/
  src/
    config/env.js       env loading
    db/models.js        Mongoose schemas
    data/seedPrompts.js placeholder prompt content
    store.js            MongoDB / JSON-file data adapter
    controllers/        auth, leads, prompts, checkout, admin
    middleware/         auth + errors
    routes/             API routes and rate limits
  scripts/seed.js
client/
  src/
    api.js              fetch wrapper
    context/            auth state
    components/         layout, sample prompt, lead form, route guard
    pages/              home, library, detail, auth, dashboard, checkout, admin, policies
    styles.css          design system
```

## Deploying to Vercel

`vercel.json` deploys the Express app as a single serverless function that also serves the built React app. Build command: `npm run install:all && npm run build`.

```bash
vercel            # preview deployment
vercel --prod     # production deployment
```

Set these in the Vercel project (Project Settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `JWT_SECRET` | A long random string |
| `ADMIN_PASSWORD` | Your chosen admin password |
| `CLIENT_URL` | Your Vercel URL, e.g. `https://marineaiq-mern.vercel.app` |
| `MONGO_URI` | Your MongoDB Atlas connection string — strongly recommended |

Without `MONGO_URI`, Vercel uses an ephemeral JSON file in the temp directory. It lets the site load and the health check pass, but leads, accounts and purchases **will not persist reliably** across serverless invocations. Add MongoDB Atlas before relying on the app.

## Known limits of this demo

- No email is sent; lead submissions are saved and shown in the admin dashboard.
- Payments are simulated — do not collect real card data in this build.
- Prompts are illustrative. Have a qualified marine engineer review any prompt before operational use.
- AI output must always be checked against maker manuals, class/flag rules, company procedures and risk assessment.
