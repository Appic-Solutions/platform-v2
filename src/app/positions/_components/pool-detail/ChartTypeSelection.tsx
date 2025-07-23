'use client';

import { ChevronDownIcon } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';
import { PoolDetailChartTypes } from './data';

const ChartTypeSelection = ({
  selectedChartType,
  setSelectedChartType,
}: {
  selectedChartType: PoolDetailChartTypes;
  setSelectedChartType: React.Dispatch<React.SetStateAction<PoolDetailChartTypes>>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex w-[115px] items-center justify-between rounded-[10px] bg-[#565656] px-[14px] py-[6px] text-[#E3E3E3]">
          <span>{selectedChartType}</span>
          <ChevronDownIcon width={16} height={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36 text-black dark:text-white">
        <ul className="relative flex flex-col items-start">
          {Object.values(PoolDetailChartTypes).map((type) => (
            <li
              key={type}
              onClick={() => {
                setSelectedChartType(type);
                setIsOpen(false);
              }}
              className="w-full cursor-pointer rounded-md p-2 hover:bg-[#565656]"
            >
              {type}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ChartTypeSelection;
