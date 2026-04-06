const FinancialRecord = require('../models/FinancialRecord');

async function getDashboardSummary(userId) {
  const records = await FinancialRecord.find({ userId });

  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const categoryTotals = records.reduce((acc, r) => {
    if (!acc[r.category]) {
      acc[r.category] = { income: 0, expense: 0 };
    }
    if (r.type === 'income') {
      acc[r.category].income += r.amount;
    } else {
      acc[r.category].expense += r.amount;
    }
    return acc;
  }, {});

  const recentActivity = await FinancialRecord.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryTotals,
    recentActivity,
  };
}

async function getMonthlyTrends(userId, months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const records = await FinancialRecord.find({
    userId,
    date: { $gte: startDate },
  });

  const monthlyData = {};

  records.forEach(record => {
    const monthKey = record.date.toISOString().slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    if (record.type === 'income') {
      monthlyData[monthKey].income += record.amount;
    } else {
      monthlyData[monthKey].expense += record.amount;
    }
  });

  const trends = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));

  return trends;
}

module.exports = {
  getDashboardSummary,
  getMonthlyTrends,
};
