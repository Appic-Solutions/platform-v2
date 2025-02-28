import { Agent, HttpAgent } from '@dfinity/agent';
import {
  approve_icp,
  check_new_twin_ls_request,
  get_evm_token_and_generate_twin_token,
  NewTwinMetadata,
  request_new_twin,
} from '@/blockchain_api/functions/icp/new_twin_token';

export const apiService = {
  async fetchTwinToken(chainId: string, contractAddress: string, agent: HttpAgent) {
    const res = await get_evm_token_and_generate_twin_token(chainId, contractAddress, agent);
    if (!res.success) throw new Error(res.message || 'Failed to fetch twin token');
    return res.result;
  },
  async approveICP(metadata: NewTwinMetadata, agent: Agent) {
    const res = await approve_icp(metadata, agent);
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
