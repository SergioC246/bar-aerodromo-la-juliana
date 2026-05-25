const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

class Order {
  static async create(orderData) {
    const id = uuidv4();
    const { customerName, phone, items, pickupTime, status = 'pending' } = orderData;
    const createdAt = new Date();

    const query = `
      INSERT INTO orders (id, customer_name, phone, items, pickup_time, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [id, customerName, phone, JSON.stringify(items), pickupTime || null, status, createdAt];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAll(status = null) {
    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const values = [];

    if (status) {
      query = 'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC';
      values.push(status);
    }

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM orders WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *';
    const values = [status, new Date(), id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = Order;
