# ShopStop — Backend & Database

Backend for the **E-Commerce Website with Product Comparison** assignment.
The frontend (Vite + React, in `../src`) is unchanged; this folder adds the
database, the server-side business logic and a REST API the frontend can
consume via the new `src/app/data/api.ts` client.

---

## 1. Tech stack

| Layer            | Choice                                           |
| ---------------- | ------------------------------------------------ |
| Database         | **MySQL 8.x** (InnoDB, utf8mb4)                  |
| Server runtime   | Node.js 18+ (ESM), Express 4                     |
| Auth             | bcryptjs + JWT                                   |
| MySQL driver     | `mysql2` (promise API, prepared statements)      |

---

## 2. Folder map

```
backend/
├── db/                              ←  All SQL — assignment deliverables
│   ├── 01_schema.sql                ←  20 tables in 3NF / BCNF
│   ├── 02_seed.sql                  ←  Sample data (mirrors mockData.ts)
│   ├── 03_functions.sql             ←  5 user-defined functions
│   ├── 04_procedures.sql            ←  7 stored procedures
│   ├── 05_triggers.sql              ←  6 triggers (stock, ratings, etc.)
│   ├── 06_views.sql                 ←  Helper views
│   └── 07_queries.sql               ←  Demo joins / nested / correlated queries
├── docs/
│   ├── 01_PROBLEM_STATEMENT.md
│   ├── 02_ERD.md
│   ├── 03_RELATIONAL_MAPPING.md
│   └── 04_NORMALIZATION.md
├── scripts/
│   ├── setup-db.js                  ←  Loads every .sql file in order
│   └── hash-passwords.js            ←  Replaces seeded hash with bcrypt('password123')
├── src/
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   └── routes/                      ←  auth, catalog, cart, compare, orders, seller, reviews, addresses
├── .env.example
└── package.json
```

---

## 3. Quick start

### 3.1 Install MySQL
Make sure a local MySQL server is running and you know the root password.
On Windows the easiest path is **MySQL Installer → Server + Workbench**.

### 3.2 Configure
```powershell
cd backend
copy .env.example .env
# edit .env — set DB_USER, DB_PASSWORD
```

### 3.3 Install dependencies and load the database
```powershell
npm install
npm run db:setup            # runs 01_..07_*.sql in order
npm run db:seed-passwords   # fills bcrypt hash for password123
```

### 3.4 Start the API
```powershell
npm run dev                 # http://localhost:4000
# health check
curl http://localhost:4000/api/health
```

### 3.5 Try it
```powershell
# log in as the seeded buyer
curl -X POST http://localhost:4000/api/auth/login `
     -H "Content-Type: application/json" `
     -d '{"email":"rahul@example.com","password":"password123"}'

# list all products
curl http://localhost:4000/api/products

# compare iPhone 15 Pro Max prices across shops
curl http://localhost:4000/api/compare/1
```

Seeded credentials (all share password `password123`):

| Email                | Role   |
| -------------------- | ------ |
| rahul@example.com    | buyer  |
| amit@example.com     | seller (TechHub Electronics)  |
| priya@example.com    | seller (Fashion Junction)     |
| suresh@example.com   | seller (Home Essentials)      |
| meena@example.com    | seller (Spice & Grocery Mart) |
| raj@example.com      | seller (AutoCare Parts)       |
| deepak@example.com   | seller (Sports Zone)          |

---

## 4. REST API summary

