const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getMenuByLanguage);
router.get('/categorias', menuController.getCategorias);
router.get('/categorias/:categoriaId', menuController.getProductosPorCategoria);
router.get('/productos/:id', menuController.getProducto);

module.exports = router;
