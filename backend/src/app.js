const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');
const kitchenRoutes = require('./routes/kitchen');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use('/api/orders', orderRoutes);
app.use('/api/carta', menuRoutes);
app.use('/api/cocina', kitchenRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use(errorHandler);

module.exports = app;

