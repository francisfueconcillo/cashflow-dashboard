import Transactions from '../context/types/Transactions';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatNumber } from '../utils';

type CharDataPoint = {
  name: string,
  'Cash-in': number ,
  'Cash-out': number,
}

type Props = {
  transactions: Transactions[] | [],
  type: string,
}

const TransactionsCard = ({ transactions, type }: Props) => {

  const initialChartData: CharDataPoint[] | [] = [];

  const [chartData, setChartData] = useState(initialChartData)

  useEffect(()=>{

    if (transactions.length) {
      let newChartData: CharDataPoint[] | [] = [];

      newChartData = transactions.map((trans:Transactions) => { 
        const datapoint: CharDataPoint = {
          name: type ==='day' ? trans.year+'-'+trans.month+'-'+trans.day : trans.year+'-'+trans.month, 
          'Cash-in': trans.total_credits, 
          'Cash-out': trans.total_debits,
        }
        return datapoint;
      })

      setChartData(newChartData);
    }

  }, [transactions])

  return (
    <div  className='flex flex-col p-4 bg-white rounded-xl'>
      <h3>Transactions</h3>

      {
        chartData.length
        ? <div className="flex items-center justify-center">
            <BarChart width={1200} height={300} data={chartData} title='Transactions'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend/>
              <Bar dataKey="Cash-in" fill="#82ca9d" />
              <Bar dataKey="Cash-out" fill="#C64242" />
            </BarChart>
          </div> 
        : <div className="flex items-center justify-center h-36">
            <p className="text-center text-gray-300">No data</p>
          </div>
      }


      
    </div>
    
  );
};

export default TransactionsCard;
