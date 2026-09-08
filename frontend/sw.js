// Service Worker de Bar Aeródromo La Juliana
// Su único trabajo: recibir el evento "push" del servidor y mostrar la notificación,
// aunque la pestaña del cliente esté cerrada o en segundo plano.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: '¡Tu pedido está listo! 🎉', body: 'Puedes pasar a recogerlo a la barra.' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {}

  const options = {
    body: data.body,
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    tag: 'pedido-listo'
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Al tocar la notificación, llevamos al cliente de vuelta a la web (o la enfocamos si ya la tiene abierta)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
