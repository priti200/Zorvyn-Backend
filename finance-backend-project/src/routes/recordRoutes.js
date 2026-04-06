const express = require('express');
const roleCheck = require('../middleware/roleCheck');
const auth = require('../middleware/auth');
const recordController = require('../controllers/recordController');

const router = express.Router();

// All routes here require authentication middleware (applied in server.js globally)

router.post('/', auth, roleCheck(['Admin', 'Analyst']), recordController.createRecord);
router.get('/', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), recordController.getAllRecords);
router.get('/:id', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), recordController.getRecord);
router.put('/:id', auth, roleCheck(['Admin']), recordController.updateRecord);
router.delete('/:id', auth, roleCheck(['Admin']), recordController.deleteRecord);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = router;