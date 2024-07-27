const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper function to filter transactions by month
const filterTransactionsByMonth = (transactions, month) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.dateOfSale);
    return transactionDate.getMonth() + 1 === parseInt(month);
  });
};

// Statistics endpoint
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = filterTransactionsByMonth(response.data, month);

    const totalSaleAmount = transactions.reduce((acc, curr) => acc + curr.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Bar chart endpoint
app.get('/api/barchart', async (req, res) => {
  const { month } = req.query;

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = filterTransactionsByMonth(response.data, month);

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

    const barChartData = ranges.map(range => {
      const count = transactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length;
      return {
        range: `${range.min}-${range.max === Infinity ? '∞' : range.max}`,
        count
      };
    });

    res.json(barChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Pie chart endpoint
app.get('/api/piechart', async (req, res) => {
  const { month } = req.query;

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = filterTransactionsByMonth(response.data, month);

    const categoryCounts = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category]++;
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));

    res.json(pieChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Combined data endpoint
app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get('http://localhost:5000/api/statistics', { params: { month } }),
      axios.get('http://localhost:5000/api/barchart', { params: { month } }),
      axios.get('http://localhost:5000/api/piechart', { params: { month } })
    ]);

    res.json({
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/transactions', async (req, res) => {
    const { month, search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Filter by month
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.dateOfSale);
            return transactionDate.getMonth() + 1 === parseInt(month);
        });

        // Search functionality
        const searchedTransactions = filteredTransactions.filter(transaction => 
            transaction.title.toLowerCase().includes(search.toLowerCase()) ||
            transaction.description.toLowerCase().includes(search.toLowerCase())
        );

        // Pagination
        const totalTransactions = searchedTransactions.length;
        const startIndex = (pageNumber - 1) * limitNumber;
        const paginatedTransactions = searchedTransactions.slice(startIndex, startIndex + limitNumber);

        res.json({
            transactions: paginatedTransactions,
            total: totalTransactions,
            page: pageNumber,
            totalPages: Math.ceil(totalTransactions / limitNumber),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
