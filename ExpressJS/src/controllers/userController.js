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

function validarRegistro(usuario) {
  const errores = [];
  const { nombre, email, contrasena } = usuario;

  if (!nombre || !nombre.trim()) errores.push("El nombre es obligatorio");
  if (!email || !email.trim()) errores.push("El correo electrónico es obligatorio");
  if (!contrasena || !contrasena.trim()) errores.push("La contraseña es obligatoria");
  
  if (nombre && nombre.length > 50) errores.push("El nombre no debe superar 50 caracteres");
  if (email && email.length > 120) errores.push("El correo no debe superar 120 caracteres");
  if (contrasena && contrasena.length > 255) errores.push("La contraseña es demasiado larga");

  return errores;
}

/* Para hacer el login*/
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

/* Para crear un usuario */
function crear(req, res) {
  if (connection) {
    const { nombre, email, contrasena } = req.body;
    // Validar campos obligatorios y longitud
    const errores = validarRegistro(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ error: true, mensaje: "Errores de validación", detalles: errores });
    }
    // Verificar si el nombre o el email ya existen
    const sqlCheck = 'SELECT nombre, email FROM USUARIOS WHERE nombre = ? OR email = ?';
    connection.query(sqlCheck, [nombre, email], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) {
        // Identificar cuál es el duplicado
        const existeNombre = results.some(u => u.nombre === nombre);
        const existeEmail = results.some(u => u.email === email);
        let mensaje = "";
        if (existeNombre && existeEmail) mensaje = "El nombre de usuario y el correo ya están registrados";
        else if (existeNombre) mensaje = "El nombre de usuario ya está en uso";
        else if (existeEmail) mensaje = "El correo electrónico ya está registrado";
        return res.status(400).json({
          error: true,
          mensaje: mensaje
        });
      }
      // Si no hay duplicados, procedemos a insertar
      const sqlInsert = 'INSERT INTO USUARIOS SET ?';
      connection.query(sqlInsert, { nombre, email, contrasena }, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json({
          error: false,
          data: rows,
          mensaje: "Usuario registrado con éxito"
        });
      });
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
  obtenerDatosRelacionados,
  crear
};