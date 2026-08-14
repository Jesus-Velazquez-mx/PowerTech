const connection = require('../config/connection');

// GET /notification/user/:id
function obtenerAlarmasPorUsuario(req, res) {
  if (connection) {
    const { id } = req.params;
    let sql = `
      SELECT 
        a.codigoAlarma,
        a.tipoAlarma,
        a.nivel,
        a.estado,
        a.fechaHora,
        a.detalle,
        e.nombreEdificio,
        s.nombreSala
      FROM ALARMAS a
      INNER JOIN EDIFICIOS e ON a.codigoEdificio = e.codigoEdificio
      INNER JOIN SALAS s ON a.codigoSala = s.codigoSala
      WHERE e.idUsuario = ${connection.escape(id)}
      ORDER BY a.fechaHora DESC
    `;

    connection.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          error: false,
          data: rows,
          mensaje: rows.length > 0 ? "Alarmas obtenidas" : "No hay notificaciones pendientes"
        });
      }
    });
  }
}

// PATCH /notification/:id/estado
function actualizarEstado(req, res) {
  if (connection) {
    const { id } = req.params;
    const { estado } = req.body;

    const sql = 'UPDATE ALARMAS SET estado = ? WHERE codigoAlarma = ?';

    connection.query(sql, [estado, id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ error: false, mensaje: "Estado de la alarma actualizado correctamente" });
    });
  }
}

module.exports = {
  obtenerAlarmasPorUsuario,
  actualizarEstado
};