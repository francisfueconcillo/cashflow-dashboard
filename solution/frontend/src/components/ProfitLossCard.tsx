import React, { useEffect, useState } from 'react';
import { Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, ResponsiveContainer } from 'recharts';
import Transactions from '../context/types/Transactions';


const data = [
  { name: 'A', positive: 10, negative: 5, line: 5 },
  { name: 'B', positive: 20, negative: -15, line: 10 },
  { name: 'C', positive: -15, negative: -10, line: 7 },
  { name: 'D', positive: 30, negative: -20, line: 15 },
  { name: 'E', positive: -5, negative: -25, line: 12 },
];


type CharDataPoint = {
  name: string,
  profit: number,
  loss: number,
}

type Props = {
  transactions: Transactions[] | [],
  isLoading: boolean
}

const ProfitLossCard = ({ transactions, isLoading }: Props) => {
  const initialChartData: CharDataPoint[] | [] = [];

  const [chartData, setChartData] = useState(initialChartData)

  useEffect(()=>{
    if (transactions.length) {
      let newChartData: CharDataPoint[] | [] = [];

      newChartData = transactions.map((trans:Transactions) => { 
        const datapoint: CharDataPoint = {
          name: trans.year+'-'+trans.month, 
          profit: trans.profit_loss > 0 ? trans.profit_loss : 0, 
          loss: trans.profit_loss < 0 ? trans.profit_loss : 0,
        }
        return datapoint;
      })

      setChartData(newChartData);
    } else {
      setChartData(initialChartData);
    }

  }, [transactions])

  return (
    <div  className='flex flex-col p-4 bg-white rounded-xl'>
      <h3>Profit/Loss</h3>
      <div>
        {
          isLoading
          ? <div className="flex items-center justify-center h-36">
              <p className="text-center text-gray-400">Loading...</p>
            </div>
          : chartData.length
            ? <div className="flex items-center justify-center">
                <BarChart
                  width={600}
                  height={300}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" fill="#82ca9d"  />
                  <Bar dataKey="loss" fill="#C64242"  />
                </BarChart>
              </div>
            : <div className="flex items-center justify-center h-36">
                <p className="text-center text-gray-300">No data</p>
              </div>
        }
      </div>
      
    </div>

    
      
  );
};

export default ProfitLossCard;
