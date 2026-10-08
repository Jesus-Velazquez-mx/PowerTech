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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  // Si la BD falla (ej. ETIMEDOUT con RDS), PowerBot responde igual sin datos
  try {
    const [rows] = await connection.promise().query(sql);

    // --- LOG PARA CLION/CONSOLA ---
    console.log(`\n--- [DEBUG] Reporte PowerTech ---`);
    if (rows.length > 0) {
      console.table(rows);
      contextoConsumo = rows.map(r => {
        const num = Number(r.total_kWh);
        return `- ${r.nombreEdificio}: ${num.toFixed(2)} kWh este mes, ${r.alertas} alertas activas.`;
      }).join('\n');
    }
    console.log("----------------------------------\n");
  } catch (error) {
    console.error('PowerBot: no se pudieron obtener datos de la BD:', error.message);
    contextoConsumo = "No se pudo consultar la base de datos en este momento. Avisa al usuario que los datos en vivo no están disponibles.";
  }

  const fecha = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  // Las reglas van como instrucción de sistema para que el texto del usuario no las sobrescriba
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `
      Eres PowerBot, el asistente inteligente de PowerTech, una plataforma de monitoreo energético de edificios.
      Responde siempre en español.

      ESTADO DE LA INFRAESTRUCTURA (${fecha}):
      ${contextoConsumo}

      REGLAS DE RESPUESTA:
      1. Usa Markdown: negritas para datos importantes y listas para edificios.
      2. Sé técnico pero muy breve (máximo 4 líneas).
      3. Si un edificio tiene alertas activas, recomienda revisar sus sensores.
      4. Usa solo los datos de arriba; no inventes cifras ni edificios.
      5. Si la pregunta no tiene relación con energía o PowerTech, indícalo amablemente y redirige la conversación.
    `
  });

  const aiResponse = await model.generateContent(String(consulta).trim().slice(0, 1000));
  return aiResponse.response.text();
}

// Exportamos ambas funciones para que estén disponibles en el backend
module.exports = {
  generarConsejoAhorro,
  obtenerConsejoPowerBot
};