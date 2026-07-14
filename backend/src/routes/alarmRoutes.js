const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarmController');

/* Ruta para obtener alarmas de un usuario específico */
router.get('/user/:id', alarmController.obtenerAlarmasPorUsuario);

module.exports = router;