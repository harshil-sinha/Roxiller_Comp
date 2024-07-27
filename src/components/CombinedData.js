import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombinedData = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3000/api/combined`, { params: { month } })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching combined data:', error);
      });
  }, [month]);

  return (
    <div>
      <h2>Combined Data for Month {month}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default CombinedData;
