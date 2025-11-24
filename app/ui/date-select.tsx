"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, startOfMonth, endOfMonth } from "date-fns";

export default function DateRangePicker({
  startParam,
  endParam,
}: {
  startParam: string;
  endParam: string;
}) {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: new Date(startParam),
    to: new Date(endParam),
  });

  function formatShort(dateString: string) {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  const formatted =
    `${formatShort(startParam)} — ${formatShort(endParam)}`.replace(",", "");

  // Presets
  const thisWeek = {
    from: addDays(new Date(), -new Date().getDay()),
    to: addDays(new Date(), 6 - new Date().getDay()),
  };

  const lastWeek = {
    from: addDays(thisWeek.from, -7),
    to: addDays(thisWeek.to, -7),
  };

  const thisMonth = {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  };

  return (
    <div className="w-full flex justify-center my-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="text-purple-600 flex flex-col font-semibold text-lg ">
            <p>Expenses</p>
            {formatted}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogTrigger>Select Date Range</DialogTrigger>
          {/* <h2 className="text-lg font-semibold text-center mb-4">
            Select Date Range
          </h2> */}

          {/* Presets */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              className="rounded-lg border p-2 text-sm hover:bg-purple-100"
              onClick={() => setRange(thisWeek)}
            >
              This Week
            </button>

            <button
              className="rounded-lg border p-2 text-sm hover:bg-purple-100"
              onClick={() => setRange(lastWeek)}
            >
              Last Week
            </button>

            <button
              className="rounded-lg border p-2 text-sm hover:bg-purple-100"
              onClick={() => setRange(thisMonth)}
            >
              This Month
            </button>
          </div>

          {/* Calendar */}
          <div className=" p-3 bg-white">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(val) => setRange(val!)}
              pagedNavigation
              numberOfMonths={1}
              className="rounded-xl"
              modifiersClassNames={{
                selected: "bg-purple-600 text-white rounded-md",
              }}
            />
          </div>

          {/* Apply Button */}
          <button
            className="w-full bg-purple-600 text-white rounded-lg p-3 mt-6 font-semibold"
            onClick={() => {
              if (range?.from && range?.to) {
                const start = range.from.toISOString().slice(0, 10);
                const end = range.to.toISOString().slice(0, 10);
                window.location.search = `?startDate=${start}&endDate=${end}`;
              }
              setOpen(false);
            }}
          >
            Apply
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
