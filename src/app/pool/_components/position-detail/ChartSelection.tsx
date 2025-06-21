import { ChevronDownIcon } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';

const ChartSelection = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-[115px] items-center justify-between rounded-[10px] bg-[#565656] px-[14px] py-[6px] text-[#E3E3E3]">
          <span>Chart</span>
          <ChevronDownIcon width={16} height={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36">
        <ul className="flex flex-col items-start text-white">
          <li>option 1</li>
          <li>option 2</li>
          <li>option 3</li>
          <li>option 4</li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ChartSelection;
