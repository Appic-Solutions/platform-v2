import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { IcpToken } from '@/blockchain_api/types/tokens';

export interface CreatePoolFormDefaultValues {
  searchTokenQuery: string;
  fee: number;
  token0: IcpToken;
  token0InitialPrice: string;
  token0MinPrice: string;
  token0MaxPrice: string;
  token0MinDeposit: string;
  token0MaxDeposit: string;
  token1: IcpToken;
  token1InitialPrice: string;
  token1MinPrice: string;
  token1MaxPrice: string;
  token1MinDeposit: string;
  token1MaxDeposit: string;
}

export interface SelectTokenHandlerProps {
  name: 'token0' | 'token1';
  value: CreatePoolFormDefaultValues['token0' | 'token1'];
}

export type SelectFeeHandlerProps = CreatePoolFormDefaultValues['fee'];

export interface CreatePoolStepOneProps {
  resetFormHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  feeTiers: (CandidPoolId & { tvl: string })[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
  stateNextHandler: () => void;
}

export interface TokenListPageProps {
  stateBackHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  selectedTokenType: 1 | 2;
}

export interface FeeTiersPageProps {
  stateBackHandler: () => void;
  feeTiers: (CandidPoolId & { tvl: string })[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
}
