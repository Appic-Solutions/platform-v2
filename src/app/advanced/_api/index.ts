import { get_evm_token_and_generate_twin_token } from '@/blockchain_api/functions/icp/new_twin_token';
import { HttpAgent } from '@dfinity/agent';
import { useMutation } from '@tanstack/react-query';

interface GetEvmTokensPayload {
  chain_id: string;
  contract_address: string;
  transfer_fee: string;
  unauthenticated_agent: HttpAgent;
}

export const useGetEvmTokens = () => {
  return useMutation({
    mutationKey: ['bridge-options'],
    mutationFn: ({ chain_id, contract_address, transfer_fee, unauthenticated_agent }: GetEvmTokensPayload) =>
      get_evm_token_and_generate_twin_token(chain_id, contract_address, transfer_fee, unauthenticated_agent),
  });
};
