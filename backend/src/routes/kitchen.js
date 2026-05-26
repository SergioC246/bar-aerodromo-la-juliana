const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');

router.get('/comandas', kitchenController.getActiveOrders);
router.get('/listas', kitchenController.getReadyOrders);

module.exports = router;
