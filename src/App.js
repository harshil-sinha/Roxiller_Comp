import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChartComponent';
// import PieChartComponent from './components/PieChartComponent';
// import CombinedData from './components/CombinedData';

function App() {
  const [month, setMonth] = useState('03');

  return (
    <>
        <TransactionsTable month={month} setMonth={setMonth}/>
        <Statistics month={month} />
        <BarChartComponent month={month} />
        {/* <PieChartComponent month={month} /> */}
        {/* <CombinedData month={month} /> */}
    </>
  );
}

export default App;
