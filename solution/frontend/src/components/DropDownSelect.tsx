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

export type SelectOption = {
  name: string,
  value: string,
}

type Props = {
  title: string,
  placeholderText: string | 'Select an option',
  options: SelectOption[],
  defaultValue?: string,

}
function DropDownSelect({ title, options, placeholderText, defaultValue }: Props) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {
              options.map((option, index) => <SelectItem key={index} value={option.value}>{option.name}</SelectItem>)
            }
        </SelectGroup>
      </SelectContent>
    </Select>
    
  )
}


export default DropDownSelect;