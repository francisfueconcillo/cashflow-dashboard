import React from 'react';
import Totals from '@/context/types/Totals';
import clsx from 'clsx';
import { formatNumber } from '../utils';

type Props = {
  title: string,
  totals: Totals | null,
  currency: string,
  type: string,
  useColors?: boolean
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

      <div  className="flex justify-end space-x-2">
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