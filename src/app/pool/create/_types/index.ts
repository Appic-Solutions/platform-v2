import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { CreatePoolFormDefaultValues } from '../schema';

export interface SelectTokenHandlerProps {
  name: 'token0' | 'token1';
  value: CreatePoolFormDefaultValues['token0' | 'token1'];
}

export type SelectFeeHandlerProps = CreatePoolFormDefaultValues['fee'];

export interface CreatePoolStepOneProps {
  resetFormHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  feeTiers: (CandidPoolId & { tvl: string; desc: string | undefined })[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
  stateNextHandler: () => void;
}

export interface TokenListPageProps {
  stateBackHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  selectedTokenType: 1 | 2;
}

export interface FeeTiersProps {
  stateBackHandler: () => void;
  feeTiers: (CandidPoolId & { tvl: string; desc: string | undefined })[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
}
