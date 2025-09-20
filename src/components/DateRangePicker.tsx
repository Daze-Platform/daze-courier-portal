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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handlePresetSelect = (preset: string) => {
    const selectedPreset = presets.find(p => p.label === preset);
    if (selectedPreset && onDateChange) {
      onDateChange(selectedPreset.range);
    }
  };

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder;
    }

    if (dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    }

    return format(dateRange.from, "MMM dd, yyyy");
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset Options */}
            <div className="border-r">
              <div className="p-3">
                <h4 className="font-medium text-sm mb-2">Quick Select</h4>
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal"
                      onClick={() => {
                        handlePresetSelect(preset.label);
                        setIsOpen(false);
                      }}
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
                onSelect={onDateChange}
                numberOfMonths={2}
                className={cn("p-0 pointer-events-auto")}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t p-3">
            <div className="flex justify-between">
              <Button
                variant="outline" 
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;