import { get_advanced_history } from '@/blockchain_api/functions/icp/get_advanced_history';
import { get_transaction_history } from '@/blockchain_api/functions/icp/get_bridge_history';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { useQuery } from '@tanstack/react-query';

export interface GetBridgeTransactionHistoryPayload {
  evm_wallet_address: string | undefined;
  principal_id: Principal;
  unauthenticated_agent: HttpAgent;
  bridge_tokens: (EvmToken | IcpToken)[];
}

export interface GetAdvancedTransactionHistoryPayload {
  principal_id: Principal;
  unauthenticated_agent: HttpAgent;
}

export const useGetAllBridgeHistory = (params: GetBridgeTransactionHistoryPayload) =>
  useQuery({
    queryKey: ['bridge-history'],
    queryFn: async () =>
      get_transaction_history(
        params.evm_wallet_address,
        params.principal_id,
        params.unauthenticated_agent,
        params.bridge_tokens,
      ),
    refetchInterval: 1000 * 60,
    enabled: !!(
      params.bridge_tokens &&
      params.unauthenticated_agent &&
      (params.evm_wallet_address || params.principal_id)
    ),
  });

export const useGetAllAdvancedHistory = (params: GetAdvancedTransactionHistoryPayload) =>
  useQuery({
    queryKey: ['advanced-history'],
    queryFn: async () => get_advanced_history(params.principal_id, params.unauthenticated_agent),
    refetchInterval: 1000 * 60,
    enabled: !!(params.unauthenticated_agent && params.principal_id),
  });
