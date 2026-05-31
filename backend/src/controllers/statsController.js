const pool = require('../config/database');

// Estadísticas de un día específico
exports.getStatsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Total facturado y número de comandas del día
    const resumenQuery = `
      SELECT
        COUNT(DISTINCT p.id) as total_comandas,
        COALESCE(SUM(lp.cantidad * lp.precio_unitario), 0) as total_facturado
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
      WHERE DATE(p.created_at) = $1
    `;

    // Platos vendidos ese día
    const platosQuery = `
      SELECT
        lp.notas as nombre,
        SUM(lp.cantidad) as total_cantidad,
        SUM(lp.cantidad * lp.precio_unitario) as total_importe
      FROM lineas_pedido lp
      JOIN pedidos p ON lp.pedido_id = p.id
      WHERE DATE(p.created_at) = $1
        AND lp.notas IS NOT NULL
      GROUP BY lp.notas
      ORDER BY total_cantidad DESC
    `;

    // Comandas por hora
    const horasQuery = `
      SELECT
        EXTRACT(HOUR FROM p.created_at) as hora,
        COUNT(*) as comandas
      FROM pedidos p
      WHERE DATE(p.created_at) = $1
      GROUP BY hora
      ORDER BY hora ASC
    `;

    const [resumen, platos, horas] = await Promise.all([
      pool.query(resumenQuery, [targetDate]),
      pool.query(platosQuery, [targetDate]),
      pool.query(horasQuery, [targetDate])
    ]);

    res.json({
      fecha: targetDate,
      total_comandas: parseInt(resumen.rows[0].total_comandas),
      total_facturado: parseFloat(resumen.rows[0].total_facturado).toFixed(2),
      platos: platos.rows,
      horas: horas.rows
    });
  } catch (err) {
    next(err);
  }
};

// Ranking histórico de platos
exports.getRankingHistorico = async (req, res, next) => {
  try {
    const rankingQuery = `
      SELECT
        lp.notas as nombre,
        SUM(lp.cantidad) as total_cantidad,
        SUM(lp.cantidad * lp.precio_unitario) as total_importe,
        COUNT(DISTINCT lp.pedido_id) as veces_pedido
      FROM lineas_pedido lp
      WHERE lp.notas IS NOT NULL
      GROUP BY lp.notas
      ORDER BY total_cantidad DESC
      LIMIT 50
    `;

    const totalQuery = `
      SELECT
        COUNT(DISTINCT p.id) as total_comandas,
        COALESCE(SUM(lp.cantidad * lp.precio_unitario), 0) as total_facturado,
        MIN(p.created_at) as desde
      FROM pedidos p
      LEFT JOIN lineas_pedido lp ON p.id = lp.pedido_id
    `;

    const [ranking, total] = await Promise.all([
      pool.query(rankingQuery),
      pool.query(totalQuery)
    ]);

    res.json({
      ranking: ranking.rows,
      total_comandas: parseInt(total.rows[0].total_comandas),
      total_facturado: parseFloat(total.rows[0].total_facturado).toFixed(2),
      desde: total.rows[0].desde
    });
  } catch (err) {
    next(err);
  }
};
