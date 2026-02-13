const connection = require('../config/connection');

// Función de validación interna siguiendo tu estilo de userController
function validarEdificio(datos) {
  const errores = [];
  const { codigoEdificio, nombreEdificio, horarioEntrada, horarioSalida, idUsuario } = datos;

  if (!codigoEdificio || !codigoEdificio.trim()) errores.push("El código del edificio es obligatorio");
  if (codigoEdificio && codigoEdificio.length > 10) errores.push("El código no debe superar los 10 caracteres");

  if (!nombreEdificio || !nombreEdificio.trim()) errores.push("El nombre del edificio es obligatorio");
  if (nombreEdificio && nombreEdificio.length > 120) errores.push("El nombre no debe superar los 120 caracteres");

  if (!horarioEntrada) errores.push("El horario de entrada es obligatorio");
  if (!horarioSalida) errores.push("El horario de salida es obligatorio");

  // Validación lógica de negocio (reflejando el CHECK de SQL)
  if (horarioEntrada && horarioSalida && horarioEntrada >= horarioSalida) {
    errores.push("El horario de entrada debe ser menor al horario de salida");
  }

  if (!idUsuario) errores.push("La referencia al usuario es obligatoria");

  return errores;
}

// GET /building/user/:idUsuario
function listarPorUsuario(req, res) {
  if (connection) {
    const { id } = req.params; // ID del usuario logueado
    const sql = 'SELECT * FROM EDIFICIOS WHERE idUsuario = ?';

    connection.query(sql, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          error: false,
          data: rows,
          mensaje: rows.length > 0 ? "Edificios recuperados" : "Aún no tienes edificios registrados"
        });
      }
    });
  }
}

// POST /building
function crear(req, res) {
  if (connection) {
    const datos = req.body;
    const errores = validarEdificio(datos);

    if (errores.length > 0) {
      return res.status(400).json({
        error: true,
        mensaje: "Datos del edificio inválidos",
        detalles: errores
      });
    }

    // Verificamos si el código de edificio ya existe
    const sqlCheck = 'SELECT codigoEdificio FROM EDIFICIOS WHERE codigoEdificio = ?';
    connection.query(sqlCheck, [datos.codigoEdificio], (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        return res.status(400).json({
          error: true,
          mensaje: "Este código de edificio ya está registrado"
        });
      }

      // Inserción final
      const sqlInsert = 'INSERT INTO EDIFICIOS SET ?';
      connection.query(sqlInsert, datos, (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json({
            error: false,
            data: result,
            mensaje: "Edificio agregado correctamente"
          });
        }
      });
    });
  }
}

module.exports = {
  listarPorUsuario,
  crear
};