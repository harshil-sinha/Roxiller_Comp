import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const PieChartComponent = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/piechart`, { params: { month } })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching pie chart data:', error);
      });
  }, [month]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

  return (
    <div>
      <h2>Pie Chart for Month {month}</h2>
      <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
