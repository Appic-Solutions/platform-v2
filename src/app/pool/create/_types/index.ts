import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { CreatePoolFormDefaultValues } from '../schema';
import { IcpToken } from '@/blockchain_api/types/tokens';

export interface SelectTokenHandlerProps {
  name: 'token0' | 'token1';
  value: CreatePoolFormDefaultValues['token0' | 'token1'];
}

export type FeeTier = CandidPoolId & {
  tvl: string;
  desc: string;
  isExist: boolean;
};

export type SelectFeeHandlerProps = CreatePoolFormDefaultValues['fee'];

export interface CreatePoolStepOneProps {
  resetFormHandler: () => void;
  selectTokenHandler: ({ name, value }: SelectTokenHandlerProps) => void;
  feeTiers: FeeTier[];
  selectFeeHandler: (value: SelectFeeHandlerProps) => void;
  stateNextHandler: () => void;
  getStepValidationFields: (step: number) => (keyof CreatePoolFormDefaultValues)[];
}

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

export interface CreatePositionStepTwoProps {
  isToken0Selected: boolean;
  setIsToken0Selected: (value: boolean) => void;
  handleMaxPriceInput: (value: string) => void;
  handleMinPriceInput: (value: string) => void;
  handleInitialPriceInput: (value: string) => void;
  handleSetMarketPrice: () => void;
  feeTiers: FeeTier[];
}

export interface StepTwoPoolNotExistProps {
  selectedToken: IcpToken | null;
  setSelectedToken: (value: IcpToken | null) => void;
  isToken0Selected: boolean;
  setIsToken0Selected: (value: boolean) => void;
  handleInitialPriceInput: (value: string) => void;
  handleSetMarketPrice: () => void;
}

export interface PriceRangeInputsProps {
  isToken0Selected: boolean;
  handleMaxPriceInput: (value: string) => void;
  handleMinPriceInput: (value: string) => void;
}
