const express = require('express');
const router = express.Router();
// Importamos el controlador de sensores
const sensorController = require('../controllers/sensorController');

// GET /sensor/user/:id
// Obtiene la lista de sensores vinculados a un usuario específico (todos los edificios)
router.get('/user/:id', sensorController.listarPorUsuario);

// GET /sensor/device/:id
// Obtiene la lista de sensores vinculados a un dispositivo específico
router.get('/device/:id', sensorController.listarPorDispositivo);

// POST /sensor
// Registra un nuevo sensor en la base de datos
router.post('/', sensorController.crear);

// DELETE /sensor/:id
// Elimina un sensor y limpia sus alarmas vinculadas
router.delete('/:id', sensorController.eliminar);

// PATCH /sensor/:id/estado
// Actualiza el estado de un sensor (activo/inactivo)
router.patch('/:id/estado', sensorController.actualizarEstado);

module.exports = router;