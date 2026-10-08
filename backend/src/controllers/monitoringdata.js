const connection = require('../config/connection');

const HORA_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Convierte "HH:MM-HH:MM,HH:MM-HH:MM" en pares [inicio, fin] válidos (descarta lo que no sea hora)
function parseRangos(rangosParam) {
    if (!rangosParam) return [];
    return String(rangosParam).split(',')
        .map(r => r.split('-'))
        .filter(([inicio, fin]) => HORA_RE.test(inicio) && HORA_RE.test(fin));
}

// Función auxiliar para construir el filtro de tiempo SQL
function buildTimeFilter(rangosParam) {
    const rangos = parseRangos(rangosParam).map(r => r.join('-'));
    if (rangos.length === 0) return "";
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
            FROM LECTURAS l
            INNER JOIN SENSORES s on s.codigoSensor = l.codigoSensor
            INNER JOIN DISPOSITIVOS d on d.codigoDispositivo = s.codigoDispositivo
            INNER JOIN SALAS sa on sa.codigoSala = d.codigoSala
            WHERE sa.codigoEdificio = ${connection.escape(id)}
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
            FROM LECTURAS l
            INNER JOIN SENSORES s on s.codigoSensor = l.codigoSensor
            INNER JOIN DISPOSITIVOS d on d.codigoDispositivo = s.codigoDispositivo
            INNER JOIN SALAS sa on sa.codigoSala = d.codigoSala
            WHERE sa.codigoEdificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL};
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
            SELECT d.nombre as nombre_dispositivo, sum(l.valor) as total_valor 
            FROM LECTURAS l
            INNER JOIN SENSORES s on s.codigoSensor = l.codigoSensor
            INNER JOIN DISPOSITIVOS d on d.codigoDispositivo = s.codigoDispositivo
            INNER JOIN SALAS sa on sa.codigoSala = d.codigoSala
            WHERE sa.codigoEdificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL}
            GROUP BY d.codigoDispositivo
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
            FROM LECTURAS l
            INNER JOIN SENSORES s on s.codigoSensor = l.codigoSensor
            INNER JOIN DISPOSITIVOS d on d.codigoDispositivo = s.codigoDispositivo
            INNER JOIN SALAS sa on sa.codigoSala = d.codigoSala
            WHERE sa.codigoEdificio = ${connection.escape(id)} AND ${filterDate} ${timeFilterSQL}
            GROUP BY ${groupClause}
            ORDER BY etiqueta ASC;
        `;

        connection.query(sql, (err, rows) => {
            if (err) res.status(500).json(err);
            else res.json({ error: false, data: rows });
        });
    }
}

// Condición SQL para saber si una hora cae en alguno de los bloques (intervalos semiabiertos [inicio, fin))
function condicionHorario(rangos, col = 'TIME(l.fechahora)') {
    if (rangos.length === 0) return 'FALSE';
    const conds = rangos.map(([inicio, fin]) => {
        const ini = `${inicio}:00`;
        const f = fin === '23:59' ? '24:00:00' : `${fin}:00`;
        // Si el bloque cruza la medianoche (ej. 22:00 a 02:00)
        return (inicio < fin || fin === '23:59')
            ? `(${col} >= '${ini}' AND ${col} < '${f}')`
            : `(${col} >= '${ini}' OR ${col} < '${f}')`;
    });
    return `(${conds.join(' OR ')})`;
}

// 5. DATOS PARA EL RECIBO ESTIMADO (consumo por periodo tarifario, por dispositivo y demanda máxima)
function obtenerDatosRecibo(req, res) {
    if (!connection) return;
    const { id } = req.params;
    const mes = parseInt(req.query.mes, 10);
    const anio = parseInt(req.query.anio, 10);
    if (!mes || !anio || mes < 1 || mes > 12) {
        return res.status(400).json({ error: true, message: 'Parámetros mes y anio requeridos' });
    }

    const punta = condicionHorario(parseRangos(req.query.punta));
    const intermedio = condicionHorario(parseRangos(req.query.intermedio));
    const base = condicionHorario(parseRangos(req.query.base));
    // Prioridad: Punta > Intermedio > Base; lo que no caiga en ningún bloque se considera Base
    const periodo = `CASE WHEN ${punta} THEN 'P' WHEN ${intermedio} THEN 'I' WHEN ${base} THEN 'B' ELSE 'B' END`;

    const pad = n => String(n).padStart(2, '0');
    const fecha = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
    const inicioMes = fecha(new Date(anio, mes - 1, 1));
    const finMes = fecha(new Date(anio, mes, 1));
    const inicioHistorial = fecha(new Date(anio, mes - 6, 1));

    // Para la estimación solo se usa la primera lectura de cada hora por sensor (ej. 5:00, 6:00, 7:00...)
    const joins = (desde, hasta) => `
        FROM LECTURAS l
        INNER JOIN (
            SELECT codigoSensor, MIN(fechaHora) as fechaHora
            FROM LECTURAS
            WHERE fechaHora >= '${desde}' AND fechaHora < '${hasta}'
            GROUP BY codigoSensor, DATE(fechaHora), HOUR(fechaHora)
        ) lh on lh.codigoSensor = l.codigoSensor AND lh.fechaHora = l.fechaHora
        INNER JOIN SENSORES s on s.codigoSensor = l.codigoSensor
        INNER JOIN DISPOSITIVOS d on d.codigoDispositivo = s.codigoDispositivo
        INNER JOIN SALAS sa on sa.codigoSala = d.codigoSala
        WHERE sa.codigoEdificio = ${connection.escape(id)}`;

    const sqlDispositivos = `
        SELECT d.codigoDispositivo as codigo, d.nombre as nombre,
            SUM(CASE WHEN ${periodo} = 'B' THEN l.valor ELSE 0 END) as base,
            SUM(CASE WHEN ${periodo} = 'I' THEN l.valor ELSE 0 END) as intermedio,
            SUM(CASE WHEN ${periodo} = 'P' THEN l.valor ELSE 0 END) as punta,
            SUM(l.valor) as total,
            MAX(l.fechahora) as ultimaLectura
        ${joins(inicioMes, finMes)}
        GROUP BY d.codigoDispositivo, d.nombre
        ORDER BY total DESC;
    `;

    // La demanda se estima como el kWh registrado en cada hora (= kW promedio de esa hora)
    const sqlHistorial = `
        SELECT YEAR(h.dia) as anio, MONTH(h.dia) as mes,
            SUM(h.base) as base, SUM(h.intermedio) as intermedio, SUM(h.punta) as punta,
            SUM(h.kwh) as total,
            MAX(h.kwh) as demandaMax,
            MAX(CASE WHEN h.periodo = 'P' THEN h.kwh ELSE 0 END) as demandaPunta
        FROM (
            SELECT DATE(l.fechahora) as dia, HOUR(l.fechahora) as hora,
                SUM(l.valor) as kwh,
                SUM(CASE WHEN ${periodo} = 'B' THEN l.valor ELSE 0 END) as base,
                SUM(CASE WHEN ${periodo} = 'I' THEN l.valor ELSE 0 END) as intermedio,
                SUM(CASE WHEN ${periodo} = 'P' THEN l.valor ELSE 0 END) as punta,
                MAX(${periodo}) as periodo
            ${joins(inicioHistorial, finMes)}
            GROUP BY DATE(l.fechahora), HOUR(l.fechahora)
        ) h
        GROUP BY YEAR(h.dia), MONTH(h.dia)
        ORDER BY anio ASC, mes ASC;
    `;

    connection.query(sqlDispositivos, (err, dispositivos) => {
        if (err) return res.status(500).json(err);
        connection.query(sqlHistorial, (err2, historial) => {
            if (err2) return res.status(500).json(err2);
            res.json({ error: false, data: { dispositivos, historial } });
        });
    });
}

module.exports = {
    obtenerFechasDisponibles,
    obtenerMonitoreoMensual,
    obtenerDesgloseDispositivos,
    obtenerHistorialGrafica,
    obtenerDatosRecibo
};