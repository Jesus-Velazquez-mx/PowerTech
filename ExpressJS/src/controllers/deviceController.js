const connection = require('../config/connection');

/* Validación */
function validarDispositivo(datos) {
  const errores = [];
  const { codigoDispositivo, codigoSala, nombre, tipo } = datos;

  if (!codigoDispositivo || !codigoDispositivo.trim()) errores.push("El código del dispositivo es obligatorio");
  if (codigoDispositivo && codigoDispositivo.length > 10) errores.push("El código no debe superar los 10 caracteres");

  if (!codigoSala || !codigoSala.trim()) errores.push("El código de la sala es obligatorio");
  
  if (!nombre || !nombre.trim()) errores.push("El nombre es obligatorio");
  if (nombre && nombre.length > 100) errores.push("El nombre no debe superar los 100 caracteres");

  if (!tipo || !['C', 'A'].includes(tipo)) errores.push("Tipo de dispositivo inválido (debe ser 'C' o 'A')");

  return errores;
}

// GET /device/room/:id
// Lista todos los dispositivos de una sala específica
function listarPorSala(req, res) {
  if (connection) {
    const { id } = req.params; // codigoSala
    const sql = 'SELECT * FROM DISPOSITIVOS WHERE codigoSala = ?';

    connection.query(sql, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          error: false,
          data: rows,
          mensaje: rows.length > 0 ? "Dispositivos recuperados" : "No hay dispositivos en esta sala"
        });
      }
    });
  }
}

// POST /device
function crear(req, res) {
  if (connection) {
    const datos = req.body;
    const errores = validarDispositivo(datos);

    if (errores.length > 0) {
      return res.status(400).json({ error: true, mensaje: "Datos inválidos", detalles: errores });
    }

    // Verificar duplicado
    const sqlCheck = 'SELECT codigoDispositivo FROM DISPOSITIVOS WHERE codigoDispositivo = ?';
    connection.query(sqlCheck, [datos.codigoDispositivo], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) return res.status(400).json({ error: true, mensaje: "Este código ya existe" });

      // Insertar en la tabla base DISPOSITIVOS
      const dispData = {
        codigoDispositivo: datos.codigoDispositivo,
        codigoSala: datos.codigoSala,
        nombre: datos.nombre,
        marca: datos.marca,
        tipo: datos.tipo
      };

      connection.query('INSERT INTO DISPOSITIVOS SET ?', dispData, (err) => {
        if (err) return res.status(500).json(err);

        // Insertar en la tabla del subtipo correspondiente
        let sqlSub = '';
        let subData = { codigoDispositivo: datos.codigoDispositivo };

        if (datos.tipo === 'C') {
          sqlSub = 'INSERT INTO COMPUTADORAS SET ?';
        } else {
          sqlSub = 'INSERT INTO AIRES_ACONDICIONADOS SET ?';
          subData.tipoUnidad = datos.tipoUnidad;
          subData.eficienciaSEER = datos.eficienciaSEER;
        }

        connection.query(sqlSub, subData, (err) => {
          if (err) return res.status(500).json(err);
          res.json({ error: false, mensaje: "Dispositivo registrado correctamente" });
        });
      });
    });
  }
}

// DELETE /device/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params; // codigoDispositivo

    // Limpiar alarmas de los sensores de este dispositivo debido a ON DELETE RESTRICT
    const sqlAlarmas = `
      DELETE FROM ALARMAS 
      WHERE codigoSensor IN (SELECT codigoSensor FROM SENSORES WHERE codigoDispositivo = ?)
    `;

    connection.query(sqlAlarmas, [id], (err) => {
      if (err) return res.status(500).json(err);

      // Eliminar el dispositivo
      // Las tablas COMPUTADORAS, AIRES_ACONDICIONADOS y SENSORES se borran por CASCADE
      connection.query('DELETE FROM DISPOSITIVOS WHERE codigoDispositivo = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ error: false, mensaje: "Dispositivo eliminado" });
      });
    });
  }
}

module.exports = {
  listarPorSala,
  crear,
  eliminar
};