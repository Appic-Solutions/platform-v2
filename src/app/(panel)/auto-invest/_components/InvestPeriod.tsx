import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface InvestPeriodProps {
  investmentPeriod: number;
  setRepeatCountHandle: (type: 'add' | 'sub') => void;
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
      <p className="text-nowrap text-[18px] text-white">Repeat Every</p>
      <div className="flex items-center gap-x-4">
        <span className="text-[18px] text-white">{investmentPeriod}</span>
        <div className="flex flex-col items-center gap-y-2">
          <button
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-white',
              'bg-[#F5F5F5] text-[#333333]',
            )}
            onClick={() => setRepeatCountHandle('add')}
          >
            +
          </button>
          <button
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-white',
              'bg-[#F5F5F5] text-[#0A0A0B]',
            )}
            onClick={() => setRepeatCountHandle('sub')}
          >
            -
          </button>
        </div>
        <Select defaultValue={selectedCycle} onValueChange={(value) => setSelectedCycle(value)}>
          <SelectTrigger
            className={cn(
              'w-min gap-x-4 rounded-lg border-[1px] border-white py-6 text-sm',
              'bg-[#F5F5F5] text-[#0A0A0B]',
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
                  className={cn('cursor-pointer hover:bg-gray-300')}
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
