import React from 'react';
import Totals from '@/context/types/Totals';
import clsx from 'clsx';

type Props = {
  title: string,
  totals: Totals | null,
  currency: string,
  type: string,
  useColors?: boolean
}

function formatNumber(number: number) {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.log10(Math.abs(number)) / 3 | 0;
  const suffix = suffixes[tier];

  if (tier === 0) return number;

  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;

  return scaled.toFixed(2) + suffix;
}


function NumberCard({ title, totals, type, currency, useColors }: Props) {
  let value: number = 0;

  if (!totals) {
    return (
      <div className="flex flex-col p-4 bg-white rounded-xl h-36">
        <div className="flex items-center justify-center h-36">
          <p className="text-center text-gray-300">No data</p>
        </div>
      </div>
    );
  }

  if (type==='debit') {
    value = totals.total_debits
  }

  if (type==='credit') {
    value = totals.total_credits
  }

  if (type==='profit_loss') {
    value = totals.profit_loss
  }

  return (
    <div className="flex flex-col p-4 bg-white rounded-xl h-36">
      <div>
        <p className="text-sm">{title}</p>
      </div>

      <div  className="flex justify-end">
        <div>
          <p>{currency}</p>
        </div>
        <div className='text-5xl'>
          <p className={ clsx({ 
            'text-red-800': useColors && value < 0, 
            'text-green-800': useColors && value > 0
          }) }>{formatNumber(value)}</p>
        </div>
      </div>
      
    </div>
  );
}

export default NumberCard;