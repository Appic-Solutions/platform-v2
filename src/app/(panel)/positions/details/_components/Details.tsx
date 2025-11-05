import { Avatar } from '@/components/common/ui/avatar';
import { ChevronUpIcon, ExpandLeftIcon } from '@/components/icons';
import SolidCard from '@/components/ui/cards/SolidCard';
import { calculatePercent, cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import PositionDetailsChart from './PositionDetailsChart';
import { FeesPercentage, PositionPercentage, Step } from '../../types';
import BigNumber from 'bignumber.js';
import AvatarGroup from '../../_components/AvatarGroup';
import Link from 'next/link';
import { usePositionDetailsStore } from '../../_store/usePositionDetailsStore';

const Details = () => {
  const { selectedPosition: position, actions } = usePositionDetailsStore();

  const [positionPercentage, setPositionPercentage] = useState<PositionPercentage>({
    token0Percent: 0,
    token1Percent: 0,
  });
  const [feesPercentage, setFeesPercentage] = useState<FeesPercentage>({
    token0Percent: 0,
    token1Percent: 0,
  });

  if (!position) {
    return null;
  }

  useEffect(() => {
    // calculate percentage of position range
    const positionPercentageCalcRes = calculatePercent({
      num1: parseFloat(position.token0_reserves),
      num2: parseFloat(position.token1_reserves),
    });
    const feesPercentageCalcRes = calculatePercent({
      num1: parseFloat(position.fees_token0_owed),
      num2: parseFloat(position.fees_token1_owed),
    });
    setPositionPercentage({
      token0Percent: positionPercentageCalcRes.num1Percentage,
      token1Percent: positionPercentageCalcRes.num2Percentage,
    });
    setFeesPercentage({
      token0Percent: feesPercentageCalcRes.num1Percentage,
      token1Percent: feesPercentageCalcRes.num2Percentage,
    });
  }, []);

  return (
    <div className="flex w-full max-w-xl animate-fade flex-col gap-6 overflow-hidden md:overflow-y-scroll lg:max-w-full lg:flex-row">
      {/* Left */}
      <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-5">
        <Link
          href={'/positions'}
          className={cn(
            'mb-2 flex items-center justify-center gap-x-1 self-start md:mb-0',
            'font-semibold',
          )}
        >
          <ExpandLeftIcon width={16} height={16} />
          Back
        </Link>
        {/* Header */}
        <div className="flex w-full items-center">
          <div className="mb-4 flex w-full items-center justify-between gap-2 lg:gap-4">
            <div className="flex items-center gap-4">
              <AvatarGroup avatar0={position.token0.logo} avatar1={position.token1.logo} />
              <h3 className="text-2xl font-semibold lg:text-3xl">{`${position.token0.symbol}/${position.token1.symbol}`}</h3>
            </div>
            <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
              <span className="text-xs text-white/60">
                {Number(position.pool.pool_id.fee) / 10000}%
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
      <div className="flex h-full w-full select-none flex-col gap-4 text-white md:flex-col-reverse lg:ml-4 lg:w-[45%]">
        {/* Boxes */}
        <div className="flex flex-col gap-4">
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Position</h3>
            <div className="mb-2 text-xl font-semibold">${position.total_reserves_usd}</div>
            <div>
              <div className="flex w-full items-center justify-between text-sm text-[#FFFFFFCF]">
                <span>
                  {BigNumber(position.token0_reserves).toFixed(6)} {position.token0.symbol}
                </span>
                <span>
                  {BigNumber(position.token1_reserves).toFixed(6)} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-2 flex h-[10px] w-full overflow-hidden rounded-full">
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
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                </div>
                <p className="font-semibold">${position.token0_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.token0_reserves} {position.token0.symbol}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token1.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                </div>
                <p className="font-semibold">${position.token1_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.token1_reserves} {position.token1.symbol}
              </p>
            </div>
          </SolidCard>
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Fees earned</h3>
            <div className="mb-2 text-xl font-semibold">${position.total_fees_owed_usd}</div>
            <div>
              <div className="flex w-full items-center justify-between text-sm text-[#FFFFFFCF]">
                <span>
                  {parseFloat(position.fees_token0_owed).toFixed(6)} {position.token0.symbol}
                </span>
                <span>
                  {parseFloat(position.fees_token1_owed).toFixed(6)} {position.token1.symbol}
                </span>
              </div>
              <div className="mb-2 flex h-[10px] w-full overflow-hidden rounded-full">
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
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token0.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                </div>
                <p className="font-semibold">${position.fees_token0_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.fees_token0_owed} {position.token0.symbol}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    src={position.token1.logo || '/images/logo/icp-logo.svg'}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                </div>
                <p className="font-semibold">${position.fees_token1_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">
                {position.fees_token1_owed} {position.token1.symbol}
              </p>
            </div>
          </SolidCard>
        </div>
        {/* Buttons */}
        <div className="flex w-full justify-between gap-1 text-xs lg:gap-4 lg:text-sm">
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-lg bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => actions.setCurrentStep('addLiquidity')}
          >
            <span>Add liquidity</span>
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-lg bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => actions.setCurrentStep('removeLiquidity')}
          >
            <span>Remove liquidity</span>
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 text-nowrap rounded-lg bg-primary-buttons p-2.5 font-normal leading-3 text-white hover:bg-primary-buttons-hover md:leading-5"
            onClick={() => actions.setCurrentStep('collectFees')}
          >
            <span>Collect fees</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
