const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');
const { personalOAdmin } = require('../middleware/authMiddleware');

router.get('/comandas', personalOAdmin, kitchenController.getActiveOrders);
router.get('/listas', personalOAdmin, kitchenController.getReadyOrders);

module.exports = router;