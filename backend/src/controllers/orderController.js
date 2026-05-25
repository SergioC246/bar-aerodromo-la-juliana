const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items, pickupTime } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await Order.create({ customerName, phone, items, pickupTime });
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

    const order = await Order.updateStatus(id, status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
