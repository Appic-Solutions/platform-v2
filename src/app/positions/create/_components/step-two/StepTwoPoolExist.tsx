import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSharedStore } from '@/store/store';
import { ActiveTick } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { useWatch } from 'react-hook-form';
import { get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import PriceRangeBarChart, { ChartType } from './PriceRangeBarChart';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import TokenSwitcher from './TokenSwitcher';
import { useGetChartData } from '@/app/positions/_api';
import ChartSkeleton from './ChartSkeleton';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { queryKeys } from '@/lib/constants/query-keys';

const tabs: ChartType[] = [
  { label: 'Full range', value: 'fullRange' },
  { label: 'Custom range', value: 'customRange' },
];

// TODO: handle this position:
// when we are on fullRange and user edit the prices so should switch to custom range

const StepTwoPoolExist = () => {
  const { mutateAsync: getChartData, isPending } = useGetChartData();
  const [chartData, setChartData] = useState<ActiveTick[]>();
  const [selectedTab, setSelectedTab] = useState<ChartType>(tabs[0]);

  const {
    isToken0Selected,
    createPositionForm,
    handleInitialPriceInput,
    maxOrMinPriceHandler,
    existPool,
  } = useCreatePosition();

  const { unAuthenticatedAgent } = useSharedStore();
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);

  const [token0, token1] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1'],
  });

  const initialPrice = useMemo(() => {
    return isToken0Selected && existPool!.token0_price_in_token1
      ? existPool!.token0_price_in_token1
      : existPool!.token1_price_in_token0
        ? existPool!.token1_price_in_token0
        : '0';
  }, [existPool!, isToken0Selected, selectedTab]);

  useEffect(() => {
    if (!unAuthenticatedAgent) return;

    const getChartDataHandler = async () => {
      const data = await getChartData({
        args: {
          is_token0_selected: isToken0Selected,
          pool_id: existPool!.pool_id,
          token0: token0,
          token1: token1,
        },
        unauthenticated_agent: unAuthenticatedAgent,
      });

      if (data && data.success && data.result) {
        setChartData(data.result);
        maxOrMinPriceHandler({ minValue: 'min', maxValue: 'max' });
        handleInitialPriceInput(initialPrice);
      }
    };

    getChartDataHandler();
  }, [unAuthenticatedAgent, isToken0Selected]);

  useEffect(() => {
    console.log('<============== sqrtPrice update every 30 seconds ================>');
    createPositionForm.setValue('sqrtPriceX96', existPool!.sqrt_price_x96);
  }, [existPool!]);

  useEffect(() => {
    if (!existPool!.sqrt_price_x96) return;
    maxOrMinPriceHandler({ minValue: 'min', maxValue: 'max' });
  }, []);

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
    maxOrMinPriceHandler({ minValue: 'min', maxValue: 'max' });
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
      <div className="flex w-full rounded-[10px] bg-[#222222] px-[10px] py-[6px] lg:mb-4">
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

      <div className="chart-background mb-12 flex w-full flex-col gap-6 lg:mb-0 lg:gap-6">
        <div className="flex flex-col items-start justify-between gap-2 px-4 py-2 lg:flex-row-reverse lg:items-center">
          <TokenSwitcher onButtonClick={resetToFullRange} />

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
        {isPending ? (
          <ChartSkeleton />
        ) : chartData ? (
          <PriceRangeBarChart
            resetToFullRange={resetToFullRange}
            initialPrice={initialPrice}
            chartData={chartData}
            selectedTab={selectedTab}
          />
        ) : (
          'Failed to load chart data. please try again'
        )}
      </div>
    </>
  );
};

export default StepTwoPoolExist;
