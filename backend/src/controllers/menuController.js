const pool = require('../config/database');

exports.getMenuByLanguage = async (req, res, next) => {
  try {
    const { lang } = req.query;

    const categorias = await pool.query(
      'SELECT * FROM categorias ORDER BY orden ASC'
    );

    const categoriasConProductos = await Promise.all(
      categorias.rows.map(async (cat) => {
        const productos = await pool.query(
          'SELECT id, nombre, descripcion, precio, disponible, imagen_url FROM productos WHERE categoria_id = $1',
          [cat.id]
        );
        return {
          ...cat,
          productos: productos.rows
        };
      })
    );

    res.json({
      categorias: categoriasConProductos,
      idioma: lang || 'es'
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategorias = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, orden FROM categorias ORDER BY orden ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getProductosPorCategoria = async (req, res, next) => {
  try {
    const { categoriaId } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE categoria_id = $1 AND disponible = true',
      [categoriaId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
