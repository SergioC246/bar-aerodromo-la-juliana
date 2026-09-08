const Order = require('../models/Order');
const { habilitado, publicKey } = require('../config/webpush');

// Devuelve la clave pública VAPID para que el front-end pueda suscribirse
exports.getPublicKey = (req, res) => {
  if (!habilitado) return res.status(503).json({ error: 'Web Push no está configurado en el servidor' });
  res.json({ publicKey });
};

// Guarda la suscripción Web Push del cliente, asociada a su pedido
exports.subscribe = async (req, res, next) => {
  try {
    const { pedidoId, subscription } = req.body;
    if (!pedidoId || !subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Faltan datos de la suscripción' });
    }

    const updated = await Order.savePushSubscription(pedidoId, subscription);
    if (!updated) return res.status(404).json({ error: 'Pedido no encontrado' });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
