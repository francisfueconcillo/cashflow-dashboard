import * as React from "react"

import DropDownSelect, { SelectOption } from "./DropDownSelect";

function CurrencySelector() {

  const options: SelectOption[] = [{
      name: 'USD',
      value: 'USD'
    }, {
      name: 'EUR',
      value: 'EUR'
    },
  ];
  
  return (
    <div className="flex items-center p-4">
      <p className="pr-4">Currency: </p>
      <DropDownSelect 
        options={options} 
        placeholderText="Select currency" 
        title="Currency"
        defaultValue="USD"
      />
    </div>
    
  )
}


export default CurrencySelector;