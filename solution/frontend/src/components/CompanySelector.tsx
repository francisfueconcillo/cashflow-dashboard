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

import Company from '../context/types/Company'
import { searchCompanies } from '../requests'

type Props = {
  allCompanies: Company[],
  setAllCompanies: (companies: Company[] | []) => void,
  selectHandler: (companyId: string) => void,
}

function CompanySelector({ allCompanies, setAllCompanies, selectHandler }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [filteredCompanies, setFilteredCompanies] = React.useState(allCompanies.slice(0, 300));

  const itemSelectHandler = (companyId: string) => {
    if (companyId !== '') {
      setValue(companyId);
      selectHandler(companyId);
    }
    setOpen(false);
  }

  const customFilter = (value: string, search: string, keywords?: string[]) => {
    if (search==='' ) return 0;


    

    // searchCompanies(search)
    //   .then((companies: Company[]) => {
    //     if (companies.length) {
    //       setAllCompanies(companies);
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    
    const result = allCompanies.find(i => i.value === value);

    setFilteredCompanies(allCompanies.filter(i => i.name.toLowerCase().indexOf(search.toLowerCase())))

    if (result) {
      return  result.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ? 1 :0
    } else {
      return 0;
    }

  }

  return (
    <div className="flex items-center lg:py-4 py-0">
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
              ? filteredCompanies.find((company) => company.value === value)?.label
              : "Select company..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={true} filter={customFilter}>
            <CommandInput placeholder="Search company..." />
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredCompanies.map((company) => {
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