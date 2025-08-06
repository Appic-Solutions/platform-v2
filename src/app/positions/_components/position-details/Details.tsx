import { Avatar } from '@/components/common/ui/avatar';
import { ChevronUpIcon, ExpandLeftIcon } from '@/components/icons';
import SolidCard from '@/components/ui/cards/SolidCard';
import { cn } from '@/lib/utils';
import React from 'react';
import PositionDetailsChart from './PositionDetailsChart';
import { FeesPercentage, PositionPercentage, Step } from '../../types';
import BigNumber from 'bignumber.js';

interface DetailsProps {
  position: any;
  onBackClick: () => void;
  positionPercentage: PositionPercentage;
  feesPercentage: FeesPercentage;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

const Details = ({
  position,
  onBackClick,
  positionPercentage,
  feesPercentage,
  setCurrentStep,
}: DetailsProps) => {
  return (
    <div className="flex w-full animate-fade flex-col gap-8 overflow-hidden lg:flex-row lg:gap-12">
      {/* Left */}
      <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-6">
        <button
          onClick={onBackClick}
          className={cn(
            'mb-4 flex items-center justify-center gap-x-1 self-start md:mb-0',
            'font-semibold',
          )}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
        {/* Header */}
        <div className="flex w-full items-center">
          <div className="mb-4 flex w-full items-center justify-between gap-2 lg:gap-4">
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
          <PositionDetailsChart />
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
                  {BigNumber(position.token0_reserves).toFixed(6)} {position.token0.symbol}
                </span>
                <span>
                  {BigNumber(position.token1_reserves).toFixed(6)} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-4 flex h-[10px] w-full overflow-hidden rounded-full">
                {positionPercentage.token0Percent || positionPercentage.token1Percent ? (
                  <>
                    <div
                      className="h-full bg-[#FF2C8BB2] transition-all"
                      style={{
                        width: `${positionPercentage.token0Percent.toFixed()}%`,
                      }}
                    />
                    <div
                      className="h-full bg-[#1C68F8B2] transition-all"
                      style={{
                        width: `${positionPercentage.token1Percent.toFixed()}%`,
                      }}
                    />
                  </>
                ) : (
                  <div className="h-full w-full bg-[#9c9c9cb2] transition-all" />
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
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
                  {parseFloat(position.fees_token0_owed).toFixed(6)} {position.token0.symbol}
                </span>
                <span>
                  {parseFloat(position.fees_token1_owed).toFixed(6)} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-4 flex h-[10px] w-full overflow-hidden rounded-full">
                {feesPercentage.token0Percent || feesPercentage.token1Percent ? (
                  <>
                    <div
                      className="h-full bg-[#FF2C8BB2] transition-all"
                      style={{
                        width: `${feesPercentage.token0Percent.toFixed()}%`,
                      }}
                    />
                    <div
                      className="h-full bg-[#1C68F8B2] transition-all"
                      style={{
                        width: `${feesPercentage.token1Percent.toFixed()}%`,
                      }}
                    />
                  </>
                ) : (
                  <div className="h-full w-full bg-[#9c9c9cb2] transition-all" />
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
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
        <div className="flex w-full justify-between gap-1 text-sm lg:gap-4 lg:text-[15px]">
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-[10px] bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => setCurrentStep('addLiquidity')}
          >
            <span>Add liquidity</span>
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-[10px] bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => setCurrentStep('removeLiquidity')}
          >
            <span>Remove liquidity</span>
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-[10px] bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => setCurrentStep('collectFees')}
          >
            <span>Collect fees</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
