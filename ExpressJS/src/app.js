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

/* Middleware de rutas */
app.use('/user', userRoutes);
app.use('/alarm', alarmRoutes)
app.use('/building', buildingRoutes)
app.use('/room', roomRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
