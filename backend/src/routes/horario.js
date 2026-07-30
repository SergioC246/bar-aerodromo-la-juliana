const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Estado público: usado por la web de clientes para saber si la cocina está abierta
router.get('/', horarioController.getEstado);

// Solo admin puede cambiar el horario
router.put('/', authMiddleware, horarioController.actualizarHorario);

module.exports = router;
