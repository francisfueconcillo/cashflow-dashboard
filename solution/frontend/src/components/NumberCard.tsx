import React from 'react';
import Totals from '@/context/types/Totals';
import clsx from 'clsx';
import { formatNumber } from '../utils';

type Props = {
  title: string,
  totals: Totals | null,
  currency: string,
  type: string,
  useColors?: boolean,
  isLoading: boolean,
}

function NumberCard({ title, totals, type, currency, useColors, isLoading }: Props) {

  const getValue = (type: string):number => {
    if (type==='debit') {
      return totals?.total_debits || 0
    }
  
    if (type==='credit') {
      return totals?.total_credits || 0
    }
  
    if (type==='profit_loss') {
      return totals?.profit_loss|| 0
    }

    return 0;

  }

  

  return (
    <div className="flex flex-col p-4 bg-white rounded-xl h-36">
      {
        isLoading
        ? <div className="flex items-center justify-center h-36">
            <p className="text-center text-gray-400">Loading...</p>
          </div>
        : totals
          ? <div>
              <div>
                <p className="text-sm">{title}</p>
              </div>

              <div  className="flex justify-end space-x-2">
                <div>
                  <p>{currency}</p>
                </div>
                <div className='text-5xl'>
                  <p className={ clsx({ 
                    'text-red-800': useColors && getValue(type) < 0, 
                    'text-green-800': useColors && getValue(type) > 0
                  }) }>{formatNumber(getValue(type))}</p>
                </div>
              </div>
            </div>
          : <div className="flex items-center justify-center h-36">
              <p className="text-center text-gray-300">No data</p>
            </div> 
          
          
      }

      
      
    </div>
  );
}

export default NumberCard;