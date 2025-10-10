import { EvmTokensBalances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { DexData } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { IcpTokensBalances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';

export const queryKeys = {
  icpTokens: 'icp-tokens',
  icpPools: 'icp-pools',
  dexData: 'dex-data',
  bridgePairs: 'bridge-pairs',
  bridgeHistory: 'bridge-history',
  positions: 'fetch-positions',
  icpPoolsCreatePosition: 'icp-pools-create-position', // this query has an interval. so we should separate it from another queries.
  icpBalance: 'fetch-icp-balances',
  evmBalance: 'fetch-evm-balance',
} as const;

export type QueryKeys = typeof queryKeys;
export type QueryKeyName = keyof QueryKeys;
export type QueryReturnTypes = {
  [queryKeys.icpTokens]: IcpToken[];
  [queryKeys.icpBalance]: IcpTokensBalances;
  [queryKeys.evmBalance]: EvmTokensBalances;
  [queryKeys.icpPools]: Pool[];
  [queryKeys.dexData]: DexData;
  [queryKeys.bridgePairs]: (EvmToken | IcpToken)[];
};

export type QueryKey = keyof QueryReturnTypes;
