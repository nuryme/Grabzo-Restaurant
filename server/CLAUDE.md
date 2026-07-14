# Server (Backend)

## Stack

Node.js · Express · TypeScript · Mongoose (MongoDB) · Socket.io · JWT · Zod · Cloudinary SDK

## Structure

```
src/
├── routes/        route definitions, attach validators + auth middleware
├── controllers/   thin: parse → call service → respond
├── services/      business logic lives here
├── models/        Mongoose schemas
├── middlewares/   auth (JWT), roles (owner|staff), error handler
├── validators/    Zod schemas per endpoint
├── socket/        io setup, rooms, event emitters
└── config/        env, db, cloudinary
```

## Rules

- Every request body/query validated with Zod at the route boundary before it reaches a controller.
- Status transitions enforced in the order service: one step forward only (Received → Accepted → Preparing → Ready → Completed); cancel only from Received/Accepted/Preparing. Reject invalid transitions with 400.
- Role middleware: staff can read/update orders and dashboard; only owner touches menu, categories, tables, users, uploads.
- Public endpoints (menu, order create/track, token resolve) never leak: qrToken lists, other orders, or user data. Order create requires a valid active qrToken.
- Prices stored as integers (৳). Order items snapshot name + price at order time.
- Passwords hashed with bcrypt. JWT secret and all credentials from env only — `.env` is git-ignored, provide `.env.example`.
- Socket rooms: `kitchen` (JWT-authenticated) and `order:<id>` (public, unguessable id). Emit `order:new`, `order:status`, `order:estimate`.
- Tests (light): order creation, status transition rules, QR token resolution. Run with `npm test`.
