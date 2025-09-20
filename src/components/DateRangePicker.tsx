import React, { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

const quickFilters = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "This month", days: "month" },
];

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "Select dates",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getQuickFilterRange = (days: number | string) => {
    const today = new Date();
    if (days === "month") {
      return { from: startOfMonth(today), to: today };
    }
    if (days === 0) {
      return { from: today, to: today };
    }
    return { from: subDays(today, days as number - 1), to: today };
  };

  const handleQuickFilter = (days: number | string) => {
    const range = getQuickFilterRange(days);
    onDateChange?.(range);
    setIsOpen(false);
  };

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return placeholder;
    
    if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`;
    }
    return format(dateRange.from, "MMM d");
  };

  const isQuickFilterActive = (days: number | string) => {
    if (!date?.from || !date?.to) return false;
    const range = getQuickFilterRange(days);
    return date.from.getTime() === range.from.getTime() && 
           date.to.getTime() === range.to.getTime();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-3 font-normal justify-start bg-background border-input",
            "hover:bg-accent/5 hover:border-accent-foreground/20",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDateRange(date)}</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[380px] p-0 bg-background border shadow-xl rounded-xl" 
        align="start"
        sideOffset={8}
      >
        {/* Quick Filters */}
        <div className="p-4 border-b border-border/50">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.label}
                variant={isQuickFilterActive(filter.days) ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-3 text-xs font-medium rounded-full",
                  isQuickFilterActive(filter.days) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent/80 text-muted-foreground"
                )}
                onClick={() => handleQuickFilter(filter.days)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4">
          <Calendar
            mode="range"
            selected={date}
            onSelect={(newDate) => {
              onDateChange?.(newDate);
              if (newDate?.from && newDate?.to) {
                // Small delay to show selection before closing
                setTimeout(() => setIsOpen(false), 150);
              }
            }}
            numberOfMonths={1}
            className="w-full"
            classNames={{
              months: "flex flex-col space-y-4",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-sm font-semibold text-foreground",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-8 w-8 bg-transparent p-0 hover:bg-accent rounded-md",
                "border border-transparent hover:border-border"
              ),
              nav_button_previous: "absolute left-0",
              nav_button_next: "absolute right-0",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground w-9 font-medium text-xs text-center",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal text-sm rounded-md",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground"
              ),
              day_selected: "bg-primary text-primary-foreground font-medium hover:bg-primary/90",
              day_today: "bg-accent/50 text-accent-foreground font-medium",
              day_outside: "text-muted-foreground/50",
              day_disabled: "text-muted-foreground/30 cursor-not-allowed",
              day_range_middle: "bg-primary/10 text-primary rounded-none",
              day_range_start: "bg-primary text-primary-foreground rounded-l-md rounded-r-none",
              day_range_end: "bg-primary text-primary-foreground rounded-r-md rounded-l-none",
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDateChange?.(undefined);
              setIsOpen(false);
            }}
            className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
          >
            Clear dates
          </Button>
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 px-4 text-xs"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;