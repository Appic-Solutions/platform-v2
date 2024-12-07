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
          "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-6 border-[1px] border-white w-[120px]",
          "bg-white/50 dark:bg-[#F5F5F5]"
        )}
      >
        <ScrollArea className="h-[15rem]">
          {Array.from({ length: 48 }).map((_, i) => {
            const hour = Math.floor(i / 2)
              .toString()
              .padStart(2, "0");
            const minute = ((i % 2) * 30).toString().padStart(2, "0");
            return (
              <SelectItem
                key={i}
                value={`${hour}:${minute}`}
                className="cursor-pointer hover:bg-gray-300"
              >
                {hour}:{minute}
              </SelectItem>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export { TimePicker };
