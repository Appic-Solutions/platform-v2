import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { ActiveTickArgs } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { HttpAgent } from '@dfinity/agent';
import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { CreatePositionFormDefaultValues } from '../create/schema';
import { TxStatus } from '@/app/bridge/_api/types';

export interface PoolStoreState {
  pools: Pool[];
  icpTokens: IcpToken[];
  positions: Position[];
}

export type PoolStoreAction = {
  actions: {
    setPools: (pools: Pool[]) => void;
    setIcpTokens: (icpTokens: IcpToken[]) => void;
    setPositions: (positions: Position[]) => void;
  };
};

export type FormattedPosition = Position & {
  token0: IcpToken;
  token1: IcpToken;
};

export type Step = 'addLiquidity' | 'removeLiquidity' | 'collectFees' | 'positionDetail';

export interface PositionDetailsProps {
  position: FormattedPosition;
  onReset: () => void;
}

export interface PositionPercentage {
  token0Percent: number;
  token1Percent: number;
}

export type FeesPercentage = PositionPercentage;

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

export interface CreatePositionStep {
  step: number;
  status: 'failed' | 'successful' | 'pending';
  errorMessage?: null | string;
}

export interface CreatePositionStepDetail {
  title: string;
  statuses: {
    [key in 'pending' | 'successful' | 'failed']: TxStatus;
  };
}
