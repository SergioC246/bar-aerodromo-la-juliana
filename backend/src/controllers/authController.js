const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const crypto = require('crypto');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!process.env.ADMIN_SECRET) {
  throw new Error('ADMIN_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, username: admin.username });
  } catch (err) {
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { username, password, secretKey } = req.body;
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Clave secreta incorrecta' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Usuario ya existe' });
    next(err);
  }
};

// Acceso "personal" (cocina/barra): una contraseña compartida guardada en la variable
// de entorno STAFF_PASSWORD. Si no está configurada, este acceso queda desactivado
// (nunca tumba la aplicación).
const STAFF_PASSWORD = process.env.STAFF_PASSWORD;

function iguales(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

exports.staffLogin = (req, res) => {
  if (!STAFF_PASSWORD) {
    return res.status(503).json({ error: 'Acceso de personal no configurado' });
  }
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Contraseña requerida' });
  if (!iguales(password, STAFF_PASSWORD)) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ rol: 'staff', username: 'personal' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username: 'personal', rol: 'staff' });
};

// Renueva la sesión: recibe un token todavía válido y devuelve otro nuevo de 12 h.
exports.refresh = (req, res) => {
  const { id, username, rol } = req.admin;
  const payload = rol === 'staff' ? { rol: 'staff', username } : { id, username, rol: 'admin' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, username, rol: payload.rol });
};
