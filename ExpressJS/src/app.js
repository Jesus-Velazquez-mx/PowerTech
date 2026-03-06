const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const userRoutes = require('./routes/userRoutes');
const alarmRoutes = require('./routes/alarmRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const VISTA_REPORTE_SALARoutes = require('./routes/VISTA_REPORTE_SALARoutes');
const sensorRoutes = require('./routes/sensorRoutes');

app.use('/user', userRoutes);
app.use('/alarm', alarmRoutes)
app.use('/building', buildingRoutes)
app.use('/report', VISTA_REPORTE_SALARoutes);
app.use('/room', roomRoutes);
app.use('/sensor', sensorRoutes);
app.use('/device', deviceRoutes);

app.post('/api/ai/consejo', async (req, res) => {
  try {
    const consulta = req.body?.datos?.consulta;

    if (!consulta) {
      return res.status(400).json({
        error: 'No se proporcionó una consulta.'
      });
    }

    const aiResponse = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Actúa como PowerBot, un asistente experto en eficiencia energética para PowerTech.
Responde de forma amable, breve (máximo 3 líneas) y técnica a la siguiente duda:
${consulta}`
    });

    const texto = aiResponse.text || 'Sin respuesta generada.';

    res.json({
      mensaje: texto
    });

  } catch (error) {
    console.error('Error en la IA:', error?.response?.data || error.message);

    res.status(500).json({
      error: 'Error al conectar con el servicio de IA.'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor PowerTech corriendo en http://localhost:${PORT}`);
});