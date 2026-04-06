const FinancialRecord = require('../models/FinancialRecord');

async function createRecord({ title, amount, type, userId, date }) {
  const record = new FinancialRecord({ title, amount, type, userId, date });
  return record.save();
}

async function getRecordsByUser(userId) {
  return FinancialRecord.find({ userId }).sort({ date: -1 });
}

async function getRecordById(id, userId) {
  return FinancialRecord.findOne({ _id: id, userId });
}

async function updateRecord(id, userId, updates) {
  return FinancialRecord.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
}

async function deleteRecord(id, userId) {
  return FinancialRecord.findOneAndDelete({ _id: id, userId });
}

module.exports = {
  createRecord,
  getRecordsByUser,
  getRecordById,
  updateRecord,
  deleteRecord,
};
