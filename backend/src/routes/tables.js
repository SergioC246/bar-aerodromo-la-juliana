const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/:token', tableController.getTableByToken);
router.post('/', tableController.createTable);
router.get('/', tableController.getAllTables);

module.exports = router;
