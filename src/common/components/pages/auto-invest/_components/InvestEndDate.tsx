import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { Calendar } from "@/common/components/ui/calendar";
import { format } from "date-fns";
import { ChevronDownIcon } from "@/common/components/icons";

interface InvestEndDateProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
}

const InvestEndDate = ({ date, setDate }: InvestEndDateProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-[18px] text-black dark:text-white">Ends On</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-[#0A0A0B] text-sm gap-x-4 rounded-lg py-2 px-4 border-[1px] border-white bg-white/50 dark:bg-[#F5F5F5] flex items-center justify-between w-max">
            {date ? format(date, "PP") : <span>Pick a date</span>}
            <ChevronDownIcon
              width={13}
              height={13}
              className="text-[#5A5555]"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date: Date | undefined) => date && setDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InvestEndDate;
