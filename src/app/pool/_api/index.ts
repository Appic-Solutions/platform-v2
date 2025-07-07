import { get_all_pools } from "@/blockchain_api/functions/icp/dex/get_pool";
import { IcpToken } from "@/blockchain_api/types/tokens";
import { HttpAgent } from "@dfinity/agent";

export const fetchAllPools = async (agent: HttpAgent, tokens: IcpToken[]) => {
  const response = await get_all_pools(agent, tokens);
  if (!response.success) {
    throw new Error('Failed to fetch all pools');
  }
  return response.result;
};