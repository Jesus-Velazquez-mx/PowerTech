const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET /device/room/:id
// Obtiene la lista de dispositivos de una sala específica
router.get('/room/:id', deviceController.listarPorSala);

// POST /device
// Registra un nuevo dispositivo (Computadora o Aire Acondicionado)
router.post('/', deviceController.crear);

// DELETE /device/:id
// Elimina un dispositivo y limpia las alarmas de sus sensores
router.delete('/:id', deviceController.eliminar);

module.exports = router;