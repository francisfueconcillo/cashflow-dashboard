import React, { useState} from "react"
import { addDays } from "date-fns"

import DropDownSelect, { SelectOption } from "./DropDownSelect";
import DateRangePicker from "./DateRangePicker";

type Props = {
  fromDate: Date,
  toDate: Date,
  setFromDateRange: (from: Date | undefined) => void,
  setToDateRange: (to: Date | undefined) => void,
}

function PeriodSelector({ fromDate, toDate, setFromDateRange, setToDateRange }: Props) {

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const options: SelectOption[] = [{
      name: 'All-Time',
      value: 'all'
    }, {
      name: 'Last Year',
      value: 'last-year'
    }, {
      name: 'YTD',
      value: 'ytd'
    }, {
      name: 'This Month',
      value: 'this-month' 
    }, {
      name: 'Custom',
      value: 'custom'
    },
  ];
  
  const changeHandler = (value: string) => {
    const now: Date = new Date();
    
    switch (value) {
      case 'all':
        setFromDateRange(new Date(2018, 0, 1));
        setToDateRange(now);
        setShowDateRangePicker(false);
        break;
      case 'last-year':
        setFromDateRange(new Date(now.getFullYear() - 1, 0, 1));
        setToDateRange(new Date(now.getFullYear() - 1, 11, 31));
        setShowDateRangePicker(false);
        break;
      case 'ytd':
        setFromDateRange(new Date(now.getFullYear(), 0, 1));
        setToDateRange(now);
        setShowDateRangePicker(false);
        break;
      case 'this-month':
        setFromDateRange(new Date(now.getFullYear(), now.getMonth(), 1));
        setToDateRange(now);
        setShowDateRangePicker(false);
        break;
      default:
        setFromDateRange(now);
        setToDateRange(addDays(now, 7),);
        setShowDateRangePicker(true);
    }

  }


  return (
    <div className="flex items-center lg:py-4 py-0">
      <p className="pr-4">Period: </p>
      <DropDownSelect 
        options={options} 
        placeholderText="Select a period" 
        title="Period"
        defaultValue="all"
        onValueChange={changeHandler}
      />

      {
        showDateRangePicker && 
        <DateRangePicker 
          fromDate={fromDate}
          toDate={toDate}
          setFromDateRange={setFromDateRange} 
          setToDateRange={setToDateRange}
        />
      }
      
    </div>
    
  )
}


export default PeriodSelector;