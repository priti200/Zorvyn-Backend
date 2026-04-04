const express = require('express');
const FinancialRecord = require('../models/FinancialRecord');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Create a new financial record
router.post('/', async (req, res) => {
  try {
    const { title, amount, type } = req.body;
    const userId = req.user.id; // Assuming req.user is populated by authentication middleware

    console.log('Creating financial record:', { title, amount, type, userId });

    const newRecord = new FinancialRecord({ title, amount, type, userId });
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating financial record:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get all financial records
router.get('/', async (req, res) => {
  try {
    console.log('Fetching financial records for user:', req.user.id);

    const records = await FinancialRecord.find({ userId: req.user.id });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching financial records:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get a specific financial record
router.get('/:id', async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({ _id: req.params.id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a financial record
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, amount, type },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a financial record
router.delete('/:id', async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = router;