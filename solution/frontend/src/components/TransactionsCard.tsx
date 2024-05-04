import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'A', value1: 10, value2: 20 },
  { name: 'B', value1: 20, value2: 30 },
  { name: 'C', value1: 30, value2: 25 },
  { name: 'D', value1: 40, value2: 35 },
  { name: 'E', value1: 50, value2: 45 },
];

const TransactionsCard = () => {
  return (
    <div  className='flex p-4'>
      <h3>Transactions</h3>
      <BarChart width={1200} height={300} data={data} title='Transactions'>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value1" fill="#8884d8" />
        <Bar dataKey="value2" fill="#82ca9d" />
      </BarChart>
    </div>
    
  );
};

export default TransactionsCard;
