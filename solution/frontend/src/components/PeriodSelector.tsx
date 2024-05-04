import * as React from "react"

import DropDownSelect, { SelectOption } from "./DropDownSelect";
import DateRangePicker from "./DateRangePicker";

function PeriodSelector() {

  const options: SelectOption[] = [{
      name: 'All',
      value: 'all'
    }, {
      name: 'Year-to-date',
      value: 'ytd'
    }, {
      name: 'This Month',
      value: 'this-month'
    }, {
      name: 'Last Month',
      value: 'last-month'
    }, {
      name: 'This Year',
      value: 'this-year'
    }, {
      name: 'Last Year',
      value: 'last-year'
    }, {
      name: 'Custom',
      value: 'custom'
    },
  ];
  
  return (
    <div className="flex items-center p-4">
      <p className="pr-4">Period: </p>
      <DropDownSelect 
        options={options} 
        placeholderText="Select a period" 
        title="Period"
        defaultValue="all"
      />

      <DateRangePicker/>
    </div>
    
  )
}


export default PeriodSelector;