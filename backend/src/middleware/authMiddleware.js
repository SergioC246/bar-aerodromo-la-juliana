const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

// Devuelve el contenido del token, o null si no es válido (y ya responde con 401).
function verificar(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return null;
  }
  try {
    return jwt.verify(auth.split(' ')[1], JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return null;
  }
}

// Solo administradores (carta, informes, horario).
// Los tokens antiguos no llevan "rol" y se consideran de admin.
const soloAdmin = (req, res, next) => {
  const payload = verificar(req, res);
  if (!payload) return;
  if (payload.rol === 'staff') {
    return res.status(403).json({ error: 'Permisos insuficientes' });
  }
  req.admin = payload;
  next();
};

// Personal (cocina/barra) o administrador: pedidos y pantallas de cocina.
const personalOAdmin = (req, res, next) => {
  const payload = verificar(req, res);
  if (!payload) return;
  req.admin = payload;
  next();
};

module.exports = soloAdmin; // compatible con los require() actuales
module.exports.soloAdmin = soloAdmin;
module.exports.personalOAdmin = personalOAdmin;