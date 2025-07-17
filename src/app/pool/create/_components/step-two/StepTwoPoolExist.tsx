import PriceRangeBarChart from './PriceRangeBarChart';
import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Charts, chartShowRanges, chartTypes, tabs } from './data';
import { cn } from '@/lib/utils';
import { useSharedStore } from '@/store/store';
import { HandlePriceProps } from '../../_types';
import { get_active_liquidity } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';

const StepTwoPoolExist = ({
  handlePriceInput,
}: {
  handlePriceInput: (props: HandlePriceProps) => void;
}) => {
  const { unAuthenticatedAgent } = useSharedStore();
  const { pools } = useSharedStore();
  const { control, setValue } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1, initialPrice] = useWatch({
    control,
    name: ['token0', 'token1', 'initialPrice'],
  });

  const getChartData = async () => {
    if (!pools || pools.length === 0 || !unAuthenticatedAgent) return;
    console.log({
      is_token0_selected: true,
      pool_id: pools[0].pool_id,
      token0: token0,
      token1: token1,
    });
    const data = await get_active_liquidity(
      {
        is_token0_selected: true,
        pool_id: pools[0].pool_id,
        token0: token0,
        token1: token1,
      },
      unAuthenticatedAgent,
    );
    console.log('Chart data:', data);
    return data;
  };

  useEffect(() => {
    getChartData();
  }, [token0, token1, unAuthenticatedAgent]);

  const [selectedTab, setSelectedTab] = useState<Charts>(tabs[0].value);
  const [selectedChart, setSelectedChart] = useState<string>('usdc');
  const [selectedChartShowRange, setSelectedChartShowRange] =
    useState<(typeof chartShowRanges)[number]['value']>('1d');
  return (
    <>
      {/* tabs */}
      <div className="flex w-full rounded-[10px] bg-[#222222] px-[10px] py-[6px] lg:mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={cn(
              'w-full select-none rounded-md py-[6px] text-sm font-semibold transition-all',
              tab.value === selectedTab ? 'bg-[#1E53B8] text-white' : 'bg-[#222222] text-white/70',
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
          setMaxPrice={(price) => handlePriceInput({ value: price.toString(), minOrMax: 'max' })}
          setMinPrice={(price) =>
            handlePriceInput({
              minOrMax: 'min',
              value: price.toString(),
            })
          }
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
    </>
  );
};

export default StepTwoPoolExist;
