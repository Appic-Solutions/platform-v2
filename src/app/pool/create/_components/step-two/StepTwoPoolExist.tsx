import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import Image from 'next/image';
import { act, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSharedStore } from '@/store/store';
import { HandlePriceProps } from '../../_types';
import {
  ActiveTick,
  get_active_liquidity,
} from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import PriceRangeBarChart, { ChartType } from './PriceRangeBarChart';

const tabs: ChartType[] = [
  { label: 'Full range', value: 'fullRange' },
  { label: 'Custom range', value: 'customRange' },
];

const StepTwoPoolExist = ({
  handlePriceInput,
  isToken0Selected,
  handleSelectedTokenChange,
  matchedPool,
}: {
  handlePriceInput: (props: HandlePriceProps) => void;
  isToken0Selected: boolean;
  handleSelectedTokenChange: () => void;
  matchedPool: Pool;
}) => {
  const [selectedTab, setSelectedTab] = useState<ChartType>(tabs[0]);
  const { unAuthenticatedAgent } = useSharedStore();
  const { icpTokens } = useSharedStore();

  const { control, setValue } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1] = useWatch({
    control,
    name: ['token0', 'token1'],
  });
  const [chartData, setChartData] = useState<ActiveTick[]>();

  const initialPrice = useMemo(() => {
    return isToken0Selected && matchedPool.token0_price_in_token1
      ? matchedPool.token0_price_in_token1
      : matchedPool.token1_price_in_token0
        ? matchedPool.token1_price_in_token0
        : '0';
  }, [matchedPool, isToken0Selected, selectedTab]);

  useEffect(() => {
    const getChartData = async () => {
      if (!unAuthenticatedAgent) return;
      const data = await get_active_liquidity(
        {
          is_token0_selected: true,
          pool_id: matchedPool.pool_id,
          token0: token0,
          token1: token1,
        },
        unAuthenticatedAgent,
      );

      if (!data) return;

      setChartData(data.result);
    };
    getChartData();
    setValue('initialPrice', initialPrice);
  }, [token0, token1, unAuthenticatedAgent]);

  const marketPrice = useMemo(() => {
    if (!token0 || !token1 || !icpTokens) return 'Market price unavailable';
    return get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0,
        token1,
        price: initialPrice,
      },
      icpTokens,
    ).text;
  }, [token0, token1, isToken0Selected, icpTokens]);

  const resetToFullRange = () => {
    handlePriceInput({ value: '0', minOrMax: 'min' });
    handlePriceInput({ value: '0', minOrMax: 'max' });
    setSelectedTab(tabs[0]);
  };

  const handleSelectPositionRangeType = (tab: ChartType) => {
    if (tab.value === 'fullRange') {
      resetToFullRange();
    } else {
      setSelectedTab(tabs[1]);
    }
  };

  return (
    <>
      {/* tabs */}
      <div className="flex w-full rounded-[10px] bg-[#222222] px-[10px] py-[6px] lg:mb-6">
        {/* TODO: Handle tab selection, change prices when custom range selected and when full range selected */}
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.value}
            className={cn(
              'w-full select-none rounded-md py-[6px] text-sm font-semibold transition-all',
              tab.value === selectedTab.value
                ? 'bg-[#1E53B8] text-white'
                : 'bg-[#222222] text-white/70',
            )}
            onClick={() => handleSelectPositionRangeType(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* chart */}
      <div className="chart-background mb-28 flex w-full flex-col gap-6 lg:mb-0 lg:gap-16">
        <div className="flex flex-col items-start justify-between gap-2 px-4 py-2 lg:flex-row-reverse lg:items-center">
          {/* token0 & token1 switcher */}
          <div className="flex rounded-[10px] bg-[#222222] px-[4px] py-[2px]">
            {[token0, token1].map(
              (t, idx) =>
                t && (
                  <button
                    type="button"
                    key={idx}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                      (isToken0Selected && idx === 0) || (!isToken0Selected && idx === 1)
                        ? 'bg-[#1E53B8] text-white'
                        : 'bg-[#222222] text-white/70',
                    )}
                    onClick={() => handleSelectedTokenChange()}
                    disabled={!t}
                  >
                    <Image
                      src={t.logo}
                      alt={t.symbol}
                      width={17}
                      height={17}
                      className="rounded-full"
                    />
                    {t.symbol}
                  </button>
                ),
            )}
          </div>
          {/* market price */}
          <div className="text-[14px] font-bold">
            <span className="text-[#9F9F9F]">Market price:</span>
            <span className="ml-1">{marketPrice}</span>
            <p className="text-[#9F9F9F]">
              {isToken0Selected ? token0.symbol : token1.symbol}($
              {Number(isToken0Selected ? token0.usdPrice : token1.usdPrice).toFixed(2)})
            </p>
          </div>
        </div>
        {chartData && (
          <PriceRangeBarChart
            resetToFullRange={resetToFullRange}
            initialPrice={initialPrice}
            chartData={chartData}
            setMaxPrice={(price) => handlePriceInput({ value: price.toString(), minOrMax: 'max' })}
            setMinPrice={(price) =>
              handlePriceInput({
                minOrMax: 'min',
                value: price.toString(),
              })
            }
            selectedTab={selectedTab}
          />
        )}
      </div>
    </>
  );
};

export default StepTwoPoolExist;
