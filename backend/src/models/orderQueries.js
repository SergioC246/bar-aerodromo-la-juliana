const pool = require('../config/database');

const ORDER_SELECT_QUERY = `
  SELECT
    p.id,
    p.customer_name,
    p.phone,
    p.pickup_time,
    p.status,
    p.created_at,
    json_agg(
      json_build_object(
        'id',         lp.id,
        'nombre',     lp.notas,
        'cantidad',   lp.cantidad,
        'precio',     lp.precio_unitario,
        'comentario', lp.comentario_cliente,
        'tipo',       lp.tipo
      ) ORDER BY lp.id
    ) FILTER (WHERE lp.id IS NOT NULL) as items
  FROM pedidos p
  LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
`;

async function buildOrderQuery(filters = {}) {
  const { status, date, limit = null } = filters;
  const values = [];
  const conditions = [];

  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  if (date) {
    values.push(date);
    conditions.push(`DATE(p.created_at) = $${values.length}`);
  }

  let query = ORDER_SELECT_QUERY;
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY p.id ORDER BY p.created_at DESC';

  if (limit) {
    values.push(limit);
    query += ` LIMIT $${values.length}`;
  }

  try {
    const result = await pool.query(query, values);
    return result.rows.map(row => ({
      ...row,
      items: row.items || []
    }));
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
}

async function getOrdersByStatus(status, date = null) {
  return buildOrderQuery({ status, date });
}

async function getOrdersBetweenStatus(statuses, date = null) {
  const values = [];
  const conditions = [];

  if (statuses && statuses.length > 0) {
    values.push(statuses);
    conditions.push(`p.status = ANY($${values.length}::text[])`);
  }

  if (date) {
    values.push(date);
    conditions.push(`DATE(p.created_at) = $${values.length}`);
  }

  let query = ORDER_SELECT_QUERY;
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY p.id ORDER BY p.created_at ASC';

  try {
    const result = await pool.query(query, values);
    return result.rows.map(row => ({
      ...row,
      items: row.items || []
    }));
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
}

async function getOrderById(id) {
  const query = ORDER_SELECT_QUERY + `
    WHERE p.id = $1
    GROUP BY p.id
  `;

  try {
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) return null;
    return {
      ...result.rows[0],
      items: result.rows[0].items || []
    };
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
}

module.exports = {
  buildOrderQuery,
  getOrdersByStatus,
  getOrdersBetweenStatus,
  getOrderById
};
