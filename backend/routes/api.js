const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.send('Database initialized with seed data');
  } catch (error) {
    res.status(500).send('Error initializing database');
  }
});

// List all transactions with search and pagination
router.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { price: Number(search) }
    ];
  }

  if (month) {
    const start = new Date(`2024-${month}-01`);
    const end = new Date(`2024-${Number(month) + 1}-01`);
    query.dateOfSale = { $gte: start, $lt: end };
  }

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(Number(perPage));

  res.json(transactions);
});

// Statistics for a selected month
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  if (!month) return res.status(400).send('Month is required');

  const start = new Date(`2024-${month}-01`);
  const end = new Date(`2024-${Number(month) + 1}-01`);

  const totalSaleAmount = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  const totalSoldItems = await Transaction.countDocuments({
    dateOfSale: { $gte: start, $lt: end },
    sold: true
  });

  const totalNotSoldItems = await Transaction.countDocuments({
    dateOfSale: { $gte: start, $lt: end },
    sold: false
  });

  res.json({
    totalSaleAmount: totalSaleAmount[0]?.total || 0,
    totalSoldItems,
    totalNotSoldItems
  });
});

// Bar chart data
router.get('/barchart', async (req, res) => {
  const { month } = req.query;

  if (!month) return res.status(400).send('Month is required');

  const start = new Date(`2024-${month}-01`);
  const end = new Date(`2024-${Number(month) + 1}-01`);

  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity }
  ];

  const barChartData = await Promise.all(ranges.map(async range => {
    const count = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lt: end },
      price: { $gte: range.min, $lte: range.max }
    });

    return {
      range: `${range.min}-${range.max}`,
      count
    };
  }));

  res.json(barChartData);
});

// Pie chart data
router.get('/piechart', async (req, res) => {
  const { month } = req.query;

  if (!month) return res.status(400).send('Month is required');

  const start = new Date(`2024-${month}-01`);
  const end = new Date(`2024-${Number(month) + 1}-01`);

  const pieChartData = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.json(pieChartData);
});

// Combined API
router.get('/combined', async (req, res) => {
  const { month } = req.query;

  if (!month) return res.status(400).send('Month is required');

  const [transactions, statistics, barChartData, pieChartData] = await Promise.all([
    axios.get('http://localhost:3000/api/transactions', { params: { month } }),
    axios.get('http://localhost:3000/api/statistics', { params: { month } }),
    axios.get('http://localhost:3000/api/barchart', { params: { month } }),
    axios.get('http://localhost:3000/api/piechart', { params: { month } })
  ]);

  res.json({
    transactions: transactions.data,
    statistics: statistics.data,
    barChartData: barChartData.data,
    pieChartData: pieChartData.data
  });
});

module.exports = router;
