'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Dispatch, SetStateAction } from 'react';
import { PriceChartDataType } from './chart-section';

export function PriceChart({
  chartData,
  setHovered,
}: {
  chartData: PriceChartDataType[];
  setHovered: Dispatch<SetStateAction<number>>;
}) {
  return (
    <ResponsiveContainer
      height={360}
      width="100%"
      className={cn(
        'relative isolate',
        'before:absolute before:h-1/2 before:w-full',
        'before:bottom-[36px] before:left-1.5 before:w-[calc(100%-72px)]',
        'before:bg-gradient-to-t before:from-[#11326f41] before:to-[#205fd500]',
      )}
    >
      <LineChart data={chartData}>
        <CartesianGrid className="stroke-white/10" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickCount={9} orientation="right" strokeWidth={0} fontSize={12} />
        <Tooltip
          content={<CustomTooltip setHovered={setHovered} />}
          cursor={{ stroke: '#2160D5', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="token0_in_token1"
          stroke="#2160D5"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({
  active,
  payload,
  setHovered,
}: TooltipProps<ValueType, NameType> & {
  setHovered: Dispatch<SetStateAction<number>>;
}) => {
  if (active && payload && payload.length) {
    const value = Number(payload[0].value);
    setHovered(value);
  }
  return null;
};
