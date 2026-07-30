const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { getOrdersByStatus, getOrderById: queryGetOrderById } = require('./orderQueries');

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
          INSERT INTO lineas_pedido (pedido_id, producto_id, cantidad, precio_unitario, notas, comentario_cliente)
          VALUES ($1, NULL, $2, $3, $4, $5);
        `;
        const comentario = typeof item.comentario === 'string' ? item.comentario.trim().slice(0, 300) : null;
        await client.query(lineaQuery, [id, item.cantidad, item.precio, item.nombre, comentario || null]);
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
    return getOrdersByStatus(status, date);
  }

  static async getById(id) {
    return queryGetOrderById(id);
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
