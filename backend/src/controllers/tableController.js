const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.getTableByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      'SELECT id, numero, qr_token, activa FROM mesas WHERE qr_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createTable = async (req, res, next) => {
  try {
    const { numero } = req.body;

    if (!numero || numero < 1) {
      return res.status(400).json({ error: 'Número de mesa inválido' });
    }

    const qrToken = uuidv4();

    const result = await pool.query(
      'INSERT INTO mesas (numero, qr_token) VALUES ($1, $2) RETURNING *',
      [numero, qrToken]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Número de mesa ya existe' });
    }
    next(err);
  }
};

exports.getAllTables = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, numero, qr_token, activa FROM mesas ORDER BY numero ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
