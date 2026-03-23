const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Paquete oficial de Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
const connection = require('./config/connection');

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Importación de rutas
const userRoutes = require('./routes/userRoutes');
const alarmRoutes = require('./routes/alarmRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const VISTA_REPORTE_SALARoutes = require('./routes/VISTA_REPORTE_SALARoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');

app.use('/user', userRoutes);
app.use('/alarm', alarmRoutes);
app.use('/building', buildingRoutes);
app.use('/report', VISTA_REPORTE_SALARoutes);
app.use('/room', roomRoutes);
app.use('/sensor', sensorRoutes);
app.use('/device', deviceRoutes);
app.use('/monitoring', monitoringRoutes);

// =============================================================
// ENDPOINT POWERBOT: CONSEJOS BASADOS EN DATOS REALES
// =============================================================
app.post('/api/ai/consejo', async (req, res) => {
  try {
    const { consulta, edificioId } = req.body?.datos || {};

    if (!consulta) {
      return res.status(400).json({ error: 'No se proporcionó una consulta.' });
    }

    // 1. OBTENER LECTURAS DE TODOS LOS EDIFICIOS (SIN WHERE)
    let contextoConsumo = "No hay datos de consumo disponibles actualmente.";

    const sql = `
      SELECT
        e.nombreEdificio,
        CAST(IFNULL(SUM(l.valor), 0) AS DECIMAL(18,2)) AS total_kWh,
        (SELECT COUNT(*)
         FROM ALARMAS a
         WHERE a.codigoEdificio = e.codigoEdificio
           AND a.estado = 'ACTIVA') AS alertas
      FROM EDIFICIOS e
             LEFT JOIN SALAS sa ON e.codigoEdificio = sa.codigoEdificio
             LEFT JOIN DISPOSITIVOS d ON sa.codigoSala = d.codigoSala
             LEFT JOIN SENSORES s ON d.codigoDispositivo = s.codigoDispositivo
             LEFT JOIN LECTURAS l ON s.codigoSensor = l.codigoSensor
        AND MONTH(l.fechaHora) = MONTH(CURDATE())
        AND YEAR(l.fechaHora) = YEAR(CURDATE())
      GROUP BY e.codigoEdificio, e.nombreEdificio;
    `;

    const [rows] = await connection.promise().query(sql);

    // --- IMPRESIÓN EN LA CONSOLA DE CLION ---
    console.log(`\n--- [DEBUG] Datos de PowerTech ---`);
    if (rows.length > 0) {
      console.table(rows);

      // Mapeamos los datos asegurando que total_kWh sea un número
      contextoConsumo = rows.map(r => {
        // Convertimos explícitamente a número para evitar el error de .toFixed()
        const consumoNumerico = Number(r.total_kWh);
        return `- ${r.nombreEdificio}: ${consumoNumerico.toFixed(2)} kWh, ${r.alertas} alertas.`;
      }).join('\n');
    } else {
      console.log("⚠️ No se encontraron edificios en la base de datos.");
    }
    console.log("----------------------------------\n");

    // 2. CONFIGURACIÓN DEL MODELO (Asegúrate de que el nombre sea correcto)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Actúa como PowerBot, un asistente experto en eficiencia energética para PowerTech.
      ESTADO ACTUAL DE LOS EDIFICIOS:
      ${contextoConsumo}
      
      PREGUNTA DEL USUARIO:
      "${consulta}"
      
      INSTRUCCIÓN:
      Responde de forma amable, técnica y breve (3 líneas). Usa los datos reales si es necesario.
    `;

    // 3. GENERACIÓN DE CONTENIDO
    const aiResponse = await model.generateContent(prompt);
    const texto = aiResponse.response.text() || 'Sin respuesta generada.';

    res.json({ mensaje: texto });

  } catch (error) {
    console.error('❌ Error en PowerBot:', error.message);
    res.status(500).json({
      error: 'Error en el servicio de PowerBot.',
      detalle: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PowerTech listo en puerto ${PORT}`);
});