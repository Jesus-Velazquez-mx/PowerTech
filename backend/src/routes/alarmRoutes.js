const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarmController');

/* Ruta para obtener alarmas de un usuario específico */
router.get('/user/:id', alarmController.obtenerAlarmasPorUsuario);

/* Ruta para modificar una alarma */
router.patch('/:id/estado', alarmController.actualizarEstado);

module.exports = router;