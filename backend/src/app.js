const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');
const kitchenRoutes = require('./routes/kitchen');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Rutas públicas
app.use('/api/orders', orderRoutes);
app.use('/api/carta', menuRoutes);
app.use('/api/cocina', kitchenRoutes);
app.use('/api/auth', authRoutes);

// Rutas protegidas de admin (modificar menú)
app.use('/api/admin/carta', authMiddleware, menuRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use(errorHandler);

module.exports = app;