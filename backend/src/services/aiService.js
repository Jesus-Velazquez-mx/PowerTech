const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Añadimos la conexión a la base de datos para la nueva función
const connection = require('../config/connection');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =============================================================
// 1. FUNCIÓN ORIGINAL (Mantenida intacta)
// =============================================================
async function generarConsejoAhorro(datosEdificio) {
  // Elegimos el modelo (flash es más rápido y barato/gratis)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Actúa como un asesor de energía inteligente para la empresa PowerTech.
    Datos actuales del edificio: ${JSON.stringify(datosEdificio)}.
    Genera un consejo de ahorro energético de máximo 2 líneas que sea motivador.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// =============================================================
// 2. NUEVA FUNCIÓN (PowerBot con consulta SQL a la base de datos)
// =============================================================
async function obtenerConsejoPowerBot(consulta) {
  let contextoConsumo = "No hay datos de consumo disponibles actualmente.";

  // Obtenemos los datos reales de todos los edificios desde la BD
  const sql = `
      SELECT
        e.nombreEdificio,
        CAST(IFNULL(SUM(l.valor), 0) AS DECIMAL(18,2)) AS total_kWh,
        (SELECT COUNT(*) FROM ALARMAS a WHERE a.codigoEdificio = e.codigoEdificio AND a.estado = 'ACTIVA') AS alertas
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

  // --- LOG PARA CLION/CONSOLA ---
  console.log(`\n--- [DEBUG] Reporte PowerTech ---`);
  if (rows.length > 0) {
    console.table(rows);
    contextoConsumo = rows.map(r => {
      const num = Number(r.total_kWh);
      return `- **${r.nombreEdificio}**: ${num.toFixed(2)} kWh (${r.alertas} alertas activas).`;
    }).join('\n');
  }
  console.log("----------------------------------\n");

  // Configuramos el modelo para el PowerBot
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
      Actúa como PowerBot, el asistente inteligente de PowerTech.
      
      ESTADO ACTUAL DE LA INFRAESTRUCTURA:
      ${contextoConsumo}
      
      CONSULTA DEL USUARIO:
      "${consulta}"
      
      REGLAS DE RESPUESTA:
      1. Usa Markdown: Negritas para datos importantes y listas para edificios.
      2. Sé técnico pero muy breve (máximo 4 líneas).
      3. Si hay alertas, recomienda revisar los sensores de ese edificio.
    `;

  const aiResponse = await model.generateContent(prompt);
  return aiResponse.response.text();
}

// Exportamos ambas funciones para que estén disponibles en el backend
module.exports = {
  generarConsejoAhorro,
  obtenerConsejoPowerBot
};