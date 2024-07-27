import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:5000/api/statistics`, { params: { month } })
            .then(response => {
                setStatistics(response.data);
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            });
    }, [month]);

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1); // monthNumber is 1-indexed
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <>
            <h2 className="card-title text-center">Statistics for {getMonthName(month)}</h2>
            <div className="card mt-4 mx-auto  mb-5 mt-2 font-weight-bold rounded" style={{width:"300px"}}>
                {/* <div className="text-white">
                </div> */}
                <div className="card-body" style={{backgroundColor:"#ffe497"}}>
                    <p>Total Sale Amount: ${Math.floor(statistics.totalSaleAmount) || 0}</p>
                    <p>Total Sold Items: {statistics.totalSoldItems || 0}</p>
                    <p>Total Not Sold Items: {statistics.totalNotSoldItems || 0}</p>
                </div>
            </div>
        </>
    );
};

export default Statistics;
