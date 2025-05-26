import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import BridgeOption from './BridgeOption';
import BridgeOptionSkeleton from './BridgeOptionSkeleton';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';

interface BridgeOptionsListProps {
  isPending: boolean;
}

const BridgeOptionsList = ({ isPending }: BridgeOptionsListProps) => {
  const { selectedOption, bridgeOptions, toToken } = useBridgeStore();
  const { setSelectedOption } = useBridgeActions();

  const [expandedOption, setExpandedOption] = useState<BridgeOptionType | undefined>();

  useEffect(() => {
    if (bridgeOptions.options && bridgeOptions.options.length > 0) {
      handleSelectOption(bridgeOptions.options[0]);
      setExpandedOption(bridgeOptions.options[0]);
    }
  }, [bridgeOptions, setSelectedOption]);

  const handleExpand = (option: BridgeOptionType) => {
    if (expandedOption?.deposit_helper_contract === option.deposit_helper_contract) {
      setExpandedOption(undefined);
    } else {
      setExpandedOption(option);
    }
  };

  const handleSelectOption = (option: BridgeOptionType) => {
    if (bridgeOptions) {
      setSelectedOption(option);
    }
  };

  return (
    <div
      className={cn(
        'mb-5 flex flex-col items-start',
        'md:pr-2 lg:w-full',
        'animate-slide-in opacity-0',
      )}
    >
      <p className="mb-5 text-[26px] font-bold leading-7 text-primary md:hidden md:text-[40px] md:leading-10">
        Bridge Options
      </p>
      <div
        className={cn(
          'flex w-full gap-4 lg:flex-col',
          'lg:h-full',
          'overflow-x-auto lg:overflow-y-auto',
          'hide-scrollbar',
        )}
      >
        {typeof bridgeOptions === 'undefined' || isPending ? (
          <>
            <BridgeOptionSkeleton />
            <BridgeOptionSkeleton />
          </>
        ) : !isPending && bridgeOptions.options && toToken ? (
          bridgeOptions.options.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex-shrink-1 h-fit',
                bridgeOptions.options && bridgeOptions.options.length < 2
                  ? 'w-full'
                  : 'w-[280px] md:w-full',
              )}
            >
              <BridgeOption
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

export default BridgeOptionsList;
