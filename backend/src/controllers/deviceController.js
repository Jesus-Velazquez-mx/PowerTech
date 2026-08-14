const connection = require('../config/connection');

/* Validación general de dispositivo */
function validarDispositivo(datos) {
  const errores = [];
  const { codigoDispositivo, codigoSala, nombre } = datos;

  if (!codigoDispositivo || !codigoDispositivo.trim()) errores.push("El código del dispositivo es obligatorio");
  if (codigoDispositivo && codigoDispositivo.length > 10) errores.push("El código no debe superar los 10 caracteres");
  if (!codigoSala || !codigoSala.trim()) errores.push("El código de la sala es obligatorio");
  if (!nombre || !nombre.trim()) errores.push("El nombre es obligatorio");
  if (nombre && nombre.length > 100) errores.push("El nombre no debe superar los 100 caracteres");

  return errores;
}

// GET /device/room/:id
function listarPorSala(req, res) {
  if (connection) {
    const { id } = req.params;

    // Consulta simplificada sin el campo 'tipo' y trayendo el sensor único vinculado
    const sql = `
      SELECT 
        d.codigoDispositivo, d.codigoSala, d.nombre AS nombreDispositivo, d.marca,
        s.codigoSensor, s.nombreSensor, s.unidadMedida, s.activo,
        l.fechaHora, l.valor
      FROM DISPOSITIVOS d
      LEFT JOIN SENSORES s ON d.codigoDispositivo = s.codigoDispositivo
      LEFT JOIN (
        SELECT codigoSensor, MAX(fechaHora) as max_fecha
        FROM LECTURAS
        GROUP BY codigoSensor
      ) ultimas_lecturas ON s.codigoSensor = ultimas_lecturas.codigoSensor
      LEFT JOIN LECTURAS l ON ultimas_lecturas.codigoSensor = l.codigoSensor AND ultimas_lecturas.max_fecha = l.fechaHora
      WHERE d.codigoSala = ?
    `;

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);

      const dispositivosMap = {};
      rows.forEach(row => {
        if (!dispositivosMap[row.codigoDispositivo]) {
          dispositivosMap[row.codigoDispositivo] = {
            codigoDispositivo: row.codigoDispositivo,
            codigoSala: row.codigoSala,
            nombre: row.nombreDispositivo,
            marca: row.marca,
            sensor: null // Ahora es un solo objeto, no un arreglo
          };
        }

        if (row.codigoSensor) {
          dispositivosMap[row.codigoDispositivo].sensor = {
            codigoSensor: row.codigoSensor,
            nombreSensor: row.nombreSensor,
            unidadMedida: row.unidadMedida,
            activo: row.activo,
            ultimaLectura: row.valor !== null ? {
              valor: row.valor,
              fechaHora: row.fechaHora
            } : null
          };
        }
      });

      const dataFinal = Object.values(dispositivosMap);
      res.json({
        error: false,
        data: dataFinal,
        mensaje: dataFinal.length > 0 ? "Dispositivos recuperados" : "No hay dispositivos"
      });
    });
  }
}

// POST /device
function crear(req, res) {
  if (connection) {
    const datos = req.body;
    const errores = validarDispositivo(datos);

    if (errores.length > 0) return res.status(400).json({ error: true, mensaje: "Datos inválidos", detalles: errores });

    const sqlCheck = 'SELECT codigoDispositivo FROM DISPOSITIVOS WHERE codigoDispositivo = ?';
    connection.query(sqlCheck, [datos.codigoDispositivo], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) return res.status(400).json({ error: true, mensaje: "Este código ya existe" });

      const dispData = {
        codigoDispositivo: datos.codigoDispositivo,
        codigoSala: datos.codigoSala,
        nombre: datos.nombre,
        marca: datos.marca || ''
      };

      connection.query('INSERT INTO DISPOSITIVOS SET ?', dispData, (err) => {
        if (err) return res.status(500).json(err);

        // Si se envió un sensor para vincular desde la creación
        if (datos.codigoSensor) {
          const sqlVincular = 'UPDATE SENSORES SET codigoDispositivo = ? WHERE codigoSensor = ?';
          connection.query(sqlVincular, [datos.codigoDispositivo, datos.codigoSensor], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ error: false, mensaje: "Dispositivo registrado y sensor vinculado" });
          });
        } else {
          res.json({ error: false, mensaje: "Dispositivo registrado correctamente sin sensor" });
        }
      });
    });
  }
}

