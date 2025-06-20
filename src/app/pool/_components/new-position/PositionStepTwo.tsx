import React, { useState } from 'react';
import AvatarGroup from './AvatarGroup';
import PriceRangeBarChart from './PriceRangeBarChart';
import { cn } from '@/lib/utils';
import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import Image from 'next/image';
import ChartDataBox from './ChartDataBox';
import { Charts, chartShowRanges, chartTypes, tabs } from './data';

const PositionStepTwo = () => {
  const [selectedTab, setSelectedTab] = useState<Charts>(tabs[0].value);
  const [selectedChart, setSelectedChart] = useState<string>('usdc');
  const [selectedChartShowRange, setSelectedChartShowRange] =
    useState<(typeof chartShowRanges)[number]['value']>('1d');
  const [minPrice, setMinPrice] = useState(1100);
  const [maxPrice, setMaxPrice] = useState(1600);

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
        {/* tabs */}
        <div className="flex w-full rounded-[10px] bg-[#222222] px-[10px] py-[6px] lg:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={cn(
                'w-full select-none rounded-md py-[6px] text-sm font-semibold transition-all',
                tab.value === selectedTab
                  ? 'bg-[#1E53B8] text-white'
                  : 'bg-[#222222] text-white/70',
              )}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* chart */}
        <div className="chart-background flex w-full flex-col gap-6 lg:gap-16">
          <div className="flex flex-col items-start justify-between gap-2 px-4 py-2 lg:flex-row-reverse lg:items-center">
            <div className="flex rounded-[10px] bg-[#222222] px-[4px] py-[2px]">
              {chartTypes.map((chart) => (
                <button
                  key={chart.value}
                  className={cn(
                    'flex w-full items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                    chart.value === selectedChart
                      ? 'bg-[#1E53B8] text-white'
                      : 'bg-[#222222] text-white/70',
                  )}
                  onClick={() => setSelectedChart(chart.value)}
                >
                  <Image src={chart.icon} alt="" width={17} height={17} />
                  {chart.label}
                </button>
              ))}
            </div>
            <div className="text-[14px] font-bold">
              <span className="text-[#9F9F9F]">Market price:</span>
              <span className="ml-1">1,827.91 USDC = 1</span>
              <p className="text-[#9F9F9F]">ETH($1,827.91)</p>
            </div>
          </div>
          <PriceRangeBarChart
            setMaxPrice={(price) => setMaxPrice(price)}
            setMinPrice={(price) => setMinPrice(price)}
            selectedTab={selectedTab}
          />
        </div>
        {/* gap */}
        <div className="flex-1" />
        {/* chart controls */}
        <div className="flex w-full flex-col items-start justify-start gap-4 lg:flex-row-reverse lg:items-center lg:justify-between">
          <div className="flex items-center justify-end gap-[10px]">
            {chartShowRanges.map((chartRange) => (
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
            ))}
          </div>
          <div className="flex items-center justify-start gap-[10px]">
            <button className="flex h-[36px] w-[81px] items-center justify-center gap-2 rounded-[10px] bg-[#565656]">
              <RefreshIcon className="h-3 w-3" strokeWidth={0} />
              Reset
            </button>
            <button className="flex h-[36px] w-[40px] items-center justify-center rounded-[10px] bg-[#565656]">
              <ZoomInIcon />
            </button>
            <button className="flex h-[36px] w-[40px] items-center justify-center rounded-[10px] bg-[#565656]">
              <ZoomOutIcon />
            </button>
          </div>
        </div>
      </div>
      {/* boxes */}
      <div className="flex h-full w-full select-none flex-col gap-10 text-white lg:w-[41%]">
        <div>
          <h3 className="mb-4 text-xl font-bold lg:text-2xl">Set Price range</h3>
          <div className="flex justify-start gap-4 lg:justify-between">
            <ChartDataBox label="Min price" price={minPrice} underPriceText="USDC = 1 ETH" />
            <ChartDataBox label="Max price" price={maxPrice} underPriceText="USDC = 1 ETH" />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-2xl font-bold">Deposit tokens</h3>
          <p className="mb-4 text-[15px] font-normal">
            The amount earned providing liquidity. Choose an amount that suits your risk tolerance
            and strategy.
          </p>
          <div className="flex justify-start gap-4 lg:justify-between">
            <ChartDataBox label="Min price" price={minPrice} underPriceText="USDC = 1 ETH" />
            <ChartDataBox label="Max price" price={maxPrice} underPriceText="USDC = 1 ETH" />
          </div>
        </div>
        <button className="h-[50px] rounded-[15px] bg-primary-buttons lg:h-[66px]">Review</button>
      </div>
    </div>
  );
};

export default PositionStepTwo;
