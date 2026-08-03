# Personal Personal Book Manager— Backend HLD

> High-Level Design document for the backend service that powers the Personal Book Manager.

**Document type:** High-Level Design (HLD) · **Scope:** Backend only · **Stack:** Node.js + Express.js + MongoDB/Mongoose + JWT · **Consumer:** Next.js frontend over REST · **Status:** Pre-Development / Design Review

---

## 1. Overview

### 1.1 What this service does

The Personal Personal Book Managerlets an authenticated user catalog the books they own or plan to read, track reading progress per book, and glance at aggregate stats about their library. This document describes the backend that makes that possible — everything a client needs to authenticate, manage books, and pull dashboard numbers.

### 1.2 What's in / out of scope

In scope: API surface, data modeling, auth strategy, and the cross-cutting stuff (validation, error handling, security posture). Out of scope: the Next.js UI itself and infra provisioning, except where they touch the integration boundary (env vars, CORS, deployment shape).

### 1.3 Feature set

- JWT-based signup/login
- Per-user CRUD on books
- Tag and reading-status filters
- A dashboard summarizing the user's library

### 1.4 Functional requirements

| #    | The system must...                                                              |
| ---- | ------------------------------------------------------------------------------- |
| FR-1 | let a user sign up and log in                                                   |
| FR-2 | let a user log out (token discarded client-side)                                |
| FR-3 | let an authenticated user create, edit, delete, and list only _their own_ books |
| FR-4 | store title, author, tags, and reading status per book                          |
| FR-5 | support filtering the book list by tag and/or status                            |
| FR-6 | expose dashboard counts — total, reading, completed, want-to-read               |
| FR-7 | require auth on every route that reads or writes book data                      |

### 1.5 Non-functional requirements

- **Security** — hashed passwords, JWT-guarded routes, strict per-user data isolation
- **Maintainability** — layers with one job each, so a change in one doesn't ripple through the rest
- **Scalability** — no server-side session state; queries are index-backed and pagination-ready
- **Consistency** — one validation approach, one response envelope, everywhere
- **Performance** — indexes on `userId`, `status`, and `tags` keep the hot paths fast
- **Portability** — all environment-specific values come from env vars, so it's deployable anywhere

---

## 2. How a request moves through the system

This is a **layered MVC + Service** backend: each layer does one thing, and a request only ever moves _down_ through the stack — nothing jumps a layer.

```
   Browser
      │  HTTPS
      ▼
   Next.js frontend
      │  REST (JSON)
      ▼
   Express — routing & middleware
      │
      ▼
   JWT auth middleware (protected routes only)
      │
      ▼
   Controllers — shape HTTP in/out, nothing else
      │
      ▼
   Services — business rules live here
      │
      ▼
   Models — Mongoose schemas
      │
      ▼
   MongoDB
```

**Walking through it:** a REST call lands on Express, which resolves it to a route → for protected routes, the JWT middleware checks the token and attaches the caller's identity to `req.user` → the controller pulls what it needs off the request and hands off to a service → the service applies business rules and talks to a model → Mongoose runs the query → the result gets shaped back into a response and flows back up unchanged in structure.

The discipline that matters: a controller never touches Mongoose, and a service never touches `req`/`res`. That's what keeps each layer swappable and independently testable.

---

## 3. What each layer owns

- **Routes** — map an HTTP verb + path to a middleware/controller chain. No logic.
- **Middleware** — cross-cutting concerns: JWT checks, request validation, error shaping, security headers.
- **Controllers** — turn a request into a service call, and a service result into an HTTP response. Own the status code and response shape, own nothing else.
- **Services** — the business rules: who owns what, valid status transitions, dashboard math, password/token orchestration. No Express types leak in here.
- **Models** — Mongoose schemas for `User` and `Book`: field shape, constraints, indexes.
- **Validation** — schema-based checks on body/query/params, run before a controller ever sees the request.
- **Config** — the one place `process.env` gets read (DB URI, JWT secret, port, expiry).
- **Utils** — small stateless helpers: JWT sign/verify, password hashing, the response envelope, the async-error wrapper.

**The rule:** Route → Middleware → Controller → Service → Model → DB, and nothing skips a level — a controller reaching straight into a Mongoose model, for instance, isn't allowed.

---

## 4. Folder layout

