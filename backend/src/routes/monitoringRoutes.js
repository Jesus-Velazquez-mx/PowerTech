const express = require('express');
const router = express.Router();
const monitoringdata = require('../controllers/monitoringdata');

// GET /monitoring

router.get('/general/:id', monitoringdata.obtenerMonitoreoMensual);

router.get('/comp/:id', monitoringdata.obtenerMonitoreoMensual_Computadoras);

router.get('/aire/:id', monitoringdata.obtenerMonitoreoMensual_Aires);

module.exports = router;


