const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dia', authMiddleware, statsController.getStatsByDate);
router.get('/historico', authMiddleware, statsController.getRankingHistorico);

module.exports = router;
