// Importar conexión de la BD
const connection = require('../config/connection');

/* Validación para el inicio de sesión */
function validarLogin(credenciales) {
  const errores = [];
  const { email, contrasena } = credenciales;

  if (!email || !email.trim()) {
    errores.push("El correo electrónico es obligatorio");
  }
  if (!contrasena || !contrasena.trim()) {
    errores.push("La contraseña es obligatoria");
  }
  return errores;
}

// POST /login
function login(req, res) {
  if (connection) {
    const { email, contrasena } = req.body;
    
    const errores = validarLogin({ email, contrasena });
    if (errores.length > 0) {
      return res.status(400).json({
        error: true,
        mensaje: "Datos incompletos",
        detalles: errores
      });
    }

    // Buscamos al usuario por email y contraseña
    let sql = 'SELECT idUsuario, nombre, email FROM USUARIOS WHERE email = ? AND contrasena = ?';
    connection.query(sql, [email, contrasena], (err, results) => {
      if (err) {
        res.status(500).json(err);
      } else {
        if (results.length > 0) {
          res.json({
            error: false,
            data: results[0],
            mensaje: "Inicio de sesión exitoso"
          });
        } else {
          res.status(401).json({
            error: true,
            mensaje: "Correo o contraseña incorrectos"
          });
        }
      }
    });
  }
}

// GET /user/:id/perfil
/* Obtiene todos los edificios y sus respectivas salas relacionadas con el usuario */
function obtenerDatosRelacionados(req, res) {
  if (connection) {
    const { id } = req.params;

    // Usamos un LEFT JOIN para traer edificios y sus salas en una sola consulta
    let sql = `
      SELECT 
        e.codigoEdificio, 
        e.nombreEdificio, 
        e.horarioEntrada, 
        e.horarioSalida,
        s.codigoSala,
        s.nombreSala
      FROM EDIFICIOS e
      LEFT JOIN SALAS s ON e.codigoEdificio = s.codigoEdificio
      WHERE e.idUsuario = ${connection.escape(id)}
    `;

    connection.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        // Estructuramos los datos para que sean fáciles de leer en el frontend (Vue.js)
        const edificiosMap = {};

        rows.forEach(row => {
          if (!edificiosMap[row.codigoEdificio]) {
            edificiosMap[row.codigoEdificio] = {
              codigo: row.codigoEdificio,
              nombre: row.nombreEdificio,
              horario: `${row.horarioEntrada} - ${row.horarioSalida}`,
              salas: []
            };
          }
          if (row.codigoSala) {
            edificiosMap[row.codigoEdificio].salas.push({
              codigo: row.codigoSala,
              nombre: row.nombreSala
            });
          }
        });

        const dataFinal = Object.values(edificiosMap);
        res.json({
          error: false,
          data: dataFinal,
          mensaje: dataFinal.length > 0 ? "Datos recuperados" : "El usuario no tiene edificios registrados"
        });
      }
    });
  }
}

module.exports = {
  login,
  obtenerDatosRelacionados
};