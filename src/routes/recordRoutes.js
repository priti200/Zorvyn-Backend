const express = require('express');
const roleCheck = require('../middleware/roleCheck');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const recordController = require('../controllers/recordController');

const router = express.Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: Access denied
 */
router.post('/', auth, roleCheck(['Admin', 'Analyst']), validation.validateRecord, recordController.createRecord);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type (income/expense)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of records
 */
router.get('/', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), recordController.getAllRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 */
router.get('/:id', auth, roleCheck(['Admin', 'Analyst', 'Viewer']), recordController.getRecord);

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       403:
 *         description: Access denied
 */
router.put('/:id', auth, roleCheck(['Admin']), recordController.updateRecord);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete('/:id', auth, roleCheck(['Admin']), recordController.deleteRecord);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = router;
