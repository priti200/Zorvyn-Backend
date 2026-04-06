const FinancialRecord = require('../models/FinancialRecord');

async function createRecord({ title, amount, type, category, notes, userId, date }) {
  const record = new FinancialRecord({ title, amount, type, category, notes, userId, date });
  return record.save();
}

async function getRecordsByUser(userId, filters = {}, options = {}) {
  const { startDate, endDate, category, type } = filters;
  const { page = 1, limit = 20 } = options;

  const query = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (category) query.category = category;
  if (type) query.type = type;

  const skip = (page - 1) * limit;
  const records = await FinancialRecord.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await FinancialRecord.countDocuments(query);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
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
