const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStatistics = async (req, res) => {
  try {
    const statistics = await Transaction.aggregate([
      // Your aggregation logic here
    ]);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getBarChartData = async (req, res) => {
  try {
    const barChartData = await Transaction.aggregate([
      // Your aggregation logic here
    ]);
    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getPieChartData = async (req, res) => {
  try {
    const pieChartData = await Transaction.aggregate([
      // Your aggregation logic here
    ]);
    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData
};
