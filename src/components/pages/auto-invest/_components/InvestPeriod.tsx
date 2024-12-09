import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InvestPeriodProps {
  investmentPeriod: number;
  setRepeatCountHandle: (type: "add" | "sub") => void;
  setSelectedCycle: (cycle: string) => void;
  cycleOptions: string[];
  selectedCycle: string;
}

const InvestPeriod = ({
  investmentPeriod,
  setRepeatCountHandle,
  setSelectedCycle,
  cycleOptions,
  selectedCycle,
}: InvestPeriodProps) => {
  console.log(setSelectedCycle);
  return (
    <div className="flex items-center gap-x-12">
      <p className="text-[18px] text-black dark:text-white text-nowrap">
        Repeat Every
      </p>
      <div className="flex items-center gap-x-4">
        <span className="text-[18px] text-black dark:text-white">
          {investmentPeriod}
        </span>
        <div className="flex flex-col items-center gap-y-2">
          <button
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border-[1px] border-white",
              "text-[#0A0A0B] dark:text-[#333333]",
              "bg-white/50 dark:bg-[#F5F5F5]"
            )}
            onClick={() => setRepeatCountHandle("add")}
          >
            +
          </button>
          <button
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border-[1px] border-white",
              "text-[#0A0A0B]",
              "bg-white/50 dark:bg-[#F5F5F5]"
            )}
            onClick={() => setRepeatCountHandle("sub")}
          >
            -
          </button>
        </div>
        <Select
          defaultValue={selectedCycle}
          onValueChange={(value) => setSelectedCycle(value)}
        >
          <SelectTrigger
            className={cn(
              "text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-6 border-[1px] border-white w-min",
              "bg-white/50 dark:bg-[#F5F5F5]"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-primary">
            <SelectGroup>
              {cycleOptions.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                  className={cn("hover:bg-gray-300 cursor-pointer")}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InvestPeriod;
