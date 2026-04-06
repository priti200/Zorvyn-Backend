const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), dashboardController.getSummary);
router.get('/trends', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), dashboardController.getTrends);

module.exports = router;
