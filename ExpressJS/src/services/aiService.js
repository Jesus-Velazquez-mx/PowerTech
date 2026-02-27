const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

module.exports = { generarConsejoAhorro };