const connection = require('../config/connection');

// Función auxiliar para construir el filtro de tiempo SQL
function buildTimeFilter(rangosParam) {
    if (!rangosParam) return "";
    const rangos = rangosParam.split(',');
    const conditions = rangos.map(r => {
        let [inicio, fin] = r.split('-');
        // Aseguramos formato HH:MM:SS para la base de datos
        if (inicio.length === 5) inicio += ':00';
        if (fin.length === 5) fin += ':59';
        return `(TIME(l.fechahora) >= '${inicio}' AND TIME(l.fechahora) <= '${fin}')`;
    });
    return conditions.length > 0 ? ` AND (${conditions.join(' OR ')}) ` : "";
}

// 1. OBTENER MESES Y AÑOS QUE TIENEN LECTURAS
function obtenerFechasDisponibles(req, res) {
    if (connection) {
        const { id } = req.params;
        let sql = `
            SELECT DISTINCT month(l.fechahora) as mes, year(l.fechahora) as anio 
            FROM lecturas L
            INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
            INNER JOIN Dispositivos D on D.codigodispositivo = S.codigodispositivo
            INNER JOIN Salas Sa on Sa.codigoSala = D.codigoSala
            WHERE sa.codigoedificio = ${connection.escape(id)}
            ORDER BY anio DESC, mes DESC;
        `;
        connection.query(sql, (err, rows) => {
            if (err) res.status(500).json(err);
            else res.json({ error: false, data: rows });
        });
    }
}

// 2. OBTENER CONSUMO TOTAL DEL MES/AÑO Y HORARIO SELECCIONADO
function obtenerMonitoreoMensual(req, res) {
    if (connection) {
        const { id } = req.params;
        const { mes, anio, rangos } = req.query;

        const timeFilterSQL = buildTimeFilter(rangos);
        const filterDate = (mes && anio)
            ? `month(l.fechahora) = ${connection.escape(mes)} AND year(l.fechahora) = ${connection.escape(anio)}`
            : `month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate())`;

        let sql = `
            SELECT sum(l.valor) as total 
            FROM lecturas L
            INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
            INNER JOIN Dispositivos D on D.codigodispositivo = S.codigodispositivo
            INNER JOIN Salas Sa on Sa.codigoSala = D.codigoSala
            WHERE sa.codigoedificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL};
        `;

        connection.query(sql, (err, rows) => {
            if (err) res.status(500).json(err);
            else res.json({ error: false, data: rows });
        });
    }
}

// 3. OBTENER DESGLOSE GENERAL POR DISPOSITIVOS (CON FILTRO DE HORARIO)
function obtenerDesgloseDispositivos(req, res) {
    if (connection) {
        const { id } = req.params;
        const { mes, anio, rangos } = req.query;

        const timeFilterSQL = buildTimeFilter(rangos);
        const filterDate = (mes && anio)
            ? `month(l.fechahora) = ${connection.escape(mes)} AND year(l.fechahora) = ${connection.escape(anio)}`
            : `month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate())`;

        let sql = `
            SELECT D.nombre as nombre_dispositivo, sum(l.valor) as total_valor 
            FROM lecturas L
            INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
            INNER JOIN Dispositivos D on D.codigodispositivo = S.codigodispositivo
            INNER JOIN Salas Sa on Sa.codigoSala = D.codigoSala
            WHERE sa.codigoedificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL}
            GROUP BY D.codigodispositivo
            ORDER BY total_valor DESC;
        `;

        connection.query(sql, (err, rows) => {
            if (err) res.status(500).json(err);
            else res.json({ error: false, data: rows });
        });
    }
}

// 4. OBTENER DATOS REALES PARA LA GRÁFICA (CON FILTRO DE HORARIO)
function obtenerHistorialGrafica(req, res) {
    if (connection) {
        const { id } = req.params;
        const { mes, anio, periodo, rangos } = req.query;

        const timeFilterSQL = buildTimeFilter(rangos);
        let selectClause = "";
        let groupClause = "";

        if (periodo === 'dia') {
            selectClause = "HOUR(l.fechahora) as etiqueta";
            groupClause = "HOUR(l.fechahora)";
        } else if (periodo === 'semana') {
            selectClause = "WEEKDAY(l.fechahora) as etiqueta";
            groupClause = "WEEKDAY(l.fechahora)";
        } else {
            selectClause = "DAY(l.fechahora) as etiqueta";
            groupClause = "DAY(l.fechahora)";
        }

        const filterDate = (mes && anio)
            ? `month(l.fechahora) = ${connection.escape(mes)} AND year(l.fechahora) = ${connection.escape(anio)}`
            : `month(l.fechahora) = month(curdate()) AND year(l.fechahora) = year(curdate())`;

        let sql = `
            SELECT ${selectClause}, sum(l.valor) as total_valor 
            FROM lecturas L
            INNER JOIN Sensores S on S.codigoSensor = L.codigosensor
            INNER JOIN Dispositivos D on D.codigodispositivo = S.codigodispositivo
            INNER JOIN Salas Sa on Sa.codigoSala = D.codigoSala
            WHERE sa.codigoedificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL}
            GROUP BY ${groupClause}
            ORDER BY etiqueta ASC;
        `;

        connection.query(sql, (err, rows) => {
            if (err) res.status(500).json(err);
            else res.json({ error: false, data: rows });
        });
    }
}

module.exports = {
    obtenerFechasDisponibles,
    obtenerMonitoreoMensual,
    obtenerDesgloseDispositivos,
    obtenerHistorialGrafica
};