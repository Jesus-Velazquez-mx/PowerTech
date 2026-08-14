const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Creamos un "pool" de conexiones. Esto es vital para AWS RDS, 
// ya que maneja múltiples peticiones simultáneas sin saturar el servidor.
const myConn = mysql.createPool({
    host: "database-powertech.cpyy4ksi8y9n.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "Jesu2016",
    database: "PowerTech",

    // Configuración obligatoria de AWS para conexiones seguras
    ssl: {
        rejectUnauthorized: false,
        // global-pundle.pem son las llaves que nos da AWS
        ca: fs.readFileSync(path.join(__dirname, 'global-bundle.pem'))
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probamos la conexión al arrancar el servidor
myConn.getConnection((error, connection) => {
    if (error) {
        console.error("Ocurrió un error al conectar con AWS RDS:", error);
    } else {
        console.log("¡Base de datos AWS RDS conectada con éxito!");
        connection.release(); // Liberamos la conexión de prueba
    }
});

module.exports = myConn;