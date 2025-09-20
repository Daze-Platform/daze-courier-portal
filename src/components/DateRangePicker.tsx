import React, { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
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
  {
    label: "Last 3 months",
    range: {
      from: subMonths(new Date(), 3),
      to: new Date(),
    },
  },
];

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "Pick a date range",
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

    if (dateRange.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    }

    return format(dateRange.from, "MMM dd, yyyy");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-start text-left font-normal h-9 px-3",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{formatDateRange(date)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-background border shadow-lg" 
        align="end"
        sideOffset={4}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Preset Options */}
          <div className="border-b sm:border-b-0 sm:border-r border-border">
            <div className="p-3">
              <h4 className="font-medium text-sm mb-2 text-foreground">Quick Select</h4>
              <div className="space-y-1 min-w-[140px]">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs font-normal h-8 px-2"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="p-3">
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
              className={cn("p-0 pointer-events-auto")}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-border p-3 flex justify-between bg-muted/30">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => {
              onDateChange?.(undefined);
              setIsOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
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