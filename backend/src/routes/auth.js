const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { personalOAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginLimiter, authController.login);

// Acceso "personal" de cocina/barra (contraseña compartida)
router.post('/staff-login', loginLimiter, authController.staffLogin);

// Renovación de sesión (personal o admin con token todavía válido)
router.post('/refresh', personalOAdmin, authController.refresh);

// router.post('/create', authController.createAdmin);

module.exports = router;