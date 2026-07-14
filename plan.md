# Grabzo Restaurant — V1 Build Plan

## Product Summary

A digital waiter for a single restaurant. Customers scan a QR code at their table, browse the menu, order without an account, and watch live status updates. The kitchen receives orders instantly on a real-time dashboard. The owner manages menu, tables, and staff from an admin panel. No Foodpanda commissions, no paper menus, no manual order taking. Built as a polished demo to pitch a real restaurant owner (placeholder "Grabzo" branding, realistic seeded menu).

## Locked Decisions — do not re-litigate

| Topic | Decision |
|---|---|
| Delivery | **Not in V1.** Dine-in QR ordering only |
| Theme | Light: White / Charcoal / Warm Orange primary / Fresh Green accent. Space Grotesk headings, Inter body |
| Order flow | 5 steps: Received → Accepted → Preparing → Ready → Completed. Cannot skip. Plus **Cancelled** side-state |
| Cancellation | Kitchen/owner cancels any order before Ready, optional reason, pushed via socket. No customer self-cancel |
| Dashboard | 4 count cards (Today's Orders, Preparing, Ready, Completed Today) + Today's Revenue. No other analytics |
| Locale | BDT (৳), English UI |
| Repo | Monorepo: `client/` + `server/`, each with own package.json. Vercel deploys client/, Render deploys server/ (root dir `server`) |
| Auth | JWT. Roles: owner + staff. Owner creates/deactivates staff via Users page. Seed script creates first owner |
| No-token menu | Landing "View Menu" → browse-only; ordering requires valid QR token (`/order?t=<token>`) |
| Order tracking | Order IDs list (per table token) in localStorage + shareable `/order/:id` URL (unguessable ObjectId). A table can have multiple active orders at once; `/order/:id` shows all locally-tracked orders for that session side by side, each with its own progress steps, plus an "Order more" link back to the menu. Re-scan shows "active order" banner |
| Customization | Free-text note per cart item + one order-level note. No modifier system |
| Images | Cloudinary from day one (backend-signed uploads, WebP/resize transforms) |
| Time estimate | Initial = **max** of item prep times. Kitchen has +5 min button + editable minutes field, socket-pushed. Display "~15 min", no countdown |
| FE stack | React + Vite + TS + Tailwind + React Router + TanStack Query + React Hook Form + Zod + Framer Motion |
| BE stack | Node + Express + TS + MongoDB/Mongoose + Socket.io + JWT + Cloudinary SDK |
| Testing | Typecheck + lint every change. Light API tests: order create, status transitions, QR token lookup. No E2E |
| Deployment | Deploy to Vercel/Render/Atlas from GitHub |

## Architecture

```
Grabzo Res/
├── client/   React + Vite + TS  → Vercel
└── server/   Express + TS       → Render (MongoDB Atlas, Cloudinary)
```

Flow: Customer phone → React → Express API → MongoDB; Socket.io pushes `order:new` to kitchen and status/estimate updates back to the customer. Single restaurant, no multi-tenancy.

## Data Model (MongoDB collections)

- **users** — name, email, passwordHash, role: `owner | staff`, active
- **categories** — name, sortOrder
- **menuitems** — name, description, price (৳ integer), category ref, imageUrl, prepTimeMin, available
- **tables** — tableName, qrToken (UUID), active
- **orders** — orderNumber (daily sequence), table ref + tableName snapshot, items[{ menuItem snapshot (name, price), qty, note }], orderNote, customerName?, phone?, status, estimatedMinutes, statusHistory[{ status, at }], cancelReason?
- **settings** — singleton: restaurant name, hours, phone, address, map coords

## API Surface

```
POST   /api/auth/login
GET    /api/menu                     public (items + categories)
GET    /api/tables/resolve?t=token   public → table name
POST   /api/orders                   public (requires valid qrToken)
GET    /api/orders/:id               public (tracking)
GET    /api/orders                   staff (active + history)
PATCH  /api/orders/:id/status        staff (no-skip enforced server-side)
PATCH  /api/orders/:id/estimate      staff
CRUD   /api/admin/menu-items         owner
CRUD   /api/admin/categories         owner
CRUD   /api/admin/tables (+ POST /bulk generate N)  owner
CRUD   /api/admin/users              owner
GET    /api/admin/dashboard          staff (counts + today's revenue)
POST   /api/admin/upload-signature   owner (Cloudinary signed upload)
```

## Socket Events

- Kitchen room (auth'd): receives `order:new`, `order:status`
- Per-order room `order:<id>`: customer receives `order:status`, `order:estimate`
- Kitchen plays a sound on `order:new`

## Order Status Rules

Received → Accepted → Preparing → Ready → Completed, one step at a time, enforced in the API. Cancel allowed from Received/Accepted/Preparing (not Ready+), staff/owner only, optional reason shown to customer.

## Build Phases (in order)

1. **Landing page** — one-pager: Hero (vertically centered) → Featured Dishes (live from API) → Why Us/About → Testimonials (3 static) → Contact + Google Map + hours → Footer. *Done when: impressive on a phone, LCP < 2s.*
2. **QR menu page** — `/order?t=token` resolves table, shows "Ordering from Table 5"; categories, search, availability; browse-only without token. *Done when: token resolves and menu renders from DB.*
3. **Cart + place order** — qty, per-item notes, order note, optional name/phone, confirm. *Done when: order lands in DB with correct totals, max 3 taps happy-path.*
4. **Kitchen dashboard** — login, real-time cards (order #, table, items, notes, time, elapsed), status buttons, sound, newest first, completed → history. *Done when: order placed on phone appears instantly on laptop.*
5. **Live order status** — `/order/:id` progress bar, estimate, socket updates, no refresh; localStorage re-entry banner. *Done when: kitchen tap updates customer screen in <1s.*
6. **QR table management** — tables list, create, bulk generate N, QR preview, printable page (logo + table + QR + "Scan to Order"), Open / Delete. *Done when: printed QR scanned by a real phone opens the right table.*
7. **Menu + category admin** — CRUD, Cloudinary image upload, availability toggle. *Done when: owner adds a dish with photo and it appears on the customer menu.*
8. **Dashboard + users** — count cards + revenue; owner creates/deactivates staff. *Done when: staff login works and cannot access owner pages.*
9. **Polish + deploy** — SEO (restaurant schema, OG, sitemap, robots.txt), accessibility pass, seed script, deploy Vercel/Railway/Atlas. *Done when: live URL end-to-end demo works.*

## Out of Scope for V1

Delivery, online payments (SSLCommerz later), structured modifiers, analytics beyond revenue, multi-restaurant, customer accounts, reservations, loyalty, inventory, push notifications.
