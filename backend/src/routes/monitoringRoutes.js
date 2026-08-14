const express = require('express');
const router = express.Router();
const monitoringdata = require('../controllers/monitoringdata');

// GET /monitoring

// Ruta para obtener los meses y años que tienen lecturas registradas
router.get('/fechas-disponibles/:id', monitoringdata.obtenerFechasDisponibles);

// Ruta para el consumo general del edificio
router.get('/general/:id', monitoringdata.obtenerMonitoreoMensual);

// Ruta general para el desglose de todos los dispositivos (reemplaza a /comp y /aire)
router.get('/devices/:id', monitoringdata.obtenerDesgloseDispositivos);
router.get('/chart/:id', monitoringdata.obtenerHistorialGrafica);
module.exports = router;