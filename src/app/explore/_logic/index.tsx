import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { useSharedStore } from '@/store/store';
import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

export default function ExplorePageLogic() {
  const { dexData } = useSharedStore();

  const [sortCriteria, setSortCriteria] = useState<
    { field: 'tvl' | 'apr'; direction: 'asc' | 'desc' }[]
  >([]);
  const [detailData, setDetailData] = useState<CandidPoolId | undefined>(undefined);

  const methods = useForm({ defaultValues: { search: '' } });
  const search = useWatch({ control: methods.control, name: 'search' });

  const stats = useMemo(() => {
    if (!dexData) return [];

    const format = (n: string) =>
      Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Number(n));

    return [
      { volume: '1D Volume', value: format(dexData.swap_volume_1d_usd) },
      { volume: '1M Volume', value: format(dexData.swap_volume_1m_usd) },
      { volume: '1Y Volume', value: format(dexData.swap_volume_1y_usd) },
      { volume: 'TVL', value: format(dexData.total_tvl_usd) },
      { volume: 'Pools', value: dexData.poolHistories?.length.toString() || '0' },
    ];
  }, [dexData]);

  const filteredPools = useMemo(() => {
    if (!dexData?.poolHistories) return [];

    let result = dexData.poolHistories.filter((pool) => {
      const token0 = pool.token0.symbol?.toLowerCase() || '';
      const token1 = pool.token1.symbol?.toLowerCase() || '';
      return token0.includes(search.toLowerCase()) || token1.includes(search.toLowerCase());
    });

    if (sortCriteria.length > 0) {
      result = result.sort((a, b) => {
        for (const { field, direction } of sortCriteria) {
          const aValue = field === 'tvl' ? Number(a.pool.tvl_usd) : Number(a.apr || 0);
          const bValue = field === 'tvl' ? Number(b.pool.tvl_usd) : Number(b.apr || 0);

          if (aValue !== bValue) {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
        }
        return 0;
      });
    }

    return result;
  }, [dexData?.poolHistories, search, sortCriteria]);

  const handleSort = (field: 'tvl' | 'apr') => {
    setSortCriteria((prev) => {
      const existing = prev.find((s) => s.field === field);
      if (existing) {
        return prev.map((s) =>
          s.field === field ? { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' } : s,
        );
      } else {
        return [...prev, { field, direction: 'desc' }];
      }
    });
  };

  return {
    methods,
    stats,
    filteredPools,
    isLoading: !dexData,
    handleSort,
    sortCriteria,
    detailData,
    setDetailData,
  };
}
