const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

class Order {
  static async create(orderData) {
    const id = uuidv4();
    const { customerName, phone, items, pickupTime, status = 'pendiente' } = orderData;
    const createdAt = new Date();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const pedidoQuery = `
        INSERT INTO pedidos (id, customer_name, phone, pickup_time, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const pedidoValues = [id, customerName, phone, pickupTime || null, status, createdAt, createdAt];
      const pedidoResult = await client.query(pedidoQuery, pedidoValues);

      for (const item of items) {
        const lineaQuery = `
          INSERT INTO lineas_pedido (pedido_id, producto_id, cantidad, precio_unitario, notas)
          VALUES ($1, NULL, $2, $3, $4);
        `;
        await client.query(lineaQuery, [id, item.cantidad, item.precio, item.nombre]);
      }

      await client.query('COMMIT');
      return pedidoResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Database error: ${err.message}`);
    } finally {
      client.release();
    }
  }

  static async getAll(status = null, date = null) {
    let query = `
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
    `;
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

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

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

  static async getById(id) {
    const query = `
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

  static async updateStatus(id, status) {
    const query = `
      UPDATE pedidos SET status = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [status, new Date(), id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = Order;