'use client';

import { Dot, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A line chart with dots and colors';

const chartData = [
  { key: '9:31 AM', value: 91100 },
  { key: '3:31 PM', value: 91150 },
  { key: '9:31 PM', value: 91110 },
  { key: 'Apr 24', value: 91160 },
  { key: '7:31 AM', value: 91130 },
];

const chartConfig = {
  value: {
    label: 'Value',
    color: '#2060D5',
  },
} satisfies ChartConfig;

const PositionDetailChart = () => {
  return (
    <div className="relative mb-12 w-[85%] sm:w-full">
      <div className="absolute bottom-0 left-0 right-0 h-1/2 w-full bg-gradient-to-t from-[#11326f41] to-[#205fd500]"></div>
      <ChartContainer className="h-full min-h-[370px] w-full" config={chartConfig}>
        <LineChart
          className="chart-background position-detail-chart"
          accessibilityLayer
          data={chartData}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" nameKey="key" hideLabel />}
          />

          <XAxis
            dataKey="key"
            stroke="#FFFFFFB5"
            axisLine={false}
            tickLine={false}
            tickMargin={40}
          />
          <Line
            className="bg-blue-500"
            dataKey="value"
            type="bump"
            stroke="#2060D5"
            strokeWidth={4}
            dot={({ payload, ...props }) => {
              return (
                <Dot
                  key={payload.browser}
                  r={5}
                  cx={props.cx}
                  cy={props.cy}
                  fill="#2060D5"
                  stroke={payload.fill}
                />
              );
            }}
          />
          <YAxis
            stroke="#FFFFFFB5"
            tickLine={false}
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            orientation="right"
            tickMargin={60}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default PositionDetailChart;
