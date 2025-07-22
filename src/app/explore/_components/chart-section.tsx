'use client';

import { useState } from 'react';
import { PoolHistory } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarProps,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Metric = 'volume' | 'price' | 'liquidity';

interface ChartDataItem {
  time: string;
  volume: number;
  price: number;
  liquidityToken0: number;
  liquidityToken1: number;
}

function transformData(raw: PoolHistory | undefined, timeframe: Timeframe): ChartDataItem[] {
  if (!raw) return [];
  const getArray = (key: string) => {
    const value = raw[`${timeframe}_${key}` as keyof PoolHistory] as string[];
    return Array.isArray(value) ? value : [];
  };

  const prices = getArray('price_token0_in_token1');
  const volumes = getArray('volume_usd');
  const fees = getArray('generated_fees_usd');

  const token0Price = parseFloat(raw?.token0?.usdPrice || '1');
  const token1Price = parseFloat(raw?.token1?.usdPrice || '1');
  const totalPrice = token0Price + token1Price || 1;

  const length = Math.max(volumes.length, prices.length, fees.length);

  return Array.from({ length }).map((_, i) => {
    const liquidity = parseFloat(fees[i] || '0');
    return {
      time: `${i + 1}`,
      volume: parseFloat(volumes[i] || '0'),
      price: parseFloat(prices[i] || '0'),
      liquidityToken0: (liquidity * token0Price) / totalPrice,
      liquidityToken1: (liquidity * token1Price) / totalPrice,
    };
  });
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-700 bg-gray-900 bg-gradient-to-tr from-[#242424] to-[#2121214d] p-2 text-white">
        <p className="mb-1 text-xs">{`Time: ${label}`}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={`tooltip-item-${idx}`} style={{ color: entry.color }}>
            {`${entry.name}: ${parseFloat(entry.value).toFixed(8)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function ChartSection({ data }: { data: PoolHistory | undefined }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [metric, setMetric] = useState<Metric>('volume');

  const TIME_FRAME_OPTIONS: { label: string; value: Timeframe }[] = [
    { label: '1D', value: 'daily' },
    { label: '1W', value: 'weekly' },
    { label: '1M', value: 'monthly' },
    { label: '1Y', value: 'yearly' },
  ];

  const chartData = transformData(data, timeframe);

  const renderChart = () => {
    switch (metric) {
      case 'volume':
        return <Bar dataKey="volume" fill="#2160D5" name="Volume" yAxisId="right" />;
      case 'price':
        return (
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2160D5"
            strokeWidth={4}
            yAxisId="right"
            name="Price"
            radius={8}
          />
        );
      case 'liquidity':
        return (
          <>
            <Bar
              dataKey="liquidityToken0"
              stackId="liquidity"
              fill="#2160D5"
              name={data?.token0?.symbol || 'Token0'}
              yAxisId="right"
            />
            <Bar
              dataKey="liquidityToken1"
              stackId="liquidity"
              fill="#BD296B"
              name={data?.token1?.symbol || 'Token1'}
              yAxisId="right"
            />
          </>
        );
    }
  };

  return (
    <div className="flex w-full flex-col justify-between gap-y-8">
      {/* Chart */}
      <div style={{ width: '100%', height: 453 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            {metric !== 'liquidity' && <CartesianGrid stroke="#ffffff14" strokeDasharray="1" />}
            <XAxis
              dataKey="time"
              tick={{ fill: '#ffffffb5' }}
              tickFormatter={(time) => {
                return time;
              }}
              stroke="#ffffffb5"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ffffffb5"
              tick={{ fill: '#ffffffb5' }}
              width={70}
              tickFormatter={(val) => `$${val.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {renderChart()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Selectors */}
      <div className="flex items-center justify-between gap-4">
        <Select defaultValue={metric} onValueChange={(value: Metric) => setMetric(value)}>
          <SelectTrigger className="max-w-fit gap-x-2 border-none bg-[#565656] text-[#E3E3E3] outline-none ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="max-w-fit gap-x-2 border-none bg-[#565656] text-[#E3E3E3] outline-none ring-0">
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="liquidity">Liquidity</SelectItem>
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
          {TIME_FRAME_OPTIONS.map((item, idx) => (
            <span
              key={idx}
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
  );
}
