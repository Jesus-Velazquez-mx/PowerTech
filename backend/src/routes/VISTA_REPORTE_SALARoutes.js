const express = require('express');
const router = express.Router();
const reportController = require('../controllers/VISTA_REPORTE_SALAController');

/**
 * GET /report/room/:id
 * Obtiene las métricas consolidadas (VISTA_REPORTE_SALA) de una sala específica.
 * El ":id" corresponde al codigoSala.
 */
router.get('/room/:id', reportController.obtenerReportePorSala);

module.exports = router;