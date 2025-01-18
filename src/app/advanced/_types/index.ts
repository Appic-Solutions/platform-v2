import { UseFormReturn } from 'react-hook-form';

export interface DefaultValuesType {
  chain_id: string;
  contract_address: string;
  transfer_fee: string;
}

export interface UseLogicReturn {
  step: number;
  isLoading: boolean;
  methods: UseFormReturn<DefaultValuesType>;
  onSubmit: (data: DefaultValuesType) => void;
  chainIdWatch: string;
}

export interface Step1Props {
  methods: UseFormReturn<DefaultValuesType>;
  chainIdWatch: string;
  isLoading: boolean;
}

export interface TokenListProps {
  prevStepHandler: () => void;
}
