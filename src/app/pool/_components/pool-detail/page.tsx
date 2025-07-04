'use client';

import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AvatarGroup from '../new-position/AvatarGroup';
import { Avatar } from '@/components/common/ui/avatar';
import { ChevronUpIcon, ManageSearchIcon, PlusIcon, SwapHorizontalIcon } from '@/components/icons';
import PoolDetailChart from './PoolDetailChart';
import { chartShowRanges, PoolDetailChartTypes } from './data';
import ChartTypeSelection from './ChartTypeSelection';
import CopyMinimalIcon from '@/components/icons/copy-minimal';

const PoolDetailPage = () => {
  const [selectedChartType, setSelectedChartType] = useState<PoolDetailChartTypes>(
    PoolDetailChartTypes.Volume,
  );
  const [selectedChartShowRange, setSelectedChartShowRange] =
    useState<(typeof chartShowRanges)[number]['value']>('volume');
  return (
    <Box
      className={cn(
        'text-white transition-all lg:p-10 lg:text-black lg:dark:text-white',
        'lg:h-[789px] lg:w-[1204px]',
      )}
    >
      <div className="flex w-full animate-fade select-none flex-col gap-8 lg:flex-row lg:gap-12">
        {/* left */}
        <div className="flex h-full w-full flex-col lg:w-[55%] lg:gap-6">
          {/* header */}
          <div className="flex w-full items-center">
            <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
              <div className="flex items-center gap-4">
                <AvatarGroup />
                <h3 className="text-[27px] font-bold lg:text-[40px]">USDC/ETH</h3>
                <SwapHorizontalIcon className="w-[20px] cursor-pointer stroke-[#FFFFFF63] text-[#FFFFFF63]" />
              </div>
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
          </div>
          {/* chart */}
          <div>
            <div className="flex w-full items-center justify-between">
              <p className="mb-4 font-semibold lg:text-2xl">{`1 USDC =< 0.001 AETX($0.01)`}</p>
              <ManageSearchIcon width={28} height={28} />
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm lg:text-base">
              <span className="flex items-center gap-2 text-[#1BAA24]">
                <ChevronUpIcon width={12} height={12} /> 0.07%
              </span>
              <span className="text-[#898989]">Apr 23, 2025, 10:31</span>
            </div>

            <PoolDetailChart selectedChartType={selectedChartType} />
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
              <ChartTypeSelection
                selectedChartType={selectedChartType}
                setSelectedChartType={setSelectedChartType}
              />
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex h-full w-full select-none flex-col gap-10 text-white lg:ml-4 lg:w-[45%]">
          {/* boxes */}
          <div className="flex flex-col">
            <h2 className="mb-2 text-xl font-bold lg:text-2xl">Stats</h2>
            <div className="mb-5 w-full rounded-[21px] bg-[#222222] px-6 py-5">
              <h3 className="mb-2 text-sm text-[#898989]">Pool balances</h3>
              <div>
                <div className="mb-2 flex w-full items-center justify-between text-base text-[#FFFFFF]">
                  <span>1.7K USDC</span>
                  <span>21.6B AETX</span>
                </div>
                <div className="mb-4 flex h-[10px] w-full rounded-full">
                  <div className="h-full w-3/4 rounded-l-full bg-[#FF2C8BB2]"></div>
                  <div className="h-full w-1/4 rounded-r-full bg-[#1C68F8B2]"></div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm text-[#898989]">Pool balances</h3>
                  <div className="mb-2 flex w-full items-center justify-between text-base text-[#FFFFFF]">
                    <span>1.7K USDC</span>
                    <span className="flex items-center gap-1">
                      <ChevronUpIcon width={12} height={12} className="text-red-500" />
                      0.07%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm text-[#898989]">24H volume</h3>
                  <div className="mb-2 flex w-full items-center justify-between text-base text-[#FFFFFF]">
                    <span>$347.2M</span>
                    <span className="flex items-center gap-1">
                      <ChevronUpIcon width={12} height={12} className="text-green-500" />
                      0.07%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm text-[#898989]">24H fees</h3>
                  <div className="mb-2 flex w-full items-center justify-between text-base text-[#FFFFFF]">
                    <span>$347.2M</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold lg:text-2xl">Links</h2>
            <div className="flex w-full flex-col gap-2 rounded-[21px] bg-[#222222] px-6 py-5">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center',
                      'col-span-2 sm:col-span-1 md:col-span-2',
                      'max-w-fit',
                      'md:row-span-full',
                    )}
                  >
                    <Avatar
                      // src={token?.logo}
                      src="/images/logo/chains-logos/arbitrum.svg"
                      className="h-[20px] w-[20px]"
                    />
                    <Avatar
                      // src={token?.logo}
                      src="/images/logo/chains-logos/ethereum.svg"
                      className={cn('h-[20px] w-[20px]', '-ml-1')}
                    />
                  </div>
                  <span className="text-[15px] font-medium">USDC/AETX</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <span>0xD1Fa...0cB7</span>
                    <CopyMinimalIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <ManageSearchIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center',
                      'col-span-2 sm:col-span-1 md:col-span-2',
                      'max-w-fit',
                      'md:row-span-full',
                    )}
                  >
                    <Avatar
                      // src={token?.logo}
                      src="/images/logo/chains-logos/arbitrum.svg"
                      className="h-[20px] w-[20px]"
                    />
                  </div>
                  <span className="text-[15px] font-medium">USDC</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <span>0xD1Fa...0cB7</span>
                    <CopyMinimalIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <ManageSearchIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center',
                      'col-span-2 sm:col-span-1 md:col-span-2',
                      'max-w-fit',
                      'md:row-span-full',
                    )}
                  >
                    <Avatar
                      // src={token?.logo}
                      src="/images/logo/chains-logos/arbitrum.svg"
                      className="h-[20px] w-[20px]"
                    />
                  </div>
                  <span className="text-[15px] font-medium">AETX</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <span>0xD1Fa...0cB7</span>
                    <CopyMinimalIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                  <div className="flex gap-1 rounded-full bg-[linear-gradient(81.4deg,#000000_-15.41%,#1D1D1D_113.98%)] px-3 py-2 text-[10px] font-bold lg:text-sm">
                    <ManageSearchIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* buttons */}
          <div className="flex w-full justify-center gap-2 text-[15px] lg:gap-4">
            <button className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons text-[#E3E3E3] md:px-[14px]">
              <SwapHorizontalIcon className="rotate-90" width={16} height={16} />
              <span>Swap</span>
            </button>
            <button className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary-buttons text-[#E3E3E3] md:px-[14px]">
              <PlusIcon className="rotate-90" width={16} height={16} />
              <span>Add liquidity</span>
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default PoolDetailPage;
