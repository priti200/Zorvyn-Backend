const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary with total income, expenses, net balance, category totals
 */
router.get('/summary', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), dashboardController.getSummary);

/**
 * @swagger
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to include
 *     responses:
 *       200:
 *         description: Monthly income/expense trends
 */
router.get('/trends', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), dashboardController.getTrends);

module.exports = router;
