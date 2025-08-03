'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { VolumeChartDataType } from './chart-section';

export function VolumeChart({
  chartData,
  setHovered,
}: {
  chartData: VolumeChartDataType[];
  setHovered: Dispatch<SetStateAction<number>>;
}) {
  return (
    <ResponsiveContainer height={360} width="100%">
      <BarChart data={chartData} barGap={4}>
        <CartesianGrid vertical={false} className="stroke-white/10" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis orientation="right" strokeWidth={0} fontSize={12} tickCount={9} />
        <Tooltip
          content={<CustomTooltip setHovered={setHovered} />}
          cursor={{ fill: 'rgb(33, 96, 213, 0.1)', radius: 16 }}
        />
        <Bar dataKey="value" fill="#2160D5" radius={[16, 16, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
  setHovered,
}: TooltipProps<ValueType, NameType> & {
  setHovered: Dispatch<SetStateAction<number>>;
}) => {
  if (active && payload && payload.length) {
    const { value, payload: fullData } = payload[0] ?? {};
    setHovered(Number(value));

    return (
      <div
        className={cn(
          'rounded-xl border border-[#393939]/30',
          'bg-gradient-to-b from-[#242424] to-[#212121]/30',
          'px-3 py-2 text-xs text-white',
          'flex flex-col gap-1',
        )}
      >
        <div className="font-medium">{label}</div>
        <div>💸 Fees: {Number(fullData?.fees).toFixed(2)}$</div>
      </div>
    );
  }
  return null;
};
