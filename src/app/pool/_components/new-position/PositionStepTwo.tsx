import React, { useState } from 'react';
import AvatarGroup from './AvatarGroup';
import { cn } from '@/lib/utils';
import ChartDataBox from './ChartDataBox';
import StepTwoPoolExist from './StepTwoPoolExist';
import StepTwoPoolNotExist from './StepTwoPoolNotExist';
import { Avatar } from '@/components/common/ui/avatar';

const PositionStepTwo = () => {
  const [minPrice, setMinPrice] = useState(1100);
  const [maxPrice, setMaxPrice] = useState(1600);
  const [poolExist, setPoolExist] = useState(true);

  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* chart & details & chart controls */}
      <div className="flex h-full w-full flex-col gap-6 lg:w-[59%]">
        {/* header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 lg:gap-4">
            <AvatarGroup />
            <h3 className="text-[27px] font-bold lg:text-[40px]">USDC/ETH</h3>
          </div>
          <div className="flex items-center gap-x-1">
            {/* TODO: remove this */}
            <button
              onClick={() => setPoolExist(!poolExist)}
              className="bg-white/10 px-1.5 py-px text-[10px]"
            >
              switch
            </button>
            <div
              className={cn(
                'rounded-[6px] bg-white/10',
                'px-1.5 py-px',
                'text-xs leading-5 text-white/60',
              )}
            >
              V3
            </div>
            <div
              className={cn(
                'rounded-[6px] bg-white/10',
                'px-1.5 py-px',
                'text-xs leading-5 text-white/60',
              )}
            >
              1%
            </div>
          </div>
        </div>
        {poolExist ? (
          <StepTwoPoolExist setMaxPrice={setMaxPrice} setMinPrice={setMinPrice} />
        ) : (
          <StepTwoPoolNotExist />
        )}
      </div>
      {/* boxes */}
      <div className="flex h-full w-full select-none flex-col gap-10 text-white lg:w-[41%]">
        <div>
          <h3 className="mb-4 text-xl font-bold lg:text-2xl">Set Price range</h3>
          <div className="flex justify-start gap-4 lg:justify-between">
            <ChartDataBox>
              <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Min price</p>
              <div className="flex flex-col gap-2">
                <p className="text-[22px] lg:text-[27px]">{minPrice.toFixed(2)}</p>
                <p className="text-xs text-[#FFFFFF7A] lg:text-sm">USDC = 1 ETH</p>
              </div>
            </ChartDataBox>
            <ChartDataBox>
              <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Min price</p>
              <div className="flex flex-col gap-2">
                <p className="text-[22px] lg:text-[27px]">{maxPrice.toFixed(2)}</p>
                <p className="text-xs text-[#FFFFFF7A] lg:text-sm">USDC = 1 ETH</p>
              </div>
            </ChartDataBox>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-2xl font-bold">Deposit tokens</h3>
          <p className="mb-4 text-[15px] font-normal">
            The amount earned providing liquidity. Choose an amount that suits your risk tolerance
            and strategy.
          </p>
          <div className="flex justify-start gap-4 lg:justify-between">
            <ChartDataBox>
              <div className="flex items-center gap-2">
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/chains-logos/ethereum.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
                />
                <p className="text-base text-[#FFFFFF] lg:text-[21px]">ETH</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[22px] lg:text-[27px]">{minPrice.toFixed(2)}</p>
                <p className="text-xs text-[#FFFFFF7A] lg:text-sm">$110.0M</p>
              </div>
            </ChartDataBox>
            <ChartDataBox>
              <div className="flex items-center gap-2">
                <Avatar
                  // src={token?.logo}
                  src="/images/logo/chains-logos/ethereum.svg"
                  className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
                />
                <p className="text-base text-[#FFFFFF] lg:text-[21px]">ETH</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[22px] lg:text-[27px]">{maxPrice.toFixed(2)}</p>
                <p className="text-xs text-[#FFFFFF7A] lg:text-sm">$110.0M</p>
              </div>
            </ChartDataBox>
          </div>
        </div>
        <button className="h-[50px] rounded-[15px] bg-primary-buttons lg:h-[66px]">Review</button>
      </div>
    </div>
  );
};

export default PositionStepTwo;
