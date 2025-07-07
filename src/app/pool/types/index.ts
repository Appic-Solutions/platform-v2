import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';

export interface PoolStoreState {
  pools: Pool[];
  icpTokens: IcpToken[];
}

export type PoolStoreAction = {
  actions: {
    setPools: (pools: Pool[]) => void;
    setIcpTokens: (icpTokens: IcpToken[]) => void;
  };
};
