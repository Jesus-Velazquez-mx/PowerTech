const connection = require('../config/connection');

// OBTENER LECTURAS DEL MES ACTUAL
function obtenerMonitoreoMensual(req, res) {
    if (connection) {
        const { id } = req.params;
        let sql = `
            select sum(l.valor) as total from lecturas L
                                                  INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
                                                  INNer join Dispositivos D on D.codigodispositivo = S.codigodispositivo
                                                  inner join Salas Sa on Sa.codigoSala = D.codigoSala
                                                  inner join edificios e on e.codigoedificio = sa.codigoedificio
            where sa.codigoedificio = ${connection.escape(id)} AND month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate());
        `;

        connection.query(sql, (err, rows) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    error: false,
                    data: rows,
                    mensaje: rows.length > 0 ? "Datos de monitoreo" : "No hay lecturas asignadas"
                });
            }
        });
    }
}

//Obtener lecturas mensuales filtrado por computadoras
function obtenerMonitoreoMensual_Computadoras(req, res) {
    if (connection) {
        const { id } = req.params;
        let sql = `
            select l.codigosensor, sum(l.valor) as total_valor from lecturas L
                                                                        INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
                                                                        INNer join Dispositivos D on D.codigodispositivo = S.codigodispositivo
                                                                        inner join Salas Sa on Sa.codigoSala = D.codigoSala
                                                                        inner join edificios e on e.codigoedificio = sa.codigoedificio
                                                                        inner join computadoras c on c.codigodispositivo = d.codigodispositivo
            where sa.codigoedificio =  ${connection.escape(id)} AND month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate())
            group by l.codigosensor;
        `;

        connection.query(sql, (err, rows) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    error: false,
                    data: rows,
                    mensaje: rows.length > 0 ? "Datos de monitoreo" : "No hay lecturas asignadas"
                });
            }
        });
    }
}

//Obtener lecturas mensuales filtrado por aires
function obtenerMonitoreoMensual_Aires(req, res) {
    if (connection) {
        const { id } = req.params;
        let sql = `
            select l.codigosensor, sum(l.valor) as total_valor from lecturas L
                                                                        INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
                                                                        INNer join Dispositivos D on D.codigodispositivo = S.codigodispositivo
                                                                        inner join Salas Sa on Sa.codigoSala = D.codigoSala
                                                                        inner join edificios e on e.codigoedificio = sa.codigoedificio
                                                                        inner join AIRES_ACONDICIONADOS ac on ac.codigodispositivo = d.codigodispositivo
            where sa.codigoedificio = ${connection.escape(id)}  AND month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate())
            group by l.codigosensor;
        `;

        connection.query(sql, (err, rows) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    error: false,
                    data: rows,
                    mensaje: rows.length > 0 ? "Datos de monitoreo" : "No hay lecturas asignadas"
                });
            }
        });
    }
}

module.exports = {
    obtenerMonitoreoMensual_Aires,
    obtenerMonitoreoMensual_Computadoras,
    obtenerMonitoreoMensual
};