```
src/
├── app.js                    Express app assembly (middleware + routes + error handler), no listen()
├── server.js                 entry point — loads config, starts the HTTP listener
├── config/
│   └── env.js                 reads & validates env vars, exports them as named constants
├── routes/                    auth.routes.js · book.routes.js · dashboard.routes.js
├── middleware/                 auth.middleware.js · validate.middleware.js · error.middleware.js
├── controllers/                 auth.controller.js · book.controller.js · dashboard.controller.js
├── services/                     auth.service.js · book.service.js · dashboard.service.js
├── models/                        user.model.js · book.model.js  (Mongoose schemas)
├── validation/                     auth.schema.js · book.schema.js  (Joi schemas)
├── constants/                       httpStatus.js · messages.js · readingStatus.js
├── utils/                            apiError.js · apiResponse.js · asyncHandler.js · jwt.js · password.js
└── database/                          connection.js  (Mongoose connect/disconnect lifecycle)
```

| Folder         | What lives there                                         |
| -------------- | -------------------------------------------------------- |
| `config/`      | Env-driven settings, read once                           |
| `routes/`      | Endpoint wiring, grouped by domain                       |
| `middleware/`  | Auth guard, validation runner, centralized error handler |
| `controllers/` | Thin HTTP adapters, no business logic                    |
| `services/`    | Business rules, ownership checks, orchestration          |
| `models/`      | Schema shape, field constraints, indexes                 |
| `validation/`  | Joi schemas — independent of controllers, testable alone |
| `constants/`   | HTTP status codes, user-facing messages, enums           |
| `utils/`       | Stateless helpers reused across layers                   |
| `database/`    | Connection bootstrap/teardown                            |

---

## 5. Request flows

Same shape every time — only what happens inside the service changes.

- **Signup** — `POST /auth/signup` → validate → controller → service (hash password, create user, sign JWT) → model → Mongo → response
- **Login** — `POST /auth/login` → validate → controller → service (check credentials, sign JWT) → model → Mongo → response
- **List books** — `GET /books?status=&tag=` → JWT check → controller → service (query scoped to `userId`) → model → Mongo → response
- **Add book** — `POST /books` → JWT check → validate → controller → service (attach `userId`, apply defaults) → model → Mongo → response
- **Edit book** — `PUT /books/:id` → JWT check → validate → controller → service (confirm ownership, apply changes) → model → Mongo → response
- **Delete book** — `DELETE /books/:id` → JWT check → controller → service (confirm ownership, remove) → model → Mongo → response
- **Dashboard** — `GET /dashboard` → JWT check → controller → service (aggregate counts for `userId`) → model → Mongo → response

Ownership (`book.userId === req.user.id`) is checked in the **service**, not the controller — every entry point that touches a book gets the same guarantee for free.

---

## 6. Data model

### 6.1 `User`

| Field                     | Type     | Notes                                                |
| ------------------------- | -------- | ---------------------------------------------------- |
| `_id`                     | ObjectId | primary key                                          |
| `name`                    | String   | display name                                         |
| `email`                   | String   | login identifier, unique                             |
| `password`                | String   | bcrypt hash — excluded from query results by default |
| `createdAt` / `updatedAt` | Date     | audit trail                                          |

Unique index on `email`: one account per address, and login lookups stay O(log n).

### 6.2 `Book`

| Field                     | Type              | Notes                                           |
| ------------------------- | ----------------- | ----------------------------------------------- |
| `_id`                     | ObjectId          | primary key                                     |
| `userId`                  | ObjectId → `User` | owner reference; the isolation boundary         |
| `title`                   | String            |                                                 |
| `author`                  | String            |                                                 |
| `tags`                    | [String]          | free-form, filterable                           |
| `status`                  | String enum       | `want_to_read` \| `reading` \| `completed`      |
| `createdAt` / `updatedAt` | Date              | `createdAt` also drives "recent books" ordering |

Indexes:

- `{ userId: 1, status: 1 }` — covers dashboard counts and status-filtered lists, the two hottest query shapes
- `{ userId: 1, tags: 1 }` — covers tag filtering

`User` → `Book` is one-to-many via a reference (`userId`), not embedding — books are queried, filtered, and paginated on their own and can grow without bound, so they don't belong nested inside the user document.

---

## 7. Entity relationship

```
User (1) ───────< (N) Book
  _id                  _id
  name                 userId  (→ User._id)
  email                title
  password              author
  createdAt              tags[]
  updatedAt                status
                            createdAt
                            updatedAt
```

---

## 8. API surface

**Auth**

| Method | Path               | Does                    | Auth |
| ------ | ------------------ | ----------------------- | ---- |
| POST   | `/api/auth/signup` | register                | no   |
| POST   | `/api/auth/login`  | authenticate, issue JWT | no   |
| POST   | `/api/auth/logout` | client discards token   | yes  |

