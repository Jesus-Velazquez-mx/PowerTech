require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function test() {
    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Di hola'
        });

        console.log("RESPUESTA:", response.text);
    } catch (error) {
        console.error("ERROR REAL:", error);
    }
}

test();