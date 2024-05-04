import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from './ui/utils'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'

import Company from '@/context/types/Company'

type Props = {
  companies: Company[],
  selectHandler: (companyId: string) => void,
}

function CompanySelector({ companies, selectHandler }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const itemSelectHandler = (companyId: string) => {
    if (companyId !== '') {
      setValue(companyId);
      selectHandler(companyId);
    }
    setOpen(false);
  }

  return (
    <div className="flex items-center py-4">
      <p className="pr-4">Company: </p>
      <Popover open={open} onOpenChange={setOpen}>

        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? companies.find((company) => company.value === value)?.label
              : "Select company..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search company..." />
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {companies.map((company) => {
                  return <CommandItem
                    key={company.value}
                    value={company.value}
                    onSelect={itemSelectHandler}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === company.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {company.label}
                  </CommandItem>
                })}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>

      </Popover>
      


    </div>

    
  )
}


export default CompanySelector;