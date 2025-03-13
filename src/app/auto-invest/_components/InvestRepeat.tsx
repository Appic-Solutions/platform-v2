import DaySelect from "@/components/ui/day-select";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

// if cycle is month, repeat should have an number between 1 and 28 and an time
// if cycle is week, repeat should have an number between 1 and 7 and an time
// if cycle is day, repeat should just have time

const repeatOnWeekOptions = [
  { id: 1, name: "M" },
  { id: 2, name: "T" },
  { id: 3, name: "W" },
  { id: 4, name: "T" },
  { id: 5, name: "F" },
  { id: 6, name: "S" },
  { id: 7, name: "S" },
];

interface InvestRepeatDayProps {
  repeatOn: number;
  setRepeatOn: (id: number) => void;
  selectedCycle: string;
  date: Date;
}

const InvestRepeat = ({
  repeatOn,
  setRepeatOn,
  selectedCycle,
  date,
}: InvestRepeatDayProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-16">
        <div className="flex flex-col gap-y-2">
          <p className="text-[18px] text-black dark:text-white">Repeat On</p>
          <TimePicker />
        </div>
        <div className="flex-col gap-y-2 hidden md:flex">
          <p className="text-[18px] text-black dark:text-white">Ends On</p>
          <div className="text-primary text-md">{format(date, "PP")}</div>
        </div>
      </div>
      {selectedCycle === "Week" && (
        <div className="flex gap-x-2 items-center mt-2 animate-slide-in opacity-0">
          {repeatOnWeekOptions.map((option, index) => (
            <div
              key={index}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[#0A0A0B] font-bold cursor-pointer",
                "bg-white/50 dark:bg-[#F5F5F5]",
                repeatOn === option.id && "bg-primary-buttons text-white"
              )}
              onClick={() => setRepeatOn(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
      {selectedCycle === "Month" && (
        <div className="animate-slide-in opacity-0">
          <DaySelect />
        </div>
      )}
    </div>
  );
};

export default InvestRepeat;
