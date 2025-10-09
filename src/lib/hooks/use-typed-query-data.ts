import { useQueryClient } from '@tanstack/react-query';
import { QueryKey, QueryReturnTypes } from '../constants/query-keys';

export function useTypedQueryData<K extends QueryKey>(key: K): QueryReturnTypes[K] | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData([key]) as QueryReturnTypes[K] | undefined;
}
