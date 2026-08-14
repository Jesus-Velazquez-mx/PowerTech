const connection = require('../config/connection');

/* Validaciones */
function validarSensor(datos) {
  const errores = [];
  const { codigoSensor, codigoDispositivo, nombreSensor, tipoSensor } = datos;

  if (!codigoSensor || !codigoSensor.trim()) errores.push("El código del sensor es obligatorio");
  if (codigoSensor && codigoSensor.length > 10) errores.push("El código no debe superar los 10 caracteres");

  if (!codigoDispositivo || !codigoDispositivo.trim()) errores.push("El código del dispositivo es obligatorio");

  if (!nombreSensor || !nombreSensor.trim()) errores.push("El nombre del sensor es obligatorio");
  if (nombreSensor && nombreSensor.length > 80) errores.push("El nombre no debe superar los 80 caracteres");

  if (!tipoSensor || !tipoSensor.trim()) errores.push("El tipo de sensor es obligatorio");
  if (tipoSensor && tipoSensor.length > 40) errores.push("El tipo de sensor no debe superar los 40 caracteres");

  return errores;
}

// GET /sensor/device/:id
function listarPorDispositivo(req, res) {
  if (connection) {
    const { id } = req.params;
    const sql = 'SELECT * FROM SENSORES WHERE codigoDispositivo = ?';

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json({ error: false, data: rows, mensaje: rows.length > 0 ? "Sensores recuperados" : "Sin sensores" });
    });
  }
}

// GET /sensor/user/:id
function listarPorUsuario(req, res) {
  if (connection) {
    const { id } = req.params;
    const sql = `
      SELECT 
        s.*, 
        d.nombre AS nombreDispositivo,
        sa.nombreSala,
        e.nombreEdificio
      FROM SENSORES s
      INNER JOIN DISPOSITIVOS d ON s.codigoDispositivo = d.codigoDispositivo
      INNER JOIN SALAS sa ON d.codigoSala = sa.codigoSala
      INNER JOIN EDIFICIOS e ON sa.codigoEdificio = e.codigoEdificio
      WHERE e.idUsuario = ?
    `;

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json({ error: false, data: rows, mensaje: rows.length > 0 ? "Sensores globales recuperados" : "Sin sensores" });
    });
  }
}

// POST /sensor
function crear(req, res) {
  if (connection) {
    const datos = req.body;
    const errores = validarSensor(datos);

    if (errores.length > 0) return res.status(400).json({ error: true, mensaje: "Datos inválidos", detalles: errores });

    const sqlCheck = 'SELECT codigoSensor FROM SENSORES WHERE codigoSensor = ?';
    connection.query(sqlCheck, [datos.codigoSensor], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) return res.status(400).json({ error: true, mensaje: "Código ya registrado" });

      connection.query('INSERT INTO SENSORES SET ?', datos, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ error: false, data: result, mensaje: "Sensor agregado correctamente" });
      });
    });
  }
}

// DELETE /sensor/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params;
    const sqlAlarmas = 'DELETE FROM ALARMAS WHERE codigoSensor = ?';

    connection.query(sqlAlarmas, [id], (err) => {
      if (err) return res.status(500).json(err);
      const sqlSensor = 'DELETE FROM SENSORES WHERE codigoSensor = ?';
      connection.query(sqlSensor, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ error: false, mensaje: "Sensor eliminado con éxito", data: result });
      });
    });
  }
}

// PATCH /sensor/:id/estado
function actualizarEstado(req, res) {
  if (connection) {
    const { id } = req.params;
    const { activo } = req.body;

    const sql = 'UPDATE SENSORES SET activo = ? WHERE codigoSensor = ?';
    connection.query(sql, [activo, id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ error: false, mensaje: "Estado actualizado correctamente" });
    });
  }
}

// GET /sensor/:id/readings (NUEVO: Para alimentar la gráfica en tiempo real)
function obtenerLecturas(req, res) {
  if (connection) {
    const { id } = req.params;
    // Traemos las últimas 15 lecturas ordenadas por la más reciente
    const sql = `
      SELECT fechaHora, valor 
      FROM LECTURAS 
      WHERE codigoSensor = ? 
      ORDER BY fechaHora DESC 
      LIMIT 15
    `;

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);

      // Volteamos el arreglo para que las lecturas más antiguas queden a la izquierda de la gráfica
      const lecturasCronologicas = rows.reverse();

      res.json({
        error: false,
        data: lecturasCronologicas
      });
    });
  }
}

module.exports = {
  listarPorDispositivo,
  listarPorUsuario,
  crear,
  actualizarEstado,
  eliminar,
  obtenerLecturas
};