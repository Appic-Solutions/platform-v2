import { Agent, HttpAgent } from '@dfinity/agent';
import {
  approve_icp_or_native_token,
  check_new_twin_ls_request,
  get_evm_token_and_generate_twin_token,
  NewTwinMetadata,
  request_new_twin,
} from '@/blockchain_api/functions/icp/new_twin_token';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Chain } from '@/blockchain_api/types/chains';

export const apiService = {
  async fetchTwinToken(
    base_chain: Chain,
    twin_chain: Chain,
    canister_id_or_token_address: string,
    unauthenticated_agent: HttpAgent,
    all_icp_tokens: IcpToken[],
  ) {
    const res = await get_evm_token_and_generate_twin_token(
      base_chain,
      twin_chain,
      canister_id_or_token_address,
      unauthenticated_agent,
      all_icp_tokens,
    );
    if (!res.success) throw new Error(res.message || 'Failed to fetch twin token');
    return res.result;
  },
  async approveICP(metadata: NewTwinMetadata, agent: Agent) {
    const res = await approve_icp_or_native_token(metadata, agent);
    if (!res.success) throw new Error(res.message || 'ICP approval failed');
    return res;
  },
  async requestNewTwin(metadata: NewTwinMetadata, agent: Agent) {
    const res = await request_new_twin(metadata, agent);
    if (!res.success) throw new Error(res.message || 'Request new twin failed');
    return res;
  },
  async checkTwinRequest(metadata: NewTwinMetadata, agent: HttpAgent) {
    return check_new_twin_ls_request(metadata, agent);
  },
};
