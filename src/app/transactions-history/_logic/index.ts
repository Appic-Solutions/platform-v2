import { useSharedStore } from '@/store/store';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { get_transaction_history } from '@/blockchain_api/functions/icp/get_bridge_history';
import { HttpAgent } from '@dfinity/agent';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { queryKeys } from '@/lib/constants/query-keys';

export default function useLogic() {
  const { unAuthenticatedAgent, icpIdentity, evmAddress } = useSharedStore();
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);
  const bridgePairs = useTypedQueryData(queryKeys.bridgePairs);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bridge-dex-history'],
    queryFn: async () =>
      get_transaction_history(
        evmAddress,
        icpIdentity,
        unAuthenticatedAgent as HttpAgent,
        bridgePairs as (EvmToken | IcpToken)[],
        icpTokens as IcpToken[],
      ),
    refetchInterval: 1000 * 60,
    enabled: !!(bridgePairs && icpTokens && unAuthenticatedAgent && (evmAddress || icpIdentity)),
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
