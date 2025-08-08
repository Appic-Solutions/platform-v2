import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { CreatePositionFormDefaultValues } from '../schema';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { ActiveTickArgs } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { HttpAgent } from '@dfinity/agent';

export interface SelectTokenHandlerProps {
  name: 'token0' | 'token1';
  value: CreatePositionFormDefaultValues['token0' | 'token1'];
}

export type FeeTier = CandidPoolId & {
  tvl: string;
  desc: string;
  matchedPool: Pool | undefined;
};

export type SelectFeeHandlerProps = CreatePositionFormDefaultValues['fee'];

export interface TokenListPageProps {
  stateBackHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  selectedTokenType: 1 | 2;
}

export interface FeeTiersProps {
  stateBackHandler: () => void;
  feeTiers: FeeTier[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
}

export interface HandlePriceProps {
  value: string;
  minOrMax: 'min' | 'max';
}

export interface GetChartDataArgs {
  args: ActiveTickArgs;
  unauthenticated_agent: HttpAgent;
}
