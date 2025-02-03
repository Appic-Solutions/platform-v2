import React from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { TokenType } from '@/app/bridge/_store';
import { WalletBalance } from './wallet-pop';
import { Pie, PieChart } from 'recharts';
import { getStorageItem } from '@/common/helpers/localstorage';

const lightColorsPalette = [
  '#F15A24',
  '#ED1E79',
  '#592784',
  '#3B00B9', // Original colors
  '#FBB03B',
  '#932380',
];

const darkColorsPalette = [
  '#F15A24',
  '#ED1E79',
  '#592784',
  '#3B00B9', // Original colors
  '#FBB03B',
  '#932380',
];

const WalletChart = ({ balance }: { balance: WalletBalance }) => {
  const selectedPalette = getStorageItem('theme');
  const colorPalette = selectedPalette === 'dark' ? lightColorsPalette : darkColorsPalette;

  const getColorFromPalette = (index: number): string => colorPalette[index % colorPalette.length];

  const chartData =
    balance?.tokens.map((token: TokenType, index: number) => ({
      name: token.symbol,
      value: Number(token.usdBalance),
      fill: getColorFromPalette(index),
    })) || [];

  const chartConfig: ChartConfig =
    balance?.tokens.reduce(
      (acc, token, index) => ({
        ...acc,
        [token.symbol || '']: {
          label: token.name,
          color: getColorFromPalette(index),
        },
      }),
      {} as ChartConfig,
    ) || {};
  return (
    <div>
      <ChartContainer config={chartConfig} className="relative mx-auto aspect-square max-h-56">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-white" />} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default WalletChart;
