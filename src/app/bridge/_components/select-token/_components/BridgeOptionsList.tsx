import { cn } from '@/common/helpers/utils';
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
    <div className={cn('flex flex-col items-start mb-5', 'lg:w-full md:pr-2', 'animate-slide-in opacity-0')}>
      <p className="text-primary mb-5 md:hidden text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold">
        Bridge Options
      </p>
      <div
        className={cn(
          'flex lg:flex-col gap-4 w-full',
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
                bridgeOptions.options && bridgeOptions.options.length < 2 ? 'w-full' : 'md:w-full w-[280px]',
              )}
            >
              <BridgeOption
                option={item}
                isSelected={selectedOption?.deposit_helper_contract === item.deposit_helper_contract}
                isExpanded={expandedOption?.deposit_helper_contract === item.deposit_helper_contract}
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
