const pool = require('../config/database');

exports.getActiveOrders = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.customer_name,
        p.status,
        p.created_at,
        json_agg(
          json_build_object(
            'id', pr.id,
            'nombre', pr.nombre,
            'cantidad', lp.cantidad,
            'notas', lp.notas
          )
        ) as items
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
      LEFT JOIN productos pr ON lp.producto_id = pr.id
      WHERE p.status IN ('pendiente', 'en_cocina')
      GROUP BY p.id, p.customer_name, p.status, p.created_at
      ORDER BY p.created_at ASC
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getReadyOrders = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.customer_name,
        p.status,
        p.created_at,
        json_agg(
          json_build_object(
            'id', pr.id,
            'nombre', pr.nombre,
            'cantidad', lp.cantidad
          )
        ) as items
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
      LEFT JOIN productos pr ON lp.producto_id = pr.id
      WHERE p.status = 'listo'
      GROUP BY p.id, p.customer_name, p.status, p.created_at
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
