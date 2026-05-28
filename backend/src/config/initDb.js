const pool = require('./database');

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        nombre_en VARCHAR(100) NOT NULL DEFAULT '',
        emoji VARCHAR(10) DEFAULT '🍽️',
        orden INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS pedidos (
        id UUID PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        status VARCHAR(50) DEFAULT 'pendiente',
        pickup_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lineas_pedido (
        id SERIAL PRIMARY KEY,
        pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
        producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        notas TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
      CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_lineas_pedido_pedido_id ON lineas_pedido(pedido_id);
      CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

      ALTER TABLE categorias ADD COLUMN IF NOT EXISTS nombre_en VARCHAR(100) NOT NULL DEFAULT '';
      ALTER TABLE categorias ADD COLUMN IF NOT EXISTS emoji VARCHAR(10) DEFAULT '🍽️';
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS nombre_en VARCHAR(100) NOT NULL DEFAULT '';
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS descripcion_es TEXT;
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS subseccion VARCHAR(100);
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS subseccion_en VARCHAR(100);
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS notas VARCHAR(255);
      ALTER TABLE productos ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;
    `);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (err) {
    console.error('❌ Error inicializando la base de datos:', err.message);
  }
}

module.exports = initDb;