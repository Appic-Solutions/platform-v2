import { cn } from '@/common/helpers/utils';
import React, { useState } from 'react';
import BridgeOption from './BridgeOption';
import BridgeOptionSkeleton from './BridgeOptionSkeleton';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';

interface BridgeOptionsListProps {
  handleOptionSelect: (option: BridgeOptionType) => void;
  selectedOption: BridgeOptionType | undefined;
  bridgeOptions: BridgeOptionType[] | undefined;
  isPending: boolean;
  isError: boolean;
  toTokenLogo: string;
}

const BridgeOptionsList = ({
  selectedOption,
  handleOptionSelect,
  bridgeOptions,
  isPending,
  toTokenLogo,
}: BridgeOptionsListProps) => {
  const [expandedOption, setExpandedOption] = useState<BridgeOptionType | undefined>(bridgeOptions && bridgeOptions[0]);

  const handleExpand = (option: BridgeOptionType) => {
    if (expandedOption?.deposit_helper_contract === option.deposit_helper_contract) {
      setExpandedOption(undefined);
    } else {
      setExpandedOption(option);
    }
  };

  return (
    <div className={cn('flex flex-col items-start mb-5', 'lg:w-full md:pr-2', 'animate-slide-in opacity-0')}>
      <p className="text-primary mb-5 md:hidden text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold">
        Bridge Options
      </p>
      <div
        className={cn(
          'flex lg:flex-col gap-4 w-full',
          'lg:h-full',
          'overflow-x-auto lg:overflow-y-auto',
          'pr-4 hide-scrollbar',
        )}
      >
        {typeof bridgeOptions === 'undefined' || isPending ? (
          <>
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
          </>
        ) : !isPending && bridgeOptions ? (
          bridgeOptions.map((item, idx) => (
            <div key={idx} className={cn('flex-shrink-1 h-fit', bridgeOptions.length < 2 ? 'w-full' : '')}>
              <BridgeOption
                option={item}
                isSelected={selectedOption?.deposit_helper_contract === item.deposit_helper_contract}
                isExpanded={expandedOption?.deposit_helper_contract === item.deposit_helper_contract}
                handleOptionSelect={(option) => handleOptionSelect(option)}
                onExpand={handleExpand}
                toTokenLogo={toTokenLogo}
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
