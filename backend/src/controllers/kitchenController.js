const { getOrdersBetweenStatus, getOrdersByStatus } = require('../models/orderQueries');

exports.getActiveOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersBetweenStatus(['pendiente', 'en_cocina'], null);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getReadyOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersByStatus('listo', null);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
