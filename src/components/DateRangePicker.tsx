import React, { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

const presets = [
  {
    label: "Today",
    range: {
      from: new Date(),
      to: new Date(),
    },
  },
  {
    label: "Last 7 days",
    range: {
      from: subDays(new Date(), 6),
      to: new Date(),
    },
  },
  {
    label: "Last 30 days", 
    range: {
      from: subDays(new Date(), 29),
      to: new Date(),
    },
  },
  {
    label: "This month",
    range: {
      from: startOfMonth(new Date()),
      to: new Date(),
    },
  },
  {
    label: "Last month",
    range: {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
  },
];

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "Select dates",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: typeof presets[0]) => {
    if (onDateChange) {
      onDateChange(preset.range);
      setIsOpen(false);
    }
  };

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder;
    }

    if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
      return `${format(dateRange.from, "MMM d")} - ${format(
        dateRange.to,
        "MMM d, yyyy"
      )}`;
    }

    return format(dateRange.from, "MMM d, yyyy");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-3 font-normal justify-start text-left border-input bg-background hover:bg-accent hover:text-accent-foreground",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm">{formatDateRange(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-card border shadow-md z-50" 
        align="start"
        sideOffset={4}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-card-foreground">Select Date Range</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-normal justify-start hover:bg-accent hover:text-accent-foreground"
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-4">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              onDateChange?.(newDate);
              if (newDate?.from && newDate?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={1}
            className="p-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                "[&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md"
              ),
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <Button
            variant="outline" 
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => {
              onDateChange?.(undefined);
              setIsOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
            className="h-8 px-4 text-xs"
            onClick={() => setIsOpen(false)}
            disabled={!date?.from}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;