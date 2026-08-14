const connection = require('../config/connection');

/**
 * Obtiene las métricas consolidadas de una sala específica 
 * consultando la vista VISTA_REPORTE_SALA_VER2.
 * GET /report/room/:id
 */
function obtenerReportePorSala(req, res) {
  if (connection) {
    const { id } = req.params; /* codigoSala recibido desde la ruta */

    // Se actualizó la vista y las columnas solicitadas
    const sql = `
      SELECT 
        codigoSala,
        nombreSala,
        codigoEdificio,
        nombreEdificio,
        indice_operatividad,
        total_dispositivos,
        total_sensores,
        alarmas_activas,
        alarmas_historicas_resueltas
      FROM VISTA_REPORTE_SALA_VER2
      WHERE codigoSala = ?
    `;

    connection.query(sql, [id], (err, rows) => {
      if (err) {
        res.status(500).json({
          error: true,
          mensaje: "Error al generar el reporte",
          detalles: err
        });
      } else {
        if (rows.length > 0) {
          res.json({
            error: false,
            data: rows[0],
            mensaje: "Reporte generado con éxito"
          });
        } else {
          res.status(404).json({
            error: true,
            mensaje: "No se encontraron datos para la sala especificada"
          });
        }
      }
    });
  }
}

module.exports = {
  obtenerReportePorSala
};