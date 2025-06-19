export type Charts = 'customRange' | 'fullRange';

export const tabs: { label: string; value: Charts }[] = [
  { label: 'Full range', value: 'fullRange' },
  { label: 'Custom range', value: 'customRange' },
];

export const chartTypes: { label: string; icon: string; value: string }[] = [
  {
    label: 'USDC',
    value: 'usdc',
    icon: '/images/logo/chains-logos/ethereum.svg',
  },
  {
    label: 'ETH',
    value: 'eth',
    icon: '/images/logo/chains-logos/ethereum.svg',
  },
];

export const chartShowRanges: { label: string; value: string }[] = [
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
  {
    label: 'All time',
    value: 'all',
  },
] as const;
