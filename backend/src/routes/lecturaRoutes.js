
const express = require('express');
const router = express.Router();
const lecturaController = require('../controllers/lecturaController');

// POST /lecturas
// Recibe los datos enviados por la Raspberry Pi
router.post('/', lecturaController.crear);

module.exports = router;