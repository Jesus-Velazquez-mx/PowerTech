const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /user/login (para iniciar sesión)
router.post('/login', userController.login);

// GET /user/:id/perfil (para obtener edificios y salas)
router.get('/:id/perfil', userController.obtenerDatosRelacionados);

// POST /user/
router.post('/', userController.crear);

module.exports = router;