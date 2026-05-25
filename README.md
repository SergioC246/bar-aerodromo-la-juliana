# 🍻 Bar Aeródromo La Juliana — Carta Digital

Sistema de carta digital con pedidos en mesa para el Bar Aeródromo La Juliana. Los clientes escanean un código QR desde su mesa, consultan la carta, realizan su pedido y este llega directamente a cocina como una comanda. El pago se gestiona en caja.

---

## 📋 Descripción del flujo

```
Cliente escanea QR  →  Carta digital  →  Realiza pedido  →  Comanda en cocina  →  Pago en caja
```

1. **QR por mesa** — Cada mesa tiene un código QR único que identifica la mesa y abre la carta digital.
2. **Carta digital** — El cliente navega por las categorías, añade productos al pedido y lo confirma.
3. **Comanda en cocina** — El pedido llega al panel de cocina en tiempo real con el número de mesa.
4. **Pago en caja** — El cliente solicita la cuenta; el camarero ve el resumen del pedido y procesa el cobro.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| QR | [qrcode.js](https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js) |

---

## 📁 Estructura del proyecto

```
bar-aerodromo-la-juliana/
├── backend/
│   ├── src/
│   │   ├── routes/         # Rutas de la API (carta, pedidos, mesas)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de PostgreSQL
│   │   └── middleware/     # Autenticación, errores
│   └── server.js           # Punto de entrada del servidor
├── src/                    # Assets del frontend (CSS, imágenes)
├── database.sql            # Schema de la base de datos
├── index.html              # Aplicación frontend (carta digital)
├── package.json
├── .env.example
└── README.md
```

---

## 🗃️ Modelo de datos

```sql
-- Mesas
mesas (id, numero, qr_token, activa)

-- Carta
categorias (id, nombre, orden)
productos (id, categoria_id, nombre, descripcion, precio, disponible, imagen_url)

-- Pedidos
pedidos (id, mesa_id, estado, created_at, updated_at)
  -- estados: 'pendiente' | 'en_cocina' | 'listo' | 'pagado'

lineas_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, notas)
```

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

- Node.js v18+
- PostgreSQL 14+

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/bar-aerodromo-la-juliana.git
cd bar-aerodromo-la-juliana
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bar_juliana
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Crear la base de datos

```bash
psql -U tu_usuario -c "CREATE DATABASE bar_juliana;"
psql -U tu_usuario -d bar_juliana -f database.sql
```

### 5. Arrancar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

La app estará disponible en `http://localhost:3000`

---

## 📡 API Endpoints

### Carta
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/carta` | Devuelve todas las categorías con sus productos |
| `GET` | `/api/carta/categorias` | Lista de categorías |
| `GET` | `/api/productos/:id` | Detalle de un producto |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/pedidos` | Crear nuevo pedido |
| `GET` | `/api/pedidos/:id` | Consultar estado de un pedido |
| `PATCH` | `/api/pedidos/:id/estado` | Actualizar estado (cocina / caja) |

### Mesas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/mesas/:token` | Identificar mesa por token QR |

### Cocina (panel)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/cocina/comandas` | Pedidos activos en cocina |

---

## 🖨️ Generación de códigos QR

Cada mesa tiene un QR único que incluye su token en la URL:

```
https://tu-dominio.com/?mesa=TOKEN_UNICO
```

Para imprimir el QR de una mesa, accede al panel de administración o usa la función `printQR()` disponible en el frontend.

---

## 🧑‍🍳 Panel de cocina

El panel de cocina muestra en tiempo real los pedidos con estado `en_cocina`, con:

- Número de mesa
- Productos y cantidades
- Hora de entrada del pedido
- Botón para marcar como **listo**

---

## 💳 Flujo de caja

1. El cliente solicita la cuenta.
2. El camarero busca el pedido por número de mesa.
3. Se muestra el resumen con total.
4. Al cobrar, el pedido pasa a estado `pagado`.

---

## 📝 Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `bar_juliana` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `••••••••` |

---

## 📌 Estado del proyecto

- [x] Frontend — Carta digital con QR
- [ ] Backend — Servidor Node.js + Express
- [ ] Base de datos — Schema PostgreSQL
- [ ] API REST — Carta y pedidos
- [ ] Panel de cocina — Comandas en tiempo real
- [ ] Panel de caja — Gestión de cobros
- [ ] Generación y gestión de QRs por mesa

---

## 👤 Autor

Proyecto desarrollado por **Sergio Córdoba** para el Bar Aeródromo La Juliana.
