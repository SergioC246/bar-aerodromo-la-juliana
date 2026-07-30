const pool = require('../config/database');
const { getEstadoCocina } = require('../utils/horario');

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

exports.getEstado = async (req, res, next) => {
  try {
    const estado = await getEstadoCocina();
    res.json(estado);
  } catch (err) {
    next(err);
  }
};

exports.actualizarHorario = async (req, res, next) => {
  try {
    const { hora_apertura, hora_cierre, activo } = req.body;

    if (!hora_apertura || !hora_cierre) {
      return res.status(400).json({ error: 'Las horas de apertura y cierre son obligatorias' });
    }
    if (!HORA_REGEX.test(hora_apertura) || !HORA_REGEX.test(hora_cierre)) {
      return res.status(400).json({ error: 'Formato de hora inválido, usa HH:MM' });
    }

    const activoBool = activo !== false;

    const result = await pool.query(
      `INSERT INTO horario_cocina (id, hora_apertura, hora_cierre, activo, updated_at)
       VALUES (1, $1, $2, $3, NOW())
       ON CONFLICT (id) DO UPDATE
         SET hora_apertura = $1, hora_cierre = $2, activo = $3, updated_at = NOW()
       RETURNING hora_apertura, hora_cierre, activo`,
      [hora_apertura, hora_cierre, activoBool]
    );

    const estado = await getEstadoCocina();
    res.json({ ...result.rows[0], ...estado });
  } catch (err) {
    next(err);
  }
};
