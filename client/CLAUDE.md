# Client (Frontend)

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`, theme in `src/index.css`) · React Router · TanStack Query · React Hook Form + Zod · Framer Motion · socket.io-client. Fonts self-hosted via `@fontsource-variable/*` (no external CDN). Lint = oxlint.

## Structure (feature-first)

```
src/
├── features/     menu/ cart/ order/ kitchen/ admin/   (each: components, hooks, api)
├── components/   shared UI (Button, Card, Skeleton...)
├── hooks/        shared hooks (useSocket...)
├── services/     api client, socket setup
├── types/        shared TS types
├── pages/        route-level components
└── layouts/      customer layout, admin layout
```

## Design Tokens

- Light theme only: background White `#FFFFFF`, text Charcoal `#2B2B2B`, primary Warm Orange, accent Fresh Green.
- Fonts: Space Grotesk (headings), Inter (body) — only these two, preloaded.
- Buttons: rounded, large, touch-friendly (min 44px tap targets).
- Animations: Framer Motion, subtle, 100–200ms. No gradients everywhere.

## Rules

- Mobile-first. Customer flow must work one-handed; max 3 taps from menu to placed order.
- Hero sections vertically centered: `flex` + `align-items: center` — never top/bottom anchored.
- Card grids: fixed-height rows per field (`line-clamp`, fixed `h-*`), footer pinned with `mt-auto` — rows align across cards regardless of text length.
- Skeleton loaders, not spinners.
- Images lazy-loaded, WebP via Cloudinary transforms, responsive sizes.
- Menu without a `?t=` token is browse-only: hide cart/order actions, show "Scan the QR at your table to order".
- Server state through TanStack Query; sockets update the query cache (no manual refetch loops).
- Forms with React Hook Form + Zod schemas.
- Route-level code splitting: customer pages and admin pages load separately.
- Accessibility: semantic HTML, alt text, keyboard navigation, sufficient contrast.
