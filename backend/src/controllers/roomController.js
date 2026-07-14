const connection = require('../config/connection');

/* Validación */
function validarSala(datos) {
  const errores = [];
  const { codigoSala, codigoEdificio, nombreSala } = datos;

  if (!codigoSala || !codigoSala.trim()) errores.push("El código de la sala es obligatorio");
  if (codigoSala && codigoSala.length > 10) errores.push("El código no debe superar los 10 caracteres");

  if (!codigoEdificio || !codigoEdificio.trim()) errores.push("El código del edificio es obligatorio");
  
  if (nombreSala && nombreSala.length > 60) {
    errores.push("El nombre de la sala no debe superar los 60 caracteres");
  }

  return errores;
}

// GET /room/building/:id
// Lista todas las salas que pertenecen a un edificio específico
function listarPorEdificio(req, res) {
  if (connection) {
    const { id } = req.params; // codigoEdificio
    const sql = 'SELECT * FROM SALAS WHERE codigoEdificio = ?';

    connection.query(sql, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          error: false,
          data: rows,
          mensaje: rows.length > 0 ? "Salas recuperadas" : "Este edificio aún no tiene salas registradas"
        });
      }
    });
  }
}

// POST /room
function crear(req, res) {
  if (connection) {
    const datos = req.body;
    const errores = validarSala(datos);

    if (errores.length > 0) {
      return res.status(400).json({
        error: true,
        mensaje: "Datos de la sala inválidos",
        detalles: errores
      });
    }

    // Verificar si el código de sala ya existe
    const sqlCheck = 'SELECT codigoSala FROM SALAS WHERE codigoSala = ?';
    connection.query(sqlCheck, [datos.codigoSala], (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        return res.status(400).json({
          error: true,
          mensaje: "Este código de sala ya está registrado"
        });
      }

      // Inserción de la nueva sala
      const sqlInsert = 'INSERT INTO SALAS SET ?';
      connection.query(sqlInsert, datos, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json({
            error: false,
            data: result,
            mensaje: "Sala agregada correctamente"
          });
        }
      });
    });
  }
}

// DELETE /room/:id
function eliminar(req, res) {
  if (connection) {
    const { id } = req.params; // codigoSala

    // 1. Eliminar alarmas vinculadas a la sala debido a ON DELETE RESTRICT
    const sqlAlarmas = 'DELETE FROM ALARMAS WHERE codigoSala = ?';
    
    connection.query(sqlAlarmas, [id], (err) => {
      if (err) return res.status(500).json(err);

      // 2. Eliminar la sala
      // Los dispositivos vinculados se borrarán por ON DELETE CASCADE
      const sqlSala = 'DELETE FROM SALAS WHERE codigoSala = ?';
      
      connection.query(sqlSala, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          error: false,
          mensaje: "Sala y sus dispositivos eliminados con éxito",
          data: result
        });
      });
    });
  }
}

module.exports = {
  listarPorEdificio,
  crear,
  eliminar
};