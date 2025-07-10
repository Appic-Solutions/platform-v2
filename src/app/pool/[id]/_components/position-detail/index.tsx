'use client';

import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import Image from 'next/image';
import PositionDetailChart from './PositionDetailChart';
import { PlusIcon } from '@/components/icons';
import { chartShowRanges } from '../../../create/_components/step-two/data';
import ChartSelection from './ChartSelection';
import { Avatar } from '@/components/common/ui/avatar';

const PositionDetail = () => {
  const [selectedChartShowRange, setSelectedChartShowRange] =
    useState<(typeof chartShowRanges)[number]['value']>('1d');
  return (
    <Box
      className={cn(
        'text-white transition-all lg:p-12 lg:text-black lg:dark:text-white',
        'lg:h-[789px] lg:w-[1204px]',
      )}
    >
      <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
        {/* left */}
        <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-6">
          {/* header */}
          <div className="flex w-full items-center">
            <div className="flex items-center gap-2 lg:gap-4">
              {/* <AvatarGroup /> */}
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-[27px] font-bold lg:text-[40px]">USDC/ETH</h3>
                  <div className="flex items-center justify-start gap-x-1">
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
                <div className="hidden items-center gap-1 lg:flex">
                  <Image alt="" width={23} height={23} src={'/images/logo/chains-logos/bsc.svg'} />
                  <p className="text-nowrap text-xs font-medium">BNB Smart Chain Mainnet</p>
                  <div className="ms-2 flex items-center gap-2 text-xs">
                    <span className="h-[9px] w-[9px] rounded-full bg-[#77EF4B]"></span>
                    <span className="text-nowrap text-[#77EF4B]">In range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 flex items-center gap-1 lg:hidden">
            <Image alt="" width={23} height={23} src={'/images/logo/chains-logos/bsc.svg'} />
            <p className="text-nowrap text-xs font-medium">BNB Smart Chain Mainnet</p>
            <div className="ms-2 flex items-center gap-2 text-xs">
              <span className="h-[9px] w-[9px] rounded-full bg-[#77EF4B]"></span>
              <span className="text-nowrap text-[#77EF4B]">In range</span>
            </div>
          </div>
          {/* chart */}
          <div>
            {/* <div className="flex w-full items-center justify-between"> */}
            <p className="mb-4 font-semibold lg:text-2xl">{`1 USDC =< 0.001 AETX($0.01)`}</p>
            {/* <ManageSearchIcon width={28} height={28} /> */}
            {/* </div> */}
            {/* <div className="mb-4 flex items-center gap-2 text-sm lg:text-base">
              <span className="flex items-center gap-2 text-[#1BAA24]">
                <ChevronUpIcon width={12} height={12} /> 0.07%
              </span>
              <span className="text-[#898989]">Apr 23, 2025, 10:31</span>
            </div> */}

            <PositionDetailChart />
            {/* chart controls */}
            <div className="flex w-full flex-col items-start gap-4 lg:flex-row-reverse lg:items-center lg:justify-between">
              <div className="flex items-center justify-end gap-[10px]">
                {chartShowRanges.map((chartRange) =>
                  chartRange.value !== 'all' ? (
                    <button
                      key={chartRange.value}
                      className={cn(
                        'flex items-center justify-center rounded-full border text-sm font-medium transition-colors',
                        selectedChartShowRange === chartRange.value
                          ? 'border-[#E9DDF9] bg-[#565656] dark:bg-[#FFFFFFBA] dark:text-black'
                          : 'border-[#565656] bg-[#565656]',
                        chartRange.value === 'all' ? 'w-max p-2' : 'h-[37px] w-[37px]',
                      )}
                      onClick={() => setSelectedChartShowRange(chartRange.value)}
                    >
                      {chartRange.label}
                    </button>
                  ) : (
                    ''
                  ),
                )}
              </div>
              <ChartSelection />
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex h-full w-full select-none flex-col gap-10 text-white lg:w-[45%] lg:flex-col-reverse">
          {/* boxes */}
          <div className="flex flex-col gap-10 lg:ml-4">
            <div className="h-[256px] w-full rounded-[21px] bg-[#222222] px-6 py-5">
              <h3 className="mb-2 text-sm text-[#898989]">Position</h3>
              <p className="mb-4 font-bold lg:text-[22px]">$1.05</p>
              <div>
                <div className="mb-2 flex w-full items-center justify-between text-sm text-[#FFFFFFCF]">
                  <span>1.7K USDC</span>
                  <span>21.6B AETX</span>
                </div>
                <div className="mb-4 flex h-[10px] w-full rounded-full">
                  <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                  <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar
                        // src={token?.logo}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="h-6 w-6 md:h-7 md:w-7"
                      />
                      <Avatar
                        // src={getChainLogo(token?.chainId)}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="absolute -right-1 bottom-0 h-3.5 w-3.5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <span className="text-base font-bold">$1.05</span>
                  </div>
                  <span className="text-sm text-[#FFFFFFCF]">0.002 BNB</span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar
                        // src={token?.logo}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="h-6 w-6 md:h-7 md:w-7"
                      />
                      <Avatar
                        // src={getChainLogo(token?.chainId)}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="absolute -right-1 bottom-0 h-3.5 w-3.5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <span className="text-base font-bold">$1.05</span>
                  </div>
                  <span className="text-sm text-[#FFFFFFCF]">0.002 BNB</span>
                </div>
              </div>
            </div>
            <div className="h-[256px] w-full rounded-[21px] bg-[#222222] px-6 py-5">
              <h3 className="mb-2 text-sm text-[#898989]">Position</h3>
              <p className="mb-4 font-bold lg:text-[22px]">$1.05</p>
              <div>
                <div className="mb-2 flex w-full items-center justify-between text-sm text-[#FFFFFFCF]">
                  <span>1.7K USDC</span>
                  <span>21.6B AETX</span>
                </div>
                <div className="mb-4 flex h-[10px] w-full rounded-full">
                  <div className="h-full w-1/3 rounded-l-full bg-[#FF2C8BB2]"></div>
                  <div className="h-full w-2/3 rounded-r-full bg-[#1C68F8B2]"></div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar
                        // src={token?.logo}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="h-6 w-6 md:h-7 md:w-7"
                      />
                      <Avatar
                        // src={getChainLogo(token?.chainId)}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="absolute -right-1 bottom-0 h-3.5 w-3.5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <span className="text-base font-bold">$1.05</span>
                  </div>
                  <span className="text-sm text-[#FFFFFFCF]">0.002 BNB</span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar
                        // src={token?.logo}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="h-6 w-6 md:h-7 md:w-7"
                      />
                      <Avatar
                        // src={getChainLogo(token?.chainId)}
                        src="/images/logo/chains-logos/ethereum.svg"
                        className="absolute -right-1 bottom-0 h-3.5 w-3.5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    <span className="text-base font-bold">$1.05</span>
                  </div>
                  <span className="text-sm text-[#FFFFFFCF]">0.002 BNB</span>
                </div>
              </div>
            </div>
          </div>
          {/* buttons */}
          <div className="flex w-full justify-center gap-1 text-sm lg:gap-4">
            <button className="flex flex-nowrap items-center justify-between gap-2 text-nowrap rounded-[10px] bg-[#565656] px-[12px] py-[6px] text-[#E3E3E3] md:px-[14px]">
              <PlusIcon className="hidden md:block" width={16} height={16} />
              <span>Add liquidity</span>
            </button>
            <button className="flex items-center justify-between text-nowrap rounded-[10px] bg-[#565656] px-[12px] py-[6px] text-[#E3E3E3] md:px-[14px]">
              <span>Remove liquidity</span>
            </button>
            <button className="flex items-center justify-between text-nowrap rounded-[10px] bg-primary-buttons px-[12px] py-[6px] text-[#E3E3E3] md:px-[14px]">
              <span>Collect fees</span>
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default PositionDetail;
