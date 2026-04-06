const dashboardService = require('../services/dashboardService');

async function getSummary(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const summary = await dashboardService.getDashboardSummary(userId);
    res.status(200).json(summary);
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

async function getTrends(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { months } = req.query;
    const trends = await dashboardService.getMonthlyTrends(userId, parseInt(months) || 6);
    res.status(200).json(trends);
  } catch (err) {
    console.error('getTrends error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

module.exports = {
  getSummary,
  getTrends,
};
