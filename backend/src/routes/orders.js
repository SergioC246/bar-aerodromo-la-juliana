const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { personalOAdmin } = require('../middleware/authMiddleware');

// Público: los clientes hacen su pedido sin iniciar sesión
router.post('/', orderController.createOrder);

// Privado: solo personal (cocina/barra) o admin
router.get('/', personalOAdmin, orderController.getOrders);
router.get('/:id', personalOAdmin, orderController.getOrder);
router.patch('/:id/status', personalOAdmin, orderController.updateOrderStatus);
router.delete('/:id', personalOAdmin, orderController.deleteOrder);

module.exports = router;