const pool = require('../config/database');

// GET /api/carta — menú completo para el index.html
exports.getMenuCompleto = async (req, res, next) => {
  try {
    const categorias = await pool.query(
      'SELECT * FROM categorias ORDER BY orden ASC'
    );

    const result = await Promise.all(
      categorias.rows.map(async (cat) => {
        const productos = await pool.query(
          `SELECT id, nombre, nombre_en, descripcion, descripcion_es,
                  subseccion, subseccion_en, notas, precio, disponible, orden
           FROM productos
           WHERE categoria_id = $1 AND disponible = true
           ORDER BY orden ASC`,
          [cat.id]
        );
        return { ...cat, productos: productos.rows };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/carta/admin — menú completo para admin (incluye no disponibles)
exports.getMenuAdmin = async (req, res, next) => {
  try {
    const categorias = await pool.query(
      'SELECT * FROM categorias ORDER BY orden ASC'
    );

    const result = await Promise.all(
      categorias.rows.map(async (cat) => {
        const productos = await pool.query(
          `SELECT * FROM productos WHERE categoria_id = $1 ORDER BY orden ASC`,
          [cat.id]
        );
        return { ...cat, productos: productos.rows };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/carta/categorias — crear categoría
exports.createCategoria = async (req, res, next) => {
  try {
    const { nombre, nombre_en, emoji, orden } = req.body;
    const result = await pool.query(
      `INSERT INTO categorias (nombre, nombre_en, emoji, orden)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, nombre_en || '', emoji || '🍽️', orden || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/carta/categorias/:id — editar categoría
exports.updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, nombre_en, emoji, orden } = req.body;
    const result = await pool.query(
      `UPDATE categorias SET nombre=$1, nombre_en=$2, emoji=$3, orden=$4
       WHERE id=$5 RETURNING *`,
      [nombre, nombre_en || '', emoji || '🍽️', orden || 0, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/carta/categorias/:id — eliminar categoría
exports.deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// POST /api/carta/productos — crear producto
exports.createProducto = async (req, res, next) => {
  try {
    const { categoria_id, nombre, nombre_en, descripcion, descripcion_es, subseccion, subseccion_en, notas, precio, disponible, orden } = req.body;
    const result = await pool.query(
      `INSERT INTO productos (categoria_id, nombre, nombre_en, descripcion, descripcion_es, subseccion, subseccion_en, notas, precio, disponible, orden)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [categoria_id, nombre, nombre_en || '', descripcion || '', descripcion_es || '', subseccion || null, subseccion_en || null, notas || null, precio, disponible !== false, orden || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/carta/productos/:id — editar producto
exports.updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoria_id, nombre, nombre_en, descripcion, descripcion_es, subseccion, subseccion_en, notas, precio, disponible, orden } = req.body;
    const result = await pool.query(
      `UPDATE productos SET categoria_id=$1, nombre=$2, nombre_en=$3, descripcion=$4, descripcion_es=$5,
       subseccion=$6, subseccion_en=$7, notas=$8, precio=$9, disponible=$10, orden=$11
       WHERE id=$12 RETURNING *`,
      [categoria_id, nombre, nombre_en || '', descripcion || '', descripcion_es || '', subseccion || null, subseccion_en || null, notas || null, precio, disponible !== false, orden || 0, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/carta/productos/:id — eliminar producto
exports.deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};