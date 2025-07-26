'use client';
import { cn, getChainLogo } from '@/lib/utils';
import { Avatar } from '@/components/common/ui/avatar';
import { ChevronUpIcon, ExpandLeftIcon, SwapHorizontalIcon } from '@/components/icons';
import SolidCard from '@/components/ui/cards/SolidCard';
import { FormattedPosition, Step } from '../page';
import PositionDetailChart from './PositionDetailChart';
import React from 'react';

interface PositionDetailProps {
  position: FormattedPosition;
  setSelectedPosition: React.Dispatch<React.SetStateAction<FormattedPosition | undefined>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

const PositionDetail = ({ position, setSelectedPosition, setCurrentStep }: PositionDetailProps) => {
  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Left */}
      <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-6">
        <button
          onClick={() => {
            setSelectedPosition(undefined);
            setCurrentStep('yourPositions');
          }}
          className={cn('flex items-center justify-center gap-x-1 self-start', 'font-semibold')}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
        {/* Header */}
        <div className="flex w-full items-center">
          <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex">
                <Avatar
                  src={position.token0.logo || '/images/logo/icp-logo.svg'}
                  className="h-[34px] w-[34px] md:h-[46px] md:w-[46px]"
                />
                <Avatar
                  src={position.token1.logo || '/images/logo/icp-logo.svg'}
                  className={cn('h-[34px] w-[34px] md:h-[46px] md:w-[46px]', '-ml-4')}
                />
              </div>
              <h3 className="text-[27px] font-bold lg:text-[40px]">{`${position.token0.symbol}/${position.token1.symbol}`}</h3>
              <SwapHorizontalIcon className="w-[20px] cursor-pointer stroke-[#FFFFFF63] text-[#FFFFFF63]" />
            </div>
            <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
              <span className="text-xs leading-5 text-white/60">
                {position.fees_token1_owed_usd}
              </span>
            </SolidCard>
          </div>
        </div>
        {/* Chart */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm blur-sm lg:text-base">
            <span className="flex items-center gap-2 text-[#1BAA24]">
              <ChevronUpIcon width={12} height={12} /> 0.07%
            </span>
            <span className="text-[#898989]">Apr 23, 2025, 10:31</span>
          </div>
          <PositionDetailChart />
        </div>
      </div>
      {/* Right */}
      <div className="flex h-full w-full select-none flex-col gap-10 text-white md:flex-col-reverse lg:ml-4 lg:w-[45%]">
        {/* Boxes */}
        <div className="flex flex-col gap-5">
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Position</h3>
            <div className="mb-2.5 text-[22px] font-bold">${position.total_reserves_usd}</div>
            <div>
              <div className="flex w-full items-center justify-between text-base text-[#FFFFFFCF]">
                <span>
                  {position.token0_reserves} {position.token0.symbol}
                </span>
                <span>
                  {position.token1_reserves} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-4 flex h-[10px] w-full rounded-full">
                <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  {/* <Avatar
                    src="/images/logo/chains-logos/icp.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  /> */}
                </div>
                <p className="font-bold">${position.token0_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.token0_reserves} {position.token0.symbol}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token1.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  {/* <Avatar
                    src="/images/logo/chains-logos/icp.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  /> */}
                </div>
                <p className="font-bold">${position.token1_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.token1_reserves} {position.token1.symbol}
              </p>
            </div>
          </SolidCard>
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Fees earned</h3>
            <div className="mb-2.5 text-[22px] font-bold">${position.total_fees_owed_usd}</div>
            <div>
              <div className="flex w-full items-center justify-between text-base text-[#FFFFFFCF]">
                <span>
                  {position.fees_token0_owed} {position.token0.symbol}
                </span>
                <span>
                  {position.fees_token1_owed} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-4 flex h-[10px] w-full rounded-full">
                <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  {/* <Avatar
                    src="/images/logo/chains-logos/icp.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  /> */}
                </div>
                <p className="font-bold">${position.fees_token0_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.fees_token0_owed} {position.token0.symbol}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token1.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  {/* <Avatar
                    src="/images/logo/chains-logos/icp.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  /> */}
                </div>
                <p className="font-bold">${position.fees_token1_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.fees_token1_owed} {position.token1.symbol}
              </p>
            </div>
          </SolidCard>
        </div>
        {/* Buttons */}
        <div className="flex w-full justify-center gap-2 text-[15px] lg:gap-4">
          <button
            className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#565656] font-medium text-white md:h-[38px]"
            onClick={() => setCurrentStep('addLiquidity')}
          >
            <span>Add liquidity</span>
          </button>
          <button
            className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons font-medium text-white md:h-[38px]"
            onClick={() => setCurrentStep('removeLiquidity')}
          >
            <span>Remove liquidity</span>
          </button>
          <button
            className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons font-medium text-white md:h-[38px]"
            onClick={() => setCurrentStep('collectFees')}
          >
            <span>Collect fees</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;
