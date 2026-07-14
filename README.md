# Grabzo — QR Table Ordering for Restaurants

Grabzo is a digital waiter for dine-in restaurants. A customer scans the QR code on their table, browses the menu on their own phone, places an order without creating an account, and watches its status update live — Received → Accepted → Preparing → Ready → Completed. The kitchen sees every order the instant it's placed on a real-time dashboard, and the owner runs the menu, tables, and staff accounts from an admin panel.

No commission-taking delivery apps, no paper menus, no shouting orders across the kitchen.

## What it does

**For customers**
- Scan a table's QR code → land on that table's menu, no app or signup required
- Browse by category, search, see live availability and estimated prep time
- Add items with a note each, add an order-level note, place the order in a few taps
- Track the order's progress in real time on a shareable link, with a live ETA
- Re-scanning the table's QR later picks the active order back up automatically

**For the kitchen**
- Live dashboard of incoming orders — table, items, notes, elapsed time
- A sound alert on every new order
- One-tap status updates (no skipping steps), adjustable time estimates
- Cancel an order (with a reason) any time before it's marked Ready

**For the owner**
- Manage categories, menu items, prices, and photos (uploaded straight to Cloudinary)
- Generate and print QR codes for each table
- A dashboard of today's order counts and revenue
- Create and deactivate staff logins; only the owner can touch menu/table/staff data

## How it works

```
Customer's phone → React app → Express API → MongoDB
                                     │
                                     └── Socket.io → Kitchen dashboard (live)
                                                   → Customer's order page (live)
```

One restaurant, one deployment — there's no multi-tenant/multi-restaurant support in this version. Prices are stored and shown in Bangladeshi Taka (৳).

## Tech stack

| | |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form + Zod, Framer Motion, Socket.io client |
| **Backend** | Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.io, JWT auth, Cloudinary |
| **Hosting** | Client → Vercel · Server → Render · Database → MongoDB Atlas · Images → Cloudinary |

## Project structure

```
Grabzo Res/
├── client/   React + Vite frontend  (see client/CLAUDE.md)
└── server/   Express API + Socket.io backend  (see server/CLAUDE.md)
```

Each has its own `package.json` — install and run them independently.

## Getting started

Prerequisites: Node.js 22+, a MongoDB instance (local or Atlas), and a Cloudinary account (optional — only needed for image uploads).

**Server**
```bash
cd server
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, etc.
npm install
npm run seed            # creates the first owner account
npm run dev              # http://localhost:4000
```

**Client**
```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to `localhost:4000`, so no client-side env vars are needed for local development.

## Deployment

The client and server deploy independently from this same repository:

- **Vercel** — root directory `client`, framework Vite. Set `VITE_API_URL` to the deployed server's URL.
- **Render** — root directory `server`, build `npm run build`, start `npm start`. Set `CLIENT_ORIGIN` to the deployed client's URL, plus `MONGODB_URI`, `JWT_SECRET`, and the `CLOUDINARY_*` keys.

See `client/.env.example` and `server/.env.example` for the full list of environment variables.

## Status

This is a working V1 demo built to pitch to a real restaurant owner — the "Grabzo" branding and seeded menu are placeholders. Delivery, online payments, and multi-restaurant support are intentionally out of scope; see `plan.md` for the full, locked feature spec.
