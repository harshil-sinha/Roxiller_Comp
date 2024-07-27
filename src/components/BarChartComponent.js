import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/barchart`, { params: { month } })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching bar chart data:', error);
            });
    }, [month]);

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1); // monthNumber is 1-indexed
        return date.toLocaleString('default', { month: 'long' });
    };

    return (
        <>
            <h2 className="card-title text-center">Bar Chart for {getMonthName(month)}</h2>
            <div className="card mt-4 mx-auto w-75 mb-5" style={{backgroundColor:"#f5f4f0"}}>
                {/* <div className="card-header bg-primary text-white">
                </div> */}
                <div className="card-body d-flex justify-content-center">
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#5ac4dc" />
                    </BarChart>
                </div>
            </div>
        </>
    );
};

export default BarChartComponent;
