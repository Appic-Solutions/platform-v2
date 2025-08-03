'use client';

import { Bar, BarChart, ResponsiveContainer, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface LiquidityChartProps {
  token0Daily?: string[];
  token0Weekly?: string[];
  token0Monthly?: string[];
  token0Yearly?: string[];
  token1Daily?: string[];
  token1Weekly?: string[];
  token1Monthly?: string[];
  token1Yearly?: string[];
  token0Name?: string;
  token1Name?: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const CustomCursor = ({ x, y, width, height }: any) => {
  return (
    <rect x={x} y={y} width={width} height={height} fill="rgba(255,255,255,0.05)" rx={4} ry={4} />
  );
};

const generateChartData = (token0: string[] = [], token1: string[] = []) => {
  const token0Data = token0.map((item, idx) => ({
    id: idx * 2,
    index: idx,
    value: Number(item),
    type: 'token-0',
  }));

  const token1Data = token1.map((item, idx) => ({
    id: idx * 2 + 1,
    index: idx,
    value: Number(item),
    type: 'token-1',
  }));

  return [...token0Data, ...token1Data];
};

const chartConfig = {
  value: {
    label: 'Liquidity',
    color: '#2160D5',
  },
} satisfies ChartConfig;

export default function LiquidityChart({
  token0Daily,
  token0Weekly,
  token0Monthly,
  token0Yearly,
  token1Daily,
  token1Weekly,
  token1Monthly,
  token1Yearly,
  timeframe,
  token0Name,
  token1Name,
}: LiquidityChartProps) {
  let token0: string[] = [];
  let token1: string[] = [];

  switch (timeframe) {
    case 'daily':
      token0 = token0Daily ?? [];
      token1 = token1Daily ?? [];
      break;
    case 'weekly':
      token0 = token0Weekly ?? [];
      token1 = token1Weekly ?? [];
      break;
    case 'monthly':
      token0 = token0Monthly ?? [];
      token1 = token1Monthly ?? [];
      break;
    case 'yearly':
      token0 = token0Yearly ?? [];
      token1 = token1Yearly ?? [];
      break;
  }

  const combinedData = generateChartData(token0, token1);

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={combinedData} barCategoryGap={0} margin={{ top: 12, bottom: 12 }}>
          <ChartTooltip
            cursor={<CustomCursor />}
            content={({ active, payload }: any) => {
              if (!active || !payload || !payload.length) return null;
              const item = payload[0].payload;
              const tokenName = item.type === 'token-0' ? token0Name : token1Name;
              return (
                <div
                  className={cn(
                    'flex flex-col justify-center gap-2',
                    'rounded-[13px] border-2 border-[#393939]/30 backdrop-blur-[30px]',
                    'bg-gradient-to-b from-[#242424] to-[#212121]/30',
                    'px-3 py-2',
                    'text-xs text-white',
                  )}
                >
                  {`${tokenName} Liquidity : ${Number(item.value).toFixed(2).toLocaleString()}$`}
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={3}>
            {combinedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.type === 'token-0' ? '#3b82f6' : '#BD296B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
