'use client';

import Box from '@/components/ui/box';
import { cn, getChainLogo } from '@/lib/utils';
import { Avatar } from '@/components/common/ui/avatar';
import {
  ChevronUpIcon,
  ExpandLeftIcon,
  ManageSearchIcon,
  PlusIcon,
  SwapHorizontalIcon,
} from '@/components/icons';
import CopyMinimalIcon from '@/components/icons/copy-minimal';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import PositionDetailChart from './PositionDetailChart';
import React from 'react';

const PositionDetail = ({
  position,
  setSelectedPosition,
}: {
  position: Position;
  setSelectedPosition: React.Dispatch<React.SetStateAction<Position | null>>;
}) => {
  return (
    <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
      {/* left */}
      <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-6">
        <button
          onClick={() => setSelectedPosition(null)}
          className={cn('flex items-center justify-center gap-x-1 self-start', 'font-semibold')}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
        {/* header */}
        <div className="flex w-full items-center">
          <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
            <div className="flex items-center gap-4">
              {/* <AvatarGroup /> */}
              <h3 className="text-[27px] font-bold lg:text-[40px]">What/What</h3>
              <SwapHorizontalIcon className="w-[20px] cursor-pointer stroke-[#FFFFFF63] text-[#FFFFFF63]" />
            </div>
            <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
              <span className="text-xs leading-5 text-white/60">
                {position.total_fees_owed_usd}%
              </span>
            </SolidCard>
          </div>
        </div>
        {/* chart */}
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
      {/* right */}
      <div className="flex h-full w-full select-none flex-col gap-10 text-white md:flex-col-reverse lg:ml-4 lg:w-[45%]">
        {/* boxes */}
        <div className="flex flex-col gap-5">
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Position</h3>
            <div className="mb-2.5 text-[22px] font-bold">${position.total_reserves_usd}</div>
            {/* range bar */}
            <div>
              <div className="flex w-full items-center justify-between text-base text-[#FFFFFFCF]">
                <span>{position.token0_reserves} What</span>
                <span>{position.token1_reserves} What</span>
              </div>
              <div className="mb-4 flex h-[10px] w-full rounded-full">
                <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
              </div>
            </div>
            {/* token0 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    // src={token?.logo}
                    src={getChainLogo('')}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  <Avatar
                    // src={token?.chainLogo}
                    src="/images/logo/chains-logos/ethereum.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  />
                </div>
                <p className="font-bold">${position.token0_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">{`<0.001 BNB`}</p>
            </div>
            {/* token1 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    // src={token?.logo}
                    src={getChainLogo('')}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  <Avatar
                    // src={token?.chainLogo}
                    src="/images/logo/chains-logos/ethereum.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  />
                </div>
                <p className="font-bold">${position.token1_reserves_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">{`<0.001 BNB`}</p>
            </div>
          </SolidCard>
          <SolidCard size="lg" className="w-full bg-[#FFFFFF1A]">
            <h3 className="mb-1 text-sm text-[#898989]">Fees earned</h3>
            <div className="mb-2.5 text-[22px] font-bold">${position.total_fees_owed_usd}</div>
            {/* range bar */}
            <div>
              <div className="flex w-full items-center justify-between text-base text-[#FFFFFFCF]">
                <span>{position.token0_reserves} What</span>
                <span>{position.token1_reserves} What</span>
              </div>
              <div className="mb-4 flex h-[10px] w-full rounded-full">
                <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
              </div>
            </div>
            {/* token0 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    // src={token?.logo}
                    src={getChainLogo('')}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  <Avatar
                    // src={token?.chainLogo}
                    src="/images/logo/chains-logos/ethereum.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  />
                </div>
                <p className="font-bold">${position.fees_token0_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">{`<0.001 BNB`}</p>
            </div>
            {/* token1 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-max">
                  <Avatar
                    // src={token?.logo}
                    src={getChainLogo('')}
                    className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                  />
                  <Avatar
                    // src={token?.chainLogo}
                    src="/images/logo/chains-logos/ethereum.svg"
                    className={cn(
                      'h-[12px] w-[12px] md:h-[14px] md:w-[14px]',
                      'absolute bottom-0 right-0',
                    )}
                  />
                </div>
                <p className="font-bold">${position.fees_token1_owed_usd}</p>
              </div>
              <p className="text-sm font-medium text-[#FFFFFFCF]">{`<0.001 BNB`}</p>
            </div>
          </SolidCard>
        </div>
        {/* buttons */}
        <div className="flex w-full justify-center gap-2 text-[15px] lg:gap-4">
          <button className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#565656] font-medium text-white md:h-[38px]">
            <PlusIcon className="rotate-90" width={16} height={16} />
            <span>Add liquidity</span>
          </button>
          <button className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons font-medium text-white md:h-[38px]">
            <span>Remove liquidity</span>
          </button>
          <button className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons font-medium text-white md:h-[38px]">
            <span>Collect fees</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;
