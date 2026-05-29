const Order = require('../models/Order');

const VALID_STATUSES = ['pendiente', 'en_cocina', 'listo', 'entregado'];

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items, pickupTime } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Invalid customer name' });
    }

    if (!/^[\d\s\-\+\(\)]{7,}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    await Order.create({ customerName, phone, items, pickupTime });

    const orders = await Order.getAll('pendiente');
    const order = orders[0];

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
