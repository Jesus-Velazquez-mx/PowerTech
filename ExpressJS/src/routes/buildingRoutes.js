const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

// GET /building/user/:id 
// Para obtener la lista de edificios de un usuario específico
router.get('/user/:id', buildingController.listarPorUsuario);

// POST /building
// Para registrar un nuevo edificio
router.post('/', buildingController.crear);

// DELETE /building/:id
router.delete('/:id', buildingController.eliminar);

module.exports = router;