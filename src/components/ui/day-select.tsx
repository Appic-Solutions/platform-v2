"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useState } from "react";
import CalendarEditIcon from "@/components/icons/calendar-edit";

const DaySelect = () => {
  const [day, setDay] = useState<string | null>("1");
  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <Select
      defaultValue={day!}
      onValueChange={(e) => {
        setDay(e);
      }}
    >
      <SelectTrigger
        className={cn(
          "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-4 border-[1px] border-white w-[160px]",
          "bg-white/50 dark:bg-[#F5F5F5]"
        )}
        hideIcon
      >
        <SelectValue />
        <CalendarEditIcon className="w-5 h-5 text-gray-500" />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-2 border-[1px] border-white w-[120px]",
          "bg-white/50 dark:bg-[#F5F5F5]"
        )}
      >
        <ScrollArea className="h-[15rem]">
          {Array.from({ length: 28 }).map((_, i) => {
            const dayNumber = i + 1;
            const suffix = getDaySuffix(dayNumber);
            return (
              <SelectItem
                key={i}
                value={dayNumber.toString()}
                className="cursor-pointer hover:bg-gray-300"
              >
                {dayNumber}
                {suffix}
              </SelectItem>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default DaySelect;
