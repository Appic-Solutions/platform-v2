import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { ActiveTick } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { ScaleLinear } from 'd3-scale';

const NORMALIZATION_FACTOR = 1e35;

interface ChartContainerProps {
  chartData: ActiveTick[];
  chartWidth: number;
  xScale: ScaleLinear<number, number>;
}

export default function ChartContainer({ chartData, chartWidth, xScale }: ChartContainerProps) {
  const normalizedChartData = chartData.map((tick) => ({
    ...tick,
    normalizedPrice: parseFloat(tick.price) / NORMALIZATION_FACTOR,
    liquidity_gross: parseFloat(tick.liquidity_gross),
  }));

  return (
    chartWidth > 0 && (
      <ResponsiveContainer height={250}>
        <BarChart data={normalizedChartData}>
          <Bar
            dataKey="liquidity_gross"
            isAnimationActive={true}
            fill="#3b82f6"
            shape={(props: any) => {
              const { payload, y, height } = props;
              const normalizedPrice = payload.normalizedPrice;
              const xPosition = xScale(normalizedPrice);
              if (xPosition === undefined || isNaN(xPosition)) {
                return <g />;
              }
              return (
                <rect
                  x={xPosition - 1} // width of the bar = 2px
                  y={y}
                  width={2}
                  height={height}
                  fill="#3b82f6"
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  );
}
