const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items, pickupTime } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Crear el pedido
    await Order.create({ customerName, phone, items, pickupTime });

    // Buscar el pedido completo con sus items para emitirlo a cocina
    const orders = await Order.getAll('pendiente');
    const order = orders[0]; // El más reciente es el primero

    const emitir = req.app.get('emitNuevoPedido');
    if (emitir) emitir(order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = await Order.getAll(status);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await Order.updateStatus(id, status);

    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Devolver el pedido completo con sus items
    const order = await Order.getById(id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};