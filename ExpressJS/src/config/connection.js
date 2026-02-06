const mysql = require('mysql');

const objectConnection = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    // "password": ""
    "database": "powertech"
}

const myConn = mysql.createConnection(objectConnection)

myConn.connect((error) => {
    if(error){
        console.log("Ocurrió un error", error);
    }else{
        console.log("Base de datos conectada");
    }
})

module.exports = myConn;