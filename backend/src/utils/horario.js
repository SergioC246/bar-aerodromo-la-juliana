const pool = require('../config/database');

// Zona horaria del bar. Ajustar aquí si el negocio cambia de ubicación.
const TIMEZONE = 'Europe/Madrid';

const DEFAULT_HORARIO = {
  hora_apertura: '08:00:00',
  hora_cierre: '23:00:00',
  activo: true
};

function getCurrentTimeInTZ() {
  // Devuelve la hora actual en formato 'HH:MM' en la zona horaria del bar,
  // independientemente de en qué servidor/zona horaria corra el backend.
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function isWithinRange(current, apertura, cierre) {
  const a = apertura.substring(0, 5);
  const c = cierre.substring(0, 5);
  if (a <= c) {
    // Rango normal, ej. 08:00 - 23:00
    return current >= a && current < c;
  }
  // Rango que cruza medianoche, ej. 20:00 - 02:00
  return current >= a || current < c;
}

async function getRawHorario() {
  const result = await pool.query(
    'SELECT hora_apertura, hora_cierre, activo FROM horario_cocina WHERE id = 1'
  );
  return result.rows[0] || DEFAULT_HORARIO;
}

async function getEstadoCocina() {
  const row = await getRawHorario();
  const current = getCurrentTimeInTZ();
  const abierta = row.activo && isWithinRange(current, row.hora_apertura, row.hora_cierre);
  return {
    abierta,
    activo: row.activo,
    hora_apertura: row.hora_apertura.substring(0, 5),
    hora_cierre: row.hora_cierre.substring(0, 5)
  };
}

module.exports = { getEstadoCocina, getRawHorario, isWithinRange, TIMEZONE };