**Books**

| Method | Path             | Does                            | Auth |
| ------ | ---------------- | ------------------------------- | ---- |
| GET    | `/api/books`     | list (filters: `status`, `tag`) | yes  |
| POST   | `/api/books`     | create                          | yes  |
| PUT    | `/api/books/:id` | update                          | yes  |
| DELETE | `/api/books/:id` | delete                          | yes  |

**Dashboard**

| Method | Path             | Does                           | Auth |
| ------ | ---------------- | ------------------------------ | ---- |
| GET    | `/api/dashboard` | aggregate stats + recent books | yes  |

---

## 9. Auth & authorization

**Signup:** validate input → confirm email isn't taken → bcrypt-hash the password → save the user → sign a JWT → hand back the token plus a minimal user profile.

**Login:** validate input → look up by email → bcrypt-compare the password → sign a JWT on match → same response shape as signup.

**JWTs:** signed with `JWT_SECRET`, payload is just `userId` (nothing sensitive), expiry set via `JWT_EXPIRES_IN` (moderate lifetime, e.g. 24h).

**Password storage:** bcrypt, salt rounds in the 10–12 range. Plaintext never touches a log line or a document.

**Verifying a request:** the auth middleware pulls the bearer token, checks signature + expiry, and sets `req.user`. Anything invalid or expired stops at `401` before a controller runs.

**What's actually protected:** every `/books` and `/dashboard` route. `/auth/signup` and `/auth/login` are the only public ones.

**Authorization vs. authentication:** past "is this a valid token," the service layer enforces _whose_ data this is — a user can only touch `Book` documents where `userId` matches `req.user.id`. It's an ownership check, not role-based, since there's no multi-tenant/team concept here.

**On logout:** JWTs are stateless, so logout just means the client drops the token — no server-side session or blacklist for v1, which keeps the API stateless and easy to scale horizontally. A blacklist or refresh-token scheme is a plausible later addition, not a day-one requirement.

**Bearer header vs. cookie — and why header won:** the frontend is a decoupled Next.js app hitting a plain REST API, not doing cookie-dependent server-rendering. `Authorization: Bearer <token>` keeps things stateless and sidesteps cross-origin cookie complexity during dev and deploy. Cookies would only get reconsidered if a CSRF-sensitive server-rendered flow shows up later.

---

## 10. Validation

| Endpoint       | Checked against                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Signup         | `name` required · `email` required + valid format · `password` required + min length                                                                 |
| Login          | `email` required + valid format · `password` required                                                                                                |
| Create book    | `title` required · `author` required · `tags` optional array of strings · `status` optional, must be a valid enum value (defaults to `want_to_read`) |
| Update book    | same fields as create, all optional, but at least one must be present                                                                                |
| Reading status | must be one of `want_to_read` / `reading` / `completed` — anything else is rejected                                                                  |
| Tags           | array of non-empty strings, trimmed                                                                                                                  |

**Why Joi:** schema-first validation keeps the rules declarative, lives in `validation/` independent of Express's `req` object, and can be unit-tested without spinning up HTTP at all.

Validation runs as middleware, strictly before the controller. A failure short-circuits with `400` and a structured error body — by the time a controller runs, its input is already trustworthy.

---

## 11. Error handling

One global error-handling middleware, registered last in `app.js`, catches everything forwarded via `next(err)` — including async route handlers, via a shared `asyncHandler` wrapper. No per-controller `try/catch` sprawl.

| Error type          | Where it originates                        | Status    |
| ------------------- | ------------------------------------------ | --------- |
| Validation error    | Joi schemas                                | 400       |
| Auth error          | JWT middleware (missing/bad/expired token) | 401       |
| Authorization error | Service layer (not the owner)              | 403       |
| Not found           | Service layer (bad id)                     | 404       |
| DB error            | Mongoose (cast errors, connection issues)  | 400 / 500 |
| Anything uncaught   | wherever                                   | 500       |

**Response envelope** — success:

```json
{ "success": true, "data": {}, "message": "Books fetched successfully" }
```

— and error:

```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "Title is required" }
}
```

One consistent shape means the frontend can branch on `success` alone, no matter which endpoint it called.

---

## 12. Security posture

