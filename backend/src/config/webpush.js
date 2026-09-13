const webpush = require('web-push');

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:contacto@baraerodromolajuliana.com';

const habilitado = Boolean(publicKey && privateKey);

if (habilitado) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
  // Diagnóstico de arranque: la clave pública no es secreta, así que es seguro mostrarla
  // completa para poder compararla carácter a carácter con la del frontend si algo falla.
  console.log(`✅ Web Push habilitado. Clave pública (${publicKey.length} caracteres): ${publicKey}`);
  console.log(`   Clave privada cargada (${privateKey.length} caracteres). Subject: ${subject}`);
} else {
  console.warn('⚠️  VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas: las notificaciones Web Push están desactivadas.');
}

module.exports = { webpush, habilitado, publicKey };