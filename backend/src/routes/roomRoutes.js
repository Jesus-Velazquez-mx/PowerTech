const express = require('express');
const router = express.Router();
// Importamos el controlador de salas
const roomController = require('../controllers/roomController');

// GET /room/building/:id
// Obtiene la lista de salas vinculadas a un edificio específico
router.get('/building/:id', roomController.listarPorEdificio);

// POST /room
// Registra una nueva sala en la base de datos
router.post('/', roomController.crear);

// DELETE /room/:id
// Elimina una sala y limpia sus alarmas vinculadas
router.delete('/:id', roomController.eliminar);

module.exports = router;