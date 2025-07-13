import { useSharedStore } from '@/store/store';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export default function ExplorePageLogic() {
  const { dexData } = useSharedStore();

  const methods = useForm({
    defaultValues: {
      search: '',
    },
  });

  const search = useWatch({ control: methods.control, name: 'search' });

  const stats = useMemo(() => {
    if (!dexData) return [];

    const format = (n: string) =>
      Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Number(n));

    return [
      {
        volume: '1D Volume',
        value: format(dexData.swap_volume_1d_usd),
      },
      {
        volume: '1M Volume',
        value: format(dexData.swap_volume_1m_usd),
      },
      {
        volume: '1Y Volume',
        value: format(dexData.swap_volume_1y_usd),
      },
      {
        volume: 'TVL',
        value: format(dexData.total_tvl_usd),
      },
      {
        volume: 'Pools',
        value: dexData.poolHistories?.length.toString() || '0',
      },
    ];
  }, [dexData]);

  const filteredPools = useMemo(() => {
    if (!dexData?.poolHistories) return [];

    return dexData.poolHistories.filter((pool) => {
      const token0 = pool.token0.symbol?.toLowerCase() || '';
      const token1 = pool.token1.symbol?.toLowerCase() || '';
      return token0.includes(search.toLowerCase()) || token1.includes(search.toLowerCase());
    });
  }, [dexData?.poolHistories, search]);

  return {
    methods,
    stats,
    filteredPools,
    isLoading: !dexData,
  };
}
