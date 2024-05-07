import * as React from "react"

import DropDownSelect, { SelectOption } from "./DropDownSelect";

type Props = {
  currency: string,
  changeHandler: (currency: string) => void,
}

function CurrencySelector({ currency, changeHandler }: Props) {

  const options: SelectOption[] = [{
      name: 'USD',
      value: 'USD'
    }, {
      name: 'EUR',
      value: 'EUR'
    },
  ];
  
  return (
    <div className="flex items-center lg:py-4 py-0">
      <p className="pr-4">Currency: </p>
      <DropDownSelect 
        options={options} 
        placeholderText="Select currency" 
        title="Currency"
        defaultValue={currency}
        onValueChange={changeHandler}
      />
    </div>
    
  )
}


export default CurrencySelector;