// PATCH /device/:id/sensor (NUEVO: Para reasignar el sensor desde la tarjeta)
function asignarSensor(req, res) {
  if (connection) {
    const { id } = req.params; // codigoDispositivo
    const { codigoSensor } = req.body; // El nuevo sensor a vincular

    // 1. Desvincular cualquier sensor que ya tuviera este dispositivo (Relación 1:1)
    const sqlDesvincular = 'UPDATE SENSORES SET codigoDispositivo = NULL WHERE codigoDispositivo = ?';

    connection.query(sqlDesvincular, [id], (err) => {
      if (err) return res.status(500).json(err);

      // Si el usuario eligió "Ninguno" (null o vacío), terminamos aquí
      if (!codigoSensor) {
        return res.json({ error: false, mensaje: "Sensor desvinculado del dispositivo" });
      }

      // 2. Vincular el nuevo sensor al dispositivo
      const sqlVincular = 'UPDATE SENSORES SET codigoDispositivo = ? WHERE codigoSensor = ?';
      connection.query(sqlVincular, [id, codigoSensor], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ error: false, mensaje: "Sensor asignado correctamente" });
      });
    });
  }
}

// DELETE /device/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params;

    // Primero, liberar el sensor dejándolo huérfano (para no borrar su historial)
    connection.query('UPDATE SENSORES SET codigoDispositivo = NULL WHERE codigoDispositivo = ?', [id], (err) => {
      if (err) return res.status(500).json(err);

      // Eliminar el dispositivo
      connection.query('DELETE FROM DISPOSITIVOS WHERE codigoDispositivo = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ error: false, mensaje: "Dispositivo eliminado" });
      });
    });
  }
}

// GET /device/user/:id
// GET /device/user/:id
function listarPorUsuario(req, res) {
  if (connection) {
    const { id } = req.params;

    const sql = `
      SELECT 
        d.codigoDispositivo, d.codigoSala, d.nombre AS nombreDispositivo, d.marca,
        sa.nombreSala, e.nombreEdificio,
        s.codigoSensor, s.nombreSensor, s.unidadMedida, s.activo
      FROM DISPOSITIVOS d
      INNER JOIN SALAS sa ON d.codigoSala = sa.codigoSala
      INNER JOIN EDIFICIOS e ON sa.codigoEdificio = e.codigoEdificio
      LEFT JOIN SENSORES s ON d.codigoDispositivo = s.codigoDispositivo
      WHERE e.idUsuario = ?
    `;

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);

      // Agrupamos los datos exactamente igual que en listarPorSala
      const dispositivosMap = {};
      rows.forEach(row => {
        if (!dispositivosMap[row.codigoDispositivo]) {
          dispositivosMap[row.codigoDispositivo] = {
            codigoDispositivo: row.codigoDispositivo,
            codigoSala: row.codigoSala,
            nombreSala: row.nombreSala,
            nombreEdificio: row.nombreEdificio,
            nombre: row.nombreDispositivo,
            marca: row.marca,
            sensor: null
          };
        }

        if (row.codigoSensor) {
          dispositivosMap[row.codigoDispositivo].sensor = {
            codigoSensor: row.codigoSensor,
            nombreSensor: row.nombreSensor,
            unidadMedida: row.unidadMedida,
            activo: row.activo
          };
        }
      });

      const dataFinal = Object.values(dispositivosMap);
      res.json({ error: false, data: dataFinal, mensaje: dataFinal.length > 0 ? "Recuperados" : "Sin dispositivos" });
    });
  }
}

// GET /device/room/:id/available-sensors (NUEVO: Obtener sensores libres en la sala)
function listarSensoresLibres(req, res) {
  if (connection) {
    const { id } = req.params; // codigoSala
    // Retorna sensores que no tienen dispositivo asignado, pero podrías ajustar según tu lógica de BD
    const sql = 'SELECT codigoSensor, nombreSensor FROM SENSORES WHERE codigoDispositivo IS NULL';

    connection.query(sql, [id], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json({ error: false, data: rows });
    });
  }
}



module.exports = {
  listarPorSala,
  crear,
  eliminar,
  listarPorUsuario,
  asignarSensor,
  listarSensoresLibres
};