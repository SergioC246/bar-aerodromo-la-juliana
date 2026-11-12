# 🍻 Bar Aeródromo La Juliana — Digital Menu & Order Management

A web app built for a real bar and running in production. Customers browse the menu from their phone (bilingual ES/EN), place an order and choose a pickup time. The order reaches the **kitchen** and **bar** screens **in real time**, and the customer is notified when it's ready. An admin panel lets the owner manage the menu, kitchen hours and view statistics.

**🌐 Live:** [bar-aerodromo-la-juliana.onrender.com](https://bar-aerodromo-la-juliana.onrender.com)

---

## ✨ Features

**Customer (mobile, no sign-up)**
- Menu by categories and subsections, in **Spanish and English**.
- Cart with per-item comments and a **pickup time** (past or unreasonably distant times are rejected).
- **Kitchen closed** notice based on the configured schedule.
- **"Order ready" alert** in real time (WebSocket) and via **push notification**, even if the tab is closed.
- **Menu-only mode** (`/?modo=carta`) for a QR code that lets people browse but not order.
- **Duplicate order protection** (double taps, flaky connections).

**Kitchen & bar (tablet, staff access)**
- **Kitchen** screen: orders in progress and done, sound and visual alert for every new order, alarm when pickup time approaches.
- **Bar** screen: same view with prices and total to charge, confirmation before marking an order as ready, and an undo button.
- **Shared staff password** remembered by the device: typed once, the session then renews itself during the shift.

**Administration**
- Create, edit and delete categories and products (with English translations).
- Order list with status and date filters.
- Configurable kitchen hours (supports schedules that cross midnight).
- Reports: daily revenue, best-selling dishes, orders per hour and an **all-time ranking**.
- Printable **QR code** generators (`qr-print.html`, `qr-print-carta.html`).

---

## 🛠️ Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Plain HTML, CSS and JavaScript (served by the backend) |
| Backend | Node.js + Express |
| Real time | WebSockets (`ws`) |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` for the admin |
| Notifications | Web Push with VAPID (`web-push`) and a Service Worker |
| Security | `express-rate-limit`, input validation, output escaping |
| Monitoring | Sentry (client errors) and Google Analytics only after cookie consent |
| Deployment | Render (web service + managed PostgreSQL) |

---

## 🧭 Architecture

```
 Customer (phone) ──POST /api/orders──▶  Express API  ──▶ PostgreSQL
        ▲                                    │
        │ pedido_listo (WebSocket / Push)    │ nuevo_pedido (WebSocket, staff with valid token only)
        │                                    ▼
        └─────────────────────────  Kitchen / Bar (tablet)
                                     Admin (web panel)
```

---

## 🔐 Security

Three access levels, enforced **on the server** (not just by hiding buttons):

| Level | Who | What they can do |
|-------|-----|------------------|
| Public | Customers | View the menu and hours, **create** an order |
| Staff | Kitchen and bar | View and update orders and tickets |
| Admin | Owner / manager | Everything above, plus menu, hours and reports |

- 12-hour JWT with automatic renewal for staff; a staff token is not accepted on admin routes.
- Staff password compared in constant time; login rate limit (5 failures / 15 min per IP).
- The WebSocket only pushes orders to screens that present a valid token.
- Customer-supplied data (name, comments) is escaped before rendering to prevent XSS.
- `trust proxy` is configured so rate limiting uses the real client IP behind Render.
- Secrets live only in environment variables; none are hard-coded.

---

## 📁 Project structure

```
bar-aerodromo-la-juliana/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, initial schema (initDb) and Web Push
│   │   ├── controllers/   # Logic for each resource
│   │   ├── middleware/    # Role-based auth, rate limiting, error handling
│   │   ├── models/        # Order queries
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Kitchen hours and timezone helpers
│   │   ├── app.js         # Express setup
│   │   └── server.js      # HTTP + WebSocket server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html         # Menu and ordering (customers)
│   ├── cocina.html        # Kitchen screen
│   ├── barra.html         # Bar screen
│   ├── admin.html         # Admin panel
│   ├── staff-auth.js      # Staff access (shared by kitchen and bar)
│   ├── qr-print*.html     # QR generators
│   └── sw.js              # Service Worker (push notifications)
└── README.md
```

---

## 🚀 Running locally

**Requirements:** Node.js 18+ and PostgreSQL.

```bash
git clone https://github.com/SergioC246/bar-aerodromo-la-juliana.git
cd bar-aerodromo-la-juliana/backend
npm install
cp .env.example .env      # PowerShell: Copy-Item .env.example .env
```

Edit `.env` with your values (see the table below), then start the server:

```bash
npm run dev    # development, restarts on save
npm start      # production
```

The app runs at `http://localhost:5000`. **Tables are created automatically** on startup (`initDb`); just create an empty database in your local PostgreSQL first.

**Creating the admin user:** the sign-up route is intentionally commented out in `backend/src/routes/auth.js`. To create the first admin, uncomment `router.post('/create', …)`, send a `POST /api/auth/create` with `{ "username", "password", "secretKey": <ADMIN_SECRET> }`, then comment it out again.

> ⚠️ Use a **local** database, separate from production, while developing.

### Environment variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `PORT` | No | Server port (default 5000) |
| `NODE_ENV` | No | `development` disables the login rate limit |
| `DATABASE_URL` | One of the two | Full connection string (used on Render) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | One of the two | Separate connection settings for local development |
| `JWT_SECRET` | **Yes** | Key used to sign tokens. Generate with `openssl rand -base64 32` |
| `ADMIN_SECRET` | **Yes** | Key protecting admin creation |
| `STAFF_PASSWORD` | For kitchen & bar | Shared staff password. If unset, staff access is disabled |
| `CORS_ORIGIN` | Recommended | Allowed origin (any origin if unset) |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | For notifications | Web Push keys. Generate with `npx web-push generate-vapid-keys` |

---

## 📡 API

**Public**

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/carta` | Full menu with available categories and products |
| `GET` | `/api/horario` | Whether the kitchen is open, and its hours |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/push/public-key` | Public key for push subscriptions |
| `POST` | `/api/push/subscribe` | Attach a push subscription to an order |
| `GET` | `/api/health` | Service health check |

**Authentication**

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Admin login (username and password) |
| `POST` | `/api/auth/staff-login` | Staff access (shared password) |
| `POST` | `/api/auth/refresh` | Renew a still-valid token |

**Staff or admin** (header `Authorization: Bearer <token>`)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/orders` | Orders, filterable by `status` and `date` |
| `GET` | `/api/orders/:id` | A single order |
| `PATCH` | `/api/orders/:id/status` | Change status (`pendiente`, `en_cocina`, `listo`, `entregado`) |
| `DELETE` | `/api/orders/:id` | Delete an order |
| `GET` | `/api/cocina/comandas` | Tickets in progress |
| `GET` | `/api/cocina/listas` | Tickets already prepared |

**Admin only**

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/carta/admin` | Full menu, including unavailable items |
| `POST` `PUT` `DELETE` | `/api/carta/categorias[/:id]` | Manage categories |
| `POST` `PUT` `DELETE` | `/api/carta/productos[/:id]` | Manage products |
| `PUT` | `/api/horario` | Change kitchen hours |
| `GET` | `/api/stats/dia` | Daily summary and dishes sold |
| `GET` | `/api/stats/historico` | All-time dish ranking |

**WebSocket** (same port): staff send `{ type: "identificar", rol: "staff", token }` and receive `nuevo_pedido`; customers send `{ type: "suscribir_pedido", pedidoId }` and receive `pedido_listo`.

---

## 🗃️ Data model

```
categorias     (id, nombre, nombre_en, emoji, orden)
productos      (id, categoria_id → categorias, nombre, nombre_en, descripcion, descripcion_es,
                subseccion, subseccion_en, notas, precio, disponible, orden, imagen_url)
pedidos        (id UUID, customer_name, phone, status, pickup_time, push_subscription, created_at, updated_at)
lineas_pedido  (id, pedido_id → pedidos, producto_id → productos, cantidad, precio_unitario,
                notas, comentario_cliente, tipo)
admins         (id, username, password_hash)
horario_cocina (id = 1, hora_apertura, hora_cierre, activo)
```

Table and field names are in Spanish because they mirror the business domain.

---

## ☁️ Deployment

The web service runs on **Render** and deploys automatically from the `main` branch, with environment variables configured in the Render dashboard. The business timezone (`Europe/Madrid`) is defined in `backend/src/utils/horario.js`.

---

## 👤 Author

Built by **Sergio Córdoba** for Bar Aeródromo La Juliana.
[GitHub](https://github.com/SergioC246) · [Portfolio](https://sergioc246.github.io)
