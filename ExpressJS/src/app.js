const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require('./routes/userRoutes')
const alarmRoutes = require('./routes/alarmRoutes')
const buildingRoutes = require('./routes/buildingRoutes')
const roomRoutes = require('./routes/roomRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const VISTA_REPORTE_SALARoutes = require('./routes/VISTA_REPORTE_SALARoutes');

/* Middleware de rutas */
app.use('/user', userRoutes);
app.use('/alarm', alarmRoutes)
app.use('/building', buildingRoutes)
app.use('/report', VISTA_REPORTE_SALARoutes);
app.use('/room', roomRoutes);
app.use('/device', deviceRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
