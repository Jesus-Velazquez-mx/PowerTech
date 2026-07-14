const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
/* Buscamos el dist */
const distPath = path.join(process.cwd(), 'public');
app.use(express.static(distPath));

/* Servicio de IA */
const aiService = require('./services/aiService');

/* Rutas de PowerTech */
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

/* Mensaje del bot */
app.post('/api/ai/consejo', async (req, res) => {
  try {
    const { consulta } = req.body?.datos || {};

    if (!consulta) {
      return res.status(400).json({ error: 'No se proporcionó una consulta.' });
    }

    // Llamamos a la función delegada al servicio externo
    const texto = await aiService.obtenerConsejoPowerBot(consulta);

    res.json({ mensaje: texto });

  } catch (error) {
    console.error('Error en PowerBot:', error.message);
    res.status(500).json({ error: 'Error en el servicio de PowerBot.' });
  }
});

// Cualquier ruta GET que no coincida con los endpoints de arriba,
// será redirigida al index.html del frontend para que Vue Router la maneje.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de PowerTech corriendo en el puerto ${PORT}`);
});