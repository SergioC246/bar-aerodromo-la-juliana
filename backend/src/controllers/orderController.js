const Order = require('../models/Order');
const { getEstadoCocina } = require('../utils/horario');
const { webpush, habilitado: pushHabilitado } = require('../config/webpush');

const VALID_STATUSES = ['pendiente', 'en_cocina', 'listo', 'entregado'];

// Red de seguridad contra pedidos duplicados: si el mismo intento de pedido (misma
// idempotencyKey generada por el cliente) llega más de una vez en poco tiempo —por doble
// toque en el botón, mala conexión, reintento del navegador, etc.— devolvemos el pedido que
// ya se creó la primera vez, en vez de crear uno nuevo. Vive en memoria porque el servicio
// corre con WEB_CONCURRENCY=1 (un solo proceso), así que no hace falta tocar la base de datos.
const pedidosPorIdempotencyKey = new Map(); // idempotencyKey -> { orderId, ts }
const IDEMPOTENCY_TTL_MS = 2 * 60 * 1000; // 2 minutos es de sobra para cualquier doble toque real

function limpiarIdempotencyKeysCaducadas() {
  const ahora = Date.now();
  for (const [key, val] of pedidosPorIdempotencyKey) {
    if (ahora - val.ts > IDEMPOTENCY_TTL_MS) pedidosPorIdempotencyKey.delete(key);
  }
}

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items, pickupTime, idempotencyKey } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Invalid customer name' });
    }

    if (!/^[\d\s\-\+\(\)]{7,}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (idempotencyKey) {
      limpiarIdempotencyKeysCaducadas();
      const previo = pedidosPorIdempotencyKey.get(idempotencyKey);
      if (previo) {
        // Es el mismo intento de pedido que ya procesamos: devolvemos el que ya existe,
        // sin crear uno nuevo.
        const orderExistente = await Order.getById(previo.orderId);
        if (orderExistente) return res.status(201).json(orderExistente);
      }
    }

    // Aunque el front-end ya avisa al cliente, comprobamos también aquí
    // para que no se puedan enviar pedidos saltándose el aviso de cocina cerrada.
    const horario = await getEstadoCocina();
    if (!horario.abierta) {
      return res.status(403).json({ error: 'La cocina está cerrada en este momento', horario });
    }

    await Order.create({ customerName, phone, items, pickupTime });

    const orders = await Order.getAll('pendiente');
    const order = orders[0];

    if (idempotencyKey) pedidosPorIdempotencyKey.set(idempotencyKey, { orderId: order.id, ts: Date.now() });

    const emitir = req.app.get('emitNuevoPedido');
    if (emitir) emitir(order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const orders = await Order.getAll(status, date);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const updated = await Order.updateStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    const order = await Order.getById(id);

    // Si el pedido acaba de marcarse como listo, avisamos al cliente en tiempo real
    if (status === 'listo') {
      const emitirListo = req.app.get('emitPedidoListo');
      if (emitirListo) emitirListo(order);

      // Y también por Web Push, para que le llegue aunque tenga la pestaña cerrada
      if (pushHabilitado) {
        try {
          const subscription = await Order.getPushSubscription(id);
          if (subscription) {
            const payload = JSON.stringify({
              title: '¡Tu pedido está listo! 🎉',
              body: 'Puedes pasar a recogerlo a la barra.'
            });
            await webpush.sendNotification(subscription, payload);
          }
        } catch (pushErr) {
          // Un fallo de push (suscripción caducada, navegador cerrado del todo, etc.)
          // no debe romper la respuesta de la API: el pedido igualmente queda marcado como listo.
          // Sacamos el detalle real del error (statusCode/body) porque el mensaje genérico de
          // la librería ("Received unexpected response code") no dice nada por sí solo.
          console.warn(
            '⚠️  No se pudo enviar la notificación Web Push:',
            pushErr.statusCode ? `[${pushErr.statusCode}]` : '',
            pushErr.body || pushErr.message
          );
        }
      }
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Order.delete(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
