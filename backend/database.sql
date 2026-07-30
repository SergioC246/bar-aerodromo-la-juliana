-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  nombre_en VARCHAR(100) NOT NULL DEFAULT '',
  emoji VARCHAR(10) DEFAULT '🍽️',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  nombre_en VARCHAR(100) NOT NULL DEFAULT '',
  descripcion TEXT,
  descripcion_es TEXT,
  subseccion VARCHAR(100),
  subseccion_en VARCHAR(100),
  notas VARCHAR(255),
  precio DECIMAL(10, 2) NOT NULL,
  disponible BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  imagen_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente',
  pickup_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Líneas de pedido
CREATE TABLE IF NOT EXISTS lineas_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  notas TEXT,
  comentario_cliente VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Horario de cocina (fila única, id=1)
CREATE TABLE IF NOT EXISTS horario_cocina (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hora_apertura TIME NOT NULL DEFAULT '08:00',
  hora_cierre TIME NOT NULL DEFAULT '23:00',
  activo BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT horario_cocina_single_row CHECK (id = 1)
);
INSERT INTO horario_cocina (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Admin usuarios
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lineas_pedido_pedido_id ON lineas_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);