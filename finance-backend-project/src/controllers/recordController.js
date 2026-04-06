const recordService = require('../services/recordService');

async function createRecord(req, res) {
  try {
    const { title, amount, type, date } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const record = await recordService.createRecord({ title, amount, type, userId, date });
    res.status(201).json(record);
  } catch (err) {
    console.error('createRecord error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

async function getAllRecords(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const records = await recordService.getRecordsByUser(userId);
    res.status(200).json(records);
  } catch (err) {
    console.error('getAllRecords error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

async function getRecord(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const record = await recordService.getRecordById(id, userId);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    console.error('getRecord error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

async function updateRecord(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    const updates = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const record = await recordService.updateRecord(id, userId, updates);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    console.error('updateRecord error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

async function deleteRecord(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const result = await recordService.deleteRecord(id, userId);
    if (!result) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('deleteRecord error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

module.exports = {
  createRecord,
  getAllRecords,
  getRecord,
  updateRecord,
  deleteRecord,
};
