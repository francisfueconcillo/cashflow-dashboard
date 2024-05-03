import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

function PeriodSelector() {
  return (
    <div className="flex p-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Period</SelectLabel>
            <SelectItem value="apple">YTD</SelectItem>
            <SelectItem value="banana">This Month</SelectItem>
            <SelectItem value="blueberry">Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    
  )
}


export default PeriodSelector;