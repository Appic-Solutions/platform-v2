import { useSharedStore } from '@/store/store';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { get_transaction_history } from '@/blockchain_api/functions/icp/history';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { queryKeys } from '@/lib/constants/query-keys';
import { get_top_evm_tokens } from '@/blockchain_api/functions/evm/get_top_evm_tokens';

export default function useLogic() {
  const { unAuthenticatedAgent, icpIdentity, evmAddress } = useSharedStore();
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);
  const bridgePairs = useTypedQueryData(queryKeys.bridgePairs);

  const { data: topEvmTokensData } = useQuery({
    queryKey: [queryKeys.topEvmTokens],
    queryFn: () => get_top_evm_tokens(unAuthenticatedAgent!),
    enabled: !!unAuthenticatedAgent,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bridge-dex-history', icpIdentity, evmAddress],
    queryFn: async () =>
      get_transaction_history(
        evmAddress,
        icpIdentity,
        bridgePairs as (EvmToken | IcpToken)[],
        icpTokens as IcpToken[],
        (topEvmTokensData?.result as EvmToken[]) || [],
      ),
    refetchInterval: 1000 * 60,
    enabled: !!(
      topEvmTokensData &&
      bridgePairs &&
      icpTokens &&
      unAuthenticatedAgent &&
      (evmAddress || icpIdentity)
    ),
  });

  return {
    bridgeData: data?.result.bridge_history,
    dexData: data?.result.dex_history,
    isLoading,
    isError,
    icpIdentity,
    unAuthenticatedAgent,
  };
}
