"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {  format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function MonthSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const today = new Date();
    
    // Get the 26th of last month
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 26);
  
    // Set the range to be from the 26th of last month to today
    return {
      from: lastMonth,
      to: today,
    };
  });

  useEffect(() => {
    if (date?.from && date?.to) {
      const newParams = new URLSearchParams(searchParams.toString())

      newParams.set("startDate", format(date.from, "yyyy-MM-dd"))
      newParams.set("endDate", format(date.to, "yyyy-MM-dd"))

      router.push(`/dashboard/expenses?${newParams.toString()}`, { scroll: false })
    }
  }, [date, router, searchParams])

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
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
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
