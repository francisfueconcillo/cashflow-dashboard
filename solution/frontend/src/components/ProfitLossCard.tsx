import React from 'react';
import { Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A', positive: 10, negative: -5, line: 5 },
  { name: 'B', positive: 20, negative: -15, line: 10 },
  { name: 'C', positive: -15, negative: -10, line: 7 },
  { name: 'D', positive: 30, negative: -20, line: 15 },
  { name: 'E', positive: -5, negative: -25, line: 12 },
];




const ProfitLossCard = () => {
  return (
    <div className='flex p-4'>
      <h3>Profit/Loss</h3>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="positive" fill="#8884d8"  />
        <Bar dataKey="negative" fill="#ff7300"  />
        <Line type="monotone" dataKey="line" stroke="#82ca9d" />
      </BarChart>
    </div>
      
  );
};

export default ProfitLossCard;