- **Passwords** — bcrypt hash, never returned or logged in plaintext
- **Tokens** — moderate JWT expiry, configurable via env
- **Secrets** — `JWT_SECRET`/`MONGO_URI` live in env vars only, never committed
- **Headers** — `helmet` sets sane security defaults
- **CORS** — restricted to the known Next.js origin
- **Input validation** — every write endpoint runs through a schema first
- **NoSQL injection** — Mongoose's typed schema fields reject operator-injection payloads (e.g. `{ "$gt": "" }"`) in string fields
- **XSS** — server only ever returns JSON, no HTML rendering; free-text fields get sanitized as defense in depth
- **Rate limiting** — not in v1; `express-rate-limit` on `/auth/*` is a documented follow-up
- **Transport** — HTTPS terminated at the deployment/proxy layer

---

## 13. Dashboard math

Every number on the dashboard comes from the current user's own `Book` documents — nothing cross-user ever gets touched.

- **Total** — count of the user's documents
- **Reading / Completed / Want-to-read** — counts split by `status`
- **Recent books** — the user's books, newest `createdAt` first, capped at a handful (e.g. 5)

All the counts come out of a single grouped aggregation scoped to `userId`, instead of four separate round-trips — and the `{ userId, status }` compound index (§6.2) is what keeps that aggregation cheap.

---

## 14. Why these choices

- **Express** — minimal and well-understood; no framework tax for an API this size
- **MongoDB** — books are naturally document-shaped (variable tags, fields that may evolve) with no real need for joins
- **Mongoose** — schema enforcement and index declarations on top of Mongo's flexibility, without giving up the document model
- **JWT** — stateless auth fits a decoupled SPA/REST frontend and scales horizontally with no sticky sessions
- **MVC** — a layout any reviewer or future contributor already knows how to navigate
- **A dedicated service layer** — keeps ownership checks, status rules, and aggregation logic out of controllers, so they're testable and reusable if another entry point (CLI, GraphQL) shows up later
- **REST** — matches how the Next.js client already wants to consume this, and resource-oriented endpoints are easy to document and version

---

## 15. Room to grow

- **Pagination** — `/books` can pick up `page`/`limit` params once libraries get large; the schema and indexes already support it, it's just not wired up yet
- **Filtering/sorting** — already index-backed (§6.2); more sort keys (title, author) can be added on demand
- **Indexing** — the two compound indexes already cover the dominant query shapes (list + dashboard) without full scans
- **Caching** — dashboard counts are a natural candidate once traffic justifies it; they don't need millisecond freshness
- **Redis** — candidate for a future logout blacklist and/or dashboard cache — not needed for v1
- **Horizontal scaling** — no in-memory session state, so more API instances can sit behind a load balancer with zero coordination; MongoDB Atlas scales independently

None of this is built speculatively — it's noted as future-ready, sized appropriately for where this app actually is today.

---

## 16. Deployment shape

```
Browser → HTTPS → Next.js (Vercel/Node host)
        → REST/HTTPS → Express API (Render/Railway/EC2/App Service)
        → MongoDB wire protocol (TLS) → MongoDB Atlas
```

**Env vars the service needs:**

| Var              | For                                 |
| ---------------- | ----------------------------------- |
| `PORT`           | Express listen port                 |
| `MONGO_URI`      | Atlas connection string             |
| `JWT_SECRET`     | signs/verifies JWTs                 |
| `JWT_EXPIRES_IN` | token lifetime (e.g. `24h`)         |
| `CORS_ORIGIN`    | allowed frontend origin             |
| `NODE_ENV`       | `development` / `production` toggle |

---

## 17. Assumptions going in

- One user per book — no shared/collaborative libraries in v1
- No file uploads (cover images, etc.) in scope
- Single-tenant per user — no orgs, teams, or roles
- Reading status is a fixed three-value enum, no custom statuses
- Tags are free-text strings, not a managed taxonomy
- Email is the only login identifier — no OAuth/social login
- Frontend and backend deploy as separate services, talking over REST

---

## 18. Later, maybe

- Full-text search on title/author
- Favorites/bookmarks
- Ratings and reviews
- Reading goals and progress tracking
- Cover image uploads
- Reading-reminder notifications
- Usage analytics
- CSV/JSON export

---

## 19. In short

Routing, request handling, business logic, and data access sit in their own layers, each testable and changeable on its own. Ownership-scoped queries plus the indexes in §6 keep this **secure** and **fast** at the scale this project targets; stateless JWT auth keeps it **horizontally scalable** without extra infrastructure. The MVC + service-layer shape, one response/error envelope, and schema-based validation add up to a codebase another engineer can extend without archaeology — a new resource (say, "Favorites") slots in as a parallel route/controller/service/model set, touching nothing that already exists. It's scoped for a hiring assignment, but built the way a small real production service would be.
