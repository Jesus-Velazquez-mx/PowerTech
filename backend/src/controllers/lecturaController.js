const connection = require('../config/connection');

function crear(req, res) {
    if (connection) {
        const { codigoSensor, fechaHora, valor, detalle } = req.body;
        const errores = [];

        // Validaciones básicas según las restricciones de la base de datos
        if (!codigoSensor || !codigoSensor.trim()) errores.push("El código del sensor es obligatorio");
        if (!fechaHora || !fechaHora.trim()) errores.push("La fecha y hora son obligatorias");
        if (valor === undefined || valor === null) errores.push("El valor de la lectura es obligatorio");

        if (errores.length > 0) {
            return res.status(400).json({ error: true, mensaje: "Datos incompletos", detalles: errores });
        }

        // Inserción directa en la tabla LECTURAS
        const sql = 'INSERT INTO LECTURAS (codigoSensor, fechaHora, valor, detalle) VALUES (?, ?, ?, ?)';

        connection.query(sql, [codigoSensor, fechaHora, valor, detalle || null], (err, result) => {
            if (err) {
                // Captura errores como duplicidad de llave primaria (mismo sensor en el mismo segundo)
                return res.status(500).json({ error: true, mensaje: "Error al guardar la lectura", detalles: err });
            }

            res.json({
                error: false,
                mensaje: "Lectura registrada correctamente"
            });
        });
    }
}

module.exports = {
    crear
};