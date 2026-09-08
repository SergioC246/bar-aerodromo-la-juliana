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

// Guardar clientes conectados (pantallas de cocina/barra que se identifican como staff)
const cocina = new Set();

// Guardar clientes-clientes suscritos a un pedido concreto, para avisarles cuando esté listo.
// pedidoId -> Set de sockets suscritos a ese pedido
const clientesPorPedido = new Map();
// socket -> Set de pedidoId a los que está suscrito (para poder limpiar al desconectar)
const suscripcionesPorSocket = new Map();

wss.on('connection', (ws) => {
  console.log('🔌 Nueva conexión WebSocket');

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (err) {
      return;
    }

    // Las pantallas de cocina/barra se identifican como staff para recibir 'nuevo_pedido'
    if (msg.type === 'identificar' && msg.rol === 'staff') {
      cocina.add(ws);
      console.log('🍳 Staff conectado. Total:', cocina.size);
      return;
    }

    // Un cliente se suscribe a su pedido para recibir el aviso de 'pedido_listo'
    if (msg.type === 'suscribir_pedido' && msg.pedidoId) {
      if (!clientesPorPedido.has(msg.pedidoId)) clientesPorPedido.set(msg.pedidoId, new Set());
      clientesPorPedido.get(msg.pedidoId).add(ws);

      if (!suscripcionesPorSocket.has(ws)) suscripcionesPorSocket.set(ws, new Set());
      suscripcionesPorSocket.get(ws).add(msg.pedidoId);
    }
  });

  ws.on('close', () => {
    cocina.delete(ws);

    const pedidosSuscritos = suscripcionesPorSocket.get(ws);
    if (pedidosSuscritos) {
      pedidosSuscritos.forEach(pedidoId => {
        const conjunto = clientesPorPedido.get(pedidoId);
        if (conjunto) {
          conjunto.delete(ws);
          if (conjunto.size === 0) clientesPorPedido.delete(pedidoId);
        }
      });
      suscripcionesPorSocket.delete(ws);
    }
  });
});

// Función global para emitir pedidos nuevos a cocina/barra
app.set('emitNuevoPedido', (pedido) => {
  const mensaje = JSON.stringify({ type: 'nuevo_pedido', pedido });
  cocina.forEach(ws => {
    if (ws.readyState === 1) ws.send(mensaje);
  });
});

// Función global para avisar al cliente concreto de que su pedido está listo
app.set('emitPedidoListo', (pedido) => {
  const suscritos = clientesPorPedido.get(pedido.id);
  if (!suscritos || suscritos.size === 0) return;

  const mensaje = JSON.stringify({ type: 'pedido_listo', pedido });
  suscritos.forEach(ws => {
    if (ws.readyState === 1) ws.send(mensaje);
  });

  // Ya se ha avisado a todos los suscriptores de este pedido, no hace falta seguir guardando la suscripción
  clientesPorPedido.delete(pedido.id);
});

(async () => {
  await initDb();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
})();