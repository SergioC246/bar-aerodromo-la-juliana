const pool = require('../config/database');

exports.getActiveOrders = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.customer_name,
        p.phone,
        p.pickup_time,
        p.status,
        p.created_at,
        json_agg(
          json_build_object(
            'id',       lp.id,
            'nombre',   lp.notas,
            'cantidad', lp.cantidad,
            'precio',   lp.precio_unitario
          ) ORDER BY lp.id
        ) FILTER (WHERE lp.id IS NOT NULL) as items
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
      WHERE p.status IN ('pendiente', 'en_cocina')
        AND p.created_at >= CURRENT_DATE
        AND p.created_at < CURRENT_DATE + INTERVAL '1 day'
      GROUP BY p.id
      ORDER BY p.created_at ASC
    `);
    res.json(result.rows.map(row => ({ ...row, items: row.items || [] })));
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
        p.phone,
        p.pickup_time,
        p.status,
        p.created_at,
        json_agg(
          json_build_object(
            'id',       lp.id,
            'nombre',   lp.notas,
            'cantidad', lp.cantidad,
            'precio',   lp.precio_unitario
          ) ORDER BY lp.id
        ) FILTER (WHERE lp.id IS NOT NULL) as items
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
      WHERE p.status = 'listo'
        AND p.created_at >= CURRENT_DATE
        AND p.created_at < CURRENT_DATE + INTERVAL '1 day'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows.map(row => ({ ...row, items: row.items || [] })));
  } catch (err) {
    next(err);
  }
};
