import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import SwapOption from './SwapOption';
import SwapOptionSkeleton from './SwapOptionSkeleton';
// TODO: get swap option type instead of bridge
import { BridgeOption as SwapOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { useSwapActions, useSwapStore } from '@/app/swap/_store';

interface SwapOptionsListProps {
  isPending: boolean;
}

const SwapOptionsList = ({ isPending }: SwapOptionsListProps) => {
  const { selectedOption, swapOptions, toToken } = useSwapStore();
  const { setSelectedOption } = useSwapActions();

  const [expandedOption, setExpandedOption] = useState<SwapOptionType | undefined>();

  useEffect(() => {
    if (swapOptions.options && swapOptions.options.length > 0) {
      handleSelectOption(swapOptions.options[0]);
      setExpandedOption(swapOptions.options[0]);
    }
  }, [swapOptions, setSelectedOption]);

  const handleExpand = (option: SwapOptionType) => {
    if (expandedOption?.deposit_helper_contract === option.deposit_helper_contract) {
      setExpandedOption(undefined);
    } else {
      setExpandedOption(option);
    }
  };

  const handleSelectOption = (option: SwapOptionType) => {
    if (swapOptions) {
      setSelectedOption(option);
    }
  };

  return (
    <div className="flex animate-slide-in flex-col items-start opacity-0 md:pr-2 lg:w-full">
      <p className="mb-5 text-[26px] font-bold leading-7 text-primary md:hidden md:text-[40px] md:leading-10">
        Swap Options
      </p>
      <div
        className={cn(
          'flex w-full gap-4 lg:flex-col',
          'lg:h-full',
          'overflow-x-auto lg:overflow-y-auto',
          'hide-scrollbar',
        )}
      >
        {typeof swapOptions === 'undefined' || isPending ? (
          <>
            <SwapOptionSkeleton />
            <SwapOptionSkeleton />
          </>
        ) : !isPending && swapOptions.options && toToken ? (
          swapOptions.options.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex-shrink-1 h-fit',
                swapOptions.options && swapOptions.options.length < 2
                  ? 'w-full'
                  : 'w-[280px] md:w-full',
              )}
            >
              <SwapOption
                option={item}
                isSelected={
                  selectedOption?.deposit_helper_contract === item.deposit_helper_contract
                }
                isExpanded={
                  expandedOption?.deposit_helper_contract === item.deposit_helper_contract
                }
                handleOptionSelect={(option) => handleSelectOption(option)}
                onExpand={handleExpand}
                toToken={toToken}
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

export default SwapOptionsList;
