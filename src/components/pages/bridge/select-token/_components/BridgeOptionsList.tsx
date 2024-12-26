import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import BridgeOption from './BridgeOption';
import BridgeOptionSkeleton from './BridgeOptionSkeleton';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';

interface BridgeOptionsListProps {
  handleOptionSelect: (option: BridgeOptionType) => void;
  selectedOption: BridgeOptionType | null;
  bridgeOptions: BridgeOptionType[];
  isPending: boolean;
  isError: boolean;
}

const BridgeOptionsList = ({
  selectedOption,
  handleOptionSelect,
  bridgeOptions,
  isPending,
  isError,
}: BridgeOptionsListProps) => {
  const [expandedOption, setExpandedOption] = useState<BridgeOptionType | null>(null);

  const handleExpand = (option: BridgeOptionType) => {
    if (expandedOption === option) {
      setExpandedOption(null);
    } else {
      setExpandedOption(option);
    }
  };

  return (
    <div className={cn('flex flex-col items-start mb-5', 'lg:w-full md:pr-2', 'animate-slide-in opacity-0')}>
      <div
        className={cn(
          'flex lg:flex-col gap-4 w-full',
          'lg:h-full',
          'overflow-x-auto lg:overflow-y-auto',
          'pr-4 hide-scrollbar',
        )}
      >
        {isPending ? (
          <>
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
          </>
        ) : !isPending && bridgeOptions ? (
          bridgeOptions.map((item, idx) => (
            <div key={idx} className="flex-shrink-1 h-fit">
              <BridgeOption
                option={item}
                isSelected={selectedOption?.amount === item.amount && selectedOption.minter_id === item.minter_id}
                isExpanded={expandedOption?.amount === item.amount && expandedOption.minter_id === item.minter_id}
                handleOptionSelect={(option) => handleOptionSelect(option)}
                onExpand={handleExpand}
              />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BridgeOptionsList;
