import { get_evm_token } from '@/blockchain_api/functions/icp/new_twin_token';
import { HttpAgent } from '@dfinity/agent';
import { useMutation } from '@tanstack/react-query';

interface GetEvmTokensPayload {
  chain_id: string;
  contract_address: string;
  unauthenticated_agent: HttpAgent;
}

export const useGetEvmTokens = () => {
  return useMutation({
    mutationKey: ['bridge-options'],
    mutationFn: ({ chain_id, contract_address, unauthenticated_agent }: GetEvmTokensPayload) =>
      get_evm_token(chain_id, contract_address, unauthenticated_agent),
  });
};
