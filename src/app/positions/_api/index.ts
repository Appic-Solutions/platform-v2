import { get_all_pools } from '@/blockchain_api/functions/icp/dex/get_pool';
import {
  getPositionsByOwner,
  GetPositionsByOwnerArgs,
} from '@/blockchain_api/functions/icp/dex/get_positions';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { HttpAgent } from '@dfinity/agent';
import { useMutation, useQuery } from '@tanstack/react-query';

export const fetchAllPools = async (agent: HttpAgent, tokens: IcpToken[]) => {
  const response = await get_all_pools(agent, tokens);
  if (!response.success) {
    throw new Error('Failed to fetch all pools');
  }
  return response.result;
};

export const useGetPositions = () => {
  return useMutation({
    mutationKey: ['positions'],
    mutationFn: ({ icpTokens, owner, pools, unAuthenticatedAgent }: GetPositionsByOwnerArgs) =>
      getPositionsByOwner({
        icpTokens,
        pools,
        owner,
        unAuthenticatedAgent,
      }),
  });
};
