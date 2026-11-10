const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// Menú público (clientes)
router.get('/', menuController.getMenuCompleto);

// Menú para admin (incluye no disponibles) - PROTEGIDO
router.get('/admin', authMiddleware, menuController.getMenuAdmin);

// Categorías - PROTEGIDAS
router.post('/categorias', authMiddleware, menuController.createCategoria);
router.put('/categorias/:id', authMiddleware, menuController.updateCategoria);
router.delete('/categorias/:id', authMiddleware, menuController.deleteCategoria);

// Productos - PROTEGIDOS
router.post('/productos', authMiddleware, menuController.createProducto);
router.put('/productos/:id', authMiddleware, menuController.updateProducto);
router.delete('/productos/:id', authMiddleware, menuController.deleteProducto);

module.exports = router;