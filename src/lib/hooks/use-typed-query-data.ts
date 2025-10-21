import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { QueryKey, QueryReturnTypes } from '../constants/query-keys';

export function useTypedQueryData<K extends QueryKey>(key: K) {
  const queryClient = useQueryClient();
  const [data, setData] = useState<QueryReturnTypes[K] | undefined>(() =>
    queryClient.getQueryData([key]),
  );

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === key) {
        setData(queryClient.getQueryData([key]));
      }
    });
    return unsubscribe;
  }, [queryClient, key]);

  return data;
}
