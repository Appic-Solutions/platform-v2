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

const TimePicker = () => {
  const [time, setTime] = useState<string>("05:00");
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Select
      defaultValue={time!}
      onValueChange={(e) => {
        setTime(e);
        if (date) {
          const [hours, minutes] = e.split(":");
          const newDate = new Date(date.getTime());
          newDate.setHours(parseInt(hours), parseInt(minutes));
          setDate(newDate);
        }
      }}
    >
      <SelectTrigger
        className={cn(
          "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-4 border-[1px] border-white w-[160px]",
          "bg-white/50 dark:bg-[#F5F5F5]"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-2 border-[1px] border-white w-[120px] z-50",
          "bg-white/50 dark:bg-[#F5F5F5]"
        )}
      >
        <ScrollArea className="h-[15rem]">
          {Array.from({ length: 24 }).map((_, i) => {
            const hour = i.toString().padStart(2, "0");
            return (
              <SelectItem
                key={i}
                value={`${hour}:00`}
                className="cursor-pointer hover:bg-gray-300"
              >
                {hour}:00
              </SelectItem>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export { TimePicker };
