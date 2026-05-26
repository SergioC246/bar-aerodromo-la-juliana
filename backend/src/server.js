require('dotenv').config();
const app = require('./app');
const initDb = require('./config/initDb');
const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 5000;

// Crear servidor HTTP a partir de Express
const server = http.createServer(app);

// WebSocket Server sobre el mismo puerto
const wss = new WebSocketServer({ server });

// Guardar clientes conectados (pantallas de cocina)
const cocina = new Set();

wss.on('connection', (ws) => {
  cocina.add(ws);
  console.log('🍳 Cocina conectada. Total:', cocina.size);

  ws.on('close', () => {
    cocina.delete(ws);
    console.log('❌ Cocina desconectada. Total:', cocina.size);
  });
});

// Función global para emitir pedidos nuevos a cocina
app.set('emitNuevoPedido', (pedido) => {
  const mensaje = JSON.stringify({ type: 'nuevo_pedido', pedido });
  cocina.forEach(ws => {
    if (ws.readyState === 1) ws.send(mensaje);
  });
});

(async () => {
  await initDb();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
})();