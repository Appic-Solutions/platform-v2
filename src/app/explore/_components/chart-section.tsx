'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  PoolHistory,
  Price,
  TimeVolumeFee,
} from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { VolumeChart } from './volume-chart';
import { PriceChart } from './price-chart';
import { formatInTimeZone } from 'date-fns-tz';

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Metric = 'volume' | 'price';

const TIME_FRAME_OPTIONS: { label: string; value: Timeframe }[] = [
  { label: '1D', value: 'daily' },
  { label: '1W', value: 'weekly' },
  { label: '1M', value: 'monthly' },
  { label: '1Y', value: 'yearly' },
];

export const TimeFrameLimitMap = new Map<
  Timeframe,
  { limitCount: number; dateFormat: string; xTickCount: number }
>()
  .set('daily', { limitCount: 24, dateFormat: 'HH:mm a', xTickCount: 6 })
  .set('weekly', { limitCount: 7, dateFormat: 'EEE', xTickCount: 7 })
  .set('monthly', { limitCount: 30, dateFormat: 'd MMM', xTickCount: 6 })
  .set('yearly', { limitCount: 12, dateFormat: 'MMM yyyy', xTickCount: 6 });

type ChartInput = { type: 'price'; values: Price[] } | { type: 'volume'; values: TimeVolumeFee[] };

export type VolumeChartDataType = {
  date: string;
  value: number;
  fees: number;
};

export type PriceChartDataType = {
  date: string;
  token0_in_token1: number;
  token1_in_token0: number;
};

export const formatDate = (
  input: ChartInput,
  timeframe: Timeframe,
): Array<PriceChartDataType | VolumeChartDataType> => {
  const config = TimeFrameLimitMap.get(timeframe);
  if (!config) return [];

  const recentValues = input.values.slice(-config.limitCount);

  return recentValues.map((item) => {
    const date = new Date(Number(item.timestamp) * 1000);
    const formattedDate = formatInTimeZone(date, 'UTC', config.dateFormat);

    if (input.type === 'price') {
      const priceItem = item as Price;
      return {
        date: formattedDate,
        token0_in_token1: Number(Number(priceItem.token0_in_token1).toFixed(8)),
        token1_in_token0: Number(Number(priceItem.token1_in_token0).toFixed(8)),
      };
    }

    const volumeItem = item as TimeVolumeFee;
    return {
      date: formattedDate,
      value: Number(Number(volumeItem.volume).toFixed(2)),
      fees: Number(Number(volumeItem.fees).toFixed(2)),
    };
  });
};

export default function ChartSection({
  data,
  priceSwap,
}: {
  data: PoolHistory | undefined;
  priceSwap: boolean;
}) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [metric, setMetric] = useState<Metric>('volume');

  const volumeData = useMemo(
    () => ({
      daily: data?.hourly_volume_fee_usd ?? [],
      weekly: data?.daily_volume_fee_usd ?? [],
      monthly: data?.daily_volume_fee_usd ?? [],
      yearly: data?.monthly_volume_fee_usd ?? [],
    }),
    [data],
  );

  const priceData = useMemo(() => {
    const mapPrice = (arr: Price[] = []) =>
      arr.map((item) => ({
        timestamp: item.timestamp,
        token0_in_token1: priceSwap ? item.token1_in_token0 : item.token0_in_token1,
        token1_in_token0: priceSwap ? item.token0_in_token1 : item.token1_in_token0,
      }));

    return {
      daily: mapPrice(data?.hourly_price_token0_in_token1),
      weekly: mapPrice(data?.daily_price_token0_in_token1),
      monthly: mapPrice(data?.daily_price_token0_in_token1),
      yearly: mapPrice(data?.monthly_price_token0_in_token1),
    };
  }, [data, priceSwap]);

  const volumeChartData = formatDate({ type: 'volume', values: volumeData[timeframe] }, timeframe);
  const priceChartData = formatDate({ type: 'price', values: priceData[timeframe] }, timeframe);

  const [volumeHovered, setVolumeHovered] = useState<number>(
    Number(volumeData[timeframe].at(-1)?.volume || 0),
  );
  const [priceHovered, setPriceHovered] = useState<number>(
    Number(priceData[timeframe].at(-1)?.token0_in_token1 || 0),
  );

  useEffect(() => {
    setPriceHovered(Number(priceData[timeframe].at(-1)?.token0_in_token1 || 0));
  }, [priceSwap]);

  return (
    <>
      <p className="text-2xl font-semibold text-white md:text-3xl">
        {metric === 'volume' ? (
          <>$ {volumeHovered.toFixed(2)}</>
        ) : (
          <>
            1 {priceSwap ? data?.token1.symbol : data?.token0.symbol} = {priceHovered.toFixed(5)}{' '}
            {priceSwap ? data?.token0.symbol : data?.token1.symbol}
          </>
        )}
      </p>

      <div className="flex w-full flex-col justify-between gap-y-8">
        {metric === 'volume' ? (
          <VolumeChart
            chartData={volumeChartData as VolumeChartDataType[]}
            setHovered={setVolumeHovered}
          />
        ) : (
          <PriceChart
            chartData={priceChartData as PriceChartDataType[]}
            setHovered={setPriceHovered}
          />
        )}

        <div className="flex items-center justify-between gap-4">
          <Select defaultValue={metric} onValueChange={(value: Metric) => setMetric(value)}>
            <SelectTrigger className="max-w-fit gap-x-2 border-none bg-[#565656] text-[#E3E3E3] outline-none ring-0">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="max-w-fit gap-x-2 border-none bg-[#565656] text-[#E3E3E3] outline-none ring-0">
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          <div
            className={cn(
              'flex items-center gap-2.5',
              '*:h-8 *:w-8 *:rounded-full',
              '*:flex *:items-center *:justify-center',
              '*:cursor-pointer *:text-center *:text-xs',
            )}
          >
            {TIME_FRAME_OPTIONS.map((item) => (
              <span
                key={item.value}
                onClick={() => setTimeframe(item.value)}
                className={cn(
                  item.value === timeframe
                    ? 'border border-[#e9ddf9] bg-white/70 font-semibold text-[#0A0A0B]'
                    : 'bg-[#565656] text-white/70',
                )}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
