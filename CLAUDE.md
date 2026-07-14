# Grabzo Restaurant

QR table-ordering system for a single restaurant: customers scan a QR, order from their phone, kitchen sees orders in real time. Full spec and locked decisions: **`plan.md`** — read it before adding any feature.

## Layout

- `client/` — React + Vite + TS + Tailwind (deploys to Vercel). Details: `client/CLAUDE.md`
- `server/` — Express + TS + Mongoose + Socket.io (deploys to Railway). Details: `server/CLAUDE.md`

Each folder has its own `package.json`. Run commands inside the folder:

```
npm run dev · npm run typecheck · npm run lint · npm test
```

## Hard Rules

- TypeScript everywhere. Currency is BDT, display with `৳`, store prices as integers.
- Order status flow is law: Received → Accepted → Preparing → Ready → Completed, no skipping, enforced server-side. Cancel only before Ready, staff-side only.
- No features outside `plan.md` V1 scope (no delivery, payments, modifiers, analytics, multi-restaurant).
- Typecheck + lint must pass before reporting any change complete.
- Never commit `.env` or secrets; all credentials via environment variables.
