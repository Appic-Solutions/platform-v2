import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { CreatePoolFormDefaultValues } from '../schema';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { UseFormReturn } from 'react-hook-form';

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
  handlePriceInput: (props: HandlePriceProps) => void;
  handleInitialPriceInput: (value: string) => void;
  handleDepositAmountInput: ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => void;
  handleSetMarketPrice: () => void;
  stepNextHandler: () => void;
  feeTiers: FeeTier[];
  methods: UseFormReturn<CreatePoolFormDefaultValues>;
}

export interface StepTwoPoolNotExistProps {
  isToken0Selected: boolean;
  setIsToken0Selected: (value: boolean) => void;
  handleInitialPriceInput: (value: string) => void;
  handleSetMarketPrice: () => void;
  methods: UseFormReturn<CreatePoolFormDefaultValues>;
}

export interface PriceRangeInputsProps {
  isToken0Selected: boolean;
  handlePriceInput: (props: HandlePriceProps) => void;
  methods: UseFormReturn<CreatePoolFormDefaultValues>;
}

export interface DepositAmountsInputsProps {
  handleDepositAmountInput: ({
    amount,
    isAmountZero,
  }: {
    isAmountZero: boolean;
    amount: string;
  }) => void;
}

export interface HandlePriceProps {
  value: string;
  minOrMax: 'min' | 'max';
}