| Method | Path                                    | Auth   | Description                                |
| ------ | --------------------------------------- | ------ | ------------------------------------------ |
| POST   | `/api/auth/register`                    | –      | Register buyer or seller                   |
| POST   | `/api/auth/login`                       | –      | Email + password → JWT                     |
| GET    | `/api/auth/me`                          | yes    | Current logged-in user                     |
| GET    | `/api/categories`                       | –      | All product categories                     |
| GET    | `/api/shops?lat=&lon=`                  | –      | Shops, optionally sorted by distance       |
| GET    | `/api/shops/:id`                        | –      | Shop detail + its listings                 |
| GET    | `/api/products?q=&category=&shopId=`    | –      | Search listings (full join view)           |
| GET    | `/api/products/:listingId`              | –      | Listing + images + features                |
| GET    | `/api/compare/:productId`               | –      | **Price comparison** across shops          |
| GET    | `/api/cart`                             | buyer  | Cart contents                              |
| POST   | `/api/cart`                             | buyer  | Add `{listingId, quantity}`                |
| PATCH  | `/api/cart/:listingId`                  | buyer  | Set quantity (0 removes)                   |
| DELETE | `/api/cart/:listingId` / `/api/cart`    | buyer  | Remove / clear                             |
| GET    | `/api/compare`                          | buyer  | Buyer's compare basket                     |
| POST   | `/api/compare`                          | buyer  | Add `{productId}` (max 4 — trigger)        |
| DELETE | `/api/compare/:productId` / `/`         | buyer  | Remove / clear                             |
| POST   | `/api/orders`                           | buyer  | Place order `{shopId, addressId}`          |
| GET    | `/api/orders`                           | buyer  | Buyer's orders                             |
| GET    | `/api/orders/:id`                       | buyer  | Order detail + items + tracking            |
| PATCH  | `/api/orders/:id/status`                | seller | Move order through lifecycle               |
| GET    | `/api/seller/dashboard`                 | seller | KPIs + top products (procedure)            |
| GET    | `/api/seller/orders`                    | seller | Orders for the seller's shop               |
| GET    | `/api/seller/listings`                  | seller | Shop's listings                            |
| PATCH  | `/api/seller/listings/:id`              | seller | Edit price / stock                         |
| GET    | `/api/addresses`                        | buyer  | Saved addresses                            |
| POST   | `/api/addresses`                        | buyer  | Add new address                            |
| GET    | `/api/reviews/listing/:id`              | –      | Reviews for a listing                      |
| POST   | `/api/reviews`                          | buyer  | Submit `{listingId, rating, comment}`      |

---

## 5. Frontend integration

A ready-made client lives at `src/app/data/api.ts`.  No existing component
has been edited.  When you want a screen to read live data instead of
`mockData.ts` simply import and call:

```ts
import api from './data/api';

// inside a useEffect
const shops = await api.shops(userLat, userLon);
const listings = await api.products(searchQuery, selectedCategory);
const variants = await api.compare(productId);
await api.cart.add(listingId, 1);
const orderId = (await api.orders.place(shopId, addressId)).orderId;
```

Add this to `.env` at the project root for Vite:
```
VITE_API_URL=http://localhost:4000/api
```

---

## 6. Mapping to the assignment rubric

| Requirement                            | Where it lives                                     |
| -------------------------------------- | -------------------------------------------------- |
| Problem statement                      | `docs/01_PROBLEM_STATEMENT.md`                     |
| ERD                                    | `docs/02_ERD.md`                                   |
| Mapping ERD → relational tables        | `docs/03_RELATIONAL_MAPPING.md`                    |
| Normalisation up to BCNF               | `docs/04_NORMALIZATION.md`                         |
| **Tables**                             | `db/01_schema.sql` (20 tables)                     |
| **Functions**                          | `db/03_functions.sql` (5 functions)                |
| **Stored procedures**                  | `db/04_procedures.sql` (7 procedures)              |
| **Triggers**                           | `db/05_triggers.sql` (6 triggers)                  |
| **Views**                              | `db/06_views.sql`                                  |
| **Joins / aggregates**                 | `db/07_queries.sql` queries A, F, G                |
| **Nested sub-queries**                 | `db/07_queries.sql` query B                        |
| **Correlated sub-queries**             | `db/07_queries.sql` queries C, D                   |
| **Set operations (UNION)**             | `db/07_queries.sql` query H                        |
| Window function                        | `db/07_queries.sql` query F                        |
| Working web application using the DB   | `backend/src/**` and `src/app/data/api.ts`         |

---

## 7. Reset

To wipe everything and start over:

```powershell
npm run db:setup        # 01_schema.sql drops & recreates the database
npm run db:seed-passwords
```
