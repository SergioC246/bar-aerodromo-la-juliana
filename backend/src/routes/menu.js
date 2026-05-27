const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Menú público
router.get('/', menuController.getMenuCompleto);

// Menú para admin (incluye no disponibles)
router.get('/admin', menuController.getMenuAdmin);

// Categorías
router.post('/categorias', menuController.createCategoria);
router.put('/categorias/:id', menuController.updateCategoria);
router.delete('/categorias/:id', menuController.deleteCategoria);

// Productos
router.post('/productos', menuController.createProducto);
router.put('/productos/:id', menuController.updateProducto);
router.delete('/productos/:id', menuController.deleteProducto);

module.exports = router;