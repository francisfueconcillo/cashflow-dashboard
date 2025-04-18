"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { ActiveModifiers, DateRange } from "react-day-picker"

import { cn } from "./ui/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

type Props = {
  className?: string,
  fromDate: Date,
  toDate: Date,
  setFromDateRange: (from: Date | undefined) => void,
  setToDateRange: (to: Date | undefined) => void,
}

function DateRangePicker({ className, setFromDateRange, setToDateRange, fromDate, toDate }: Props) {

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromDate,
    to: toDate,
  })


  const selectRangeHandler =(range: DateRange | undefined) => {

    setDate({
      from: range?.from,
      to: range?.to,
    })

    setFromDateRange(range?.from);
    setToDateRange(range?.to)
   
  }

  return (
    <div className={cn("grid gap-2 pl-4", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range: DateRange |undefined) => {
              selectRangeHandler(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}


export default DateRangePicker