export enum PoolDetailChartTypes {
  Volume = 'volume',
  Liquidity = 'liquidity',
  Price = 'price',
}

export const chartShowRanges: { label: string; value: string }[] = [
  {
    label: '1H',
    value: '1h',
  },
  {
    label: '1D',
    value: '1d',
  },
  {
    label: '1W',
    value: '1w',
  },
  {
    label: '1M',
    value: '1m',
  },
  {
    label: '1Y',
    value: '1y',
  },
] as const;
