const webpush = require('web-push');

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:contacto@baraerodromolajuliana.com';

const habilitado = Boolean(publicKey && privateKey);

if (habilitado) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
} else {
  console.warn('⚠️  VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas: las notificaciones Web Push están desactivadas.');
}

module.exports = { webpush, habilitado, publicKey };
