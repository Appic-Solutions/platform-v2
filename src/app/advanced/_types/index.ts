import { NewTwinMetadata } from '@/blockchain_api/functions/icp/new_twin_token';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface DefaultValuesType {
  chain_id: string;
  contract_address: string;
  transfer_fee: string;
}

export interface UseLogicReturn {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  newTwinMeta: NewTwinMetadata | undefined;
  isOpen: boolean;
  closeModalHandler: () => void;
  methods: UseFormReturn<DefaultValuesType>;
  onSubmit: (data: DefaultValuesType) => void;
  chainIdWatch: string;
}

export interface Step1Props {
  methods: UseFormReturn<DefaultValuesType>;
  chainIdWatch: string;
  isLoading: boolean;
}

export interface Step2Props {
  isLoading: boolean;
  newTwinMeta: NewTwinMetadata | undefined;
  prevStepHandler: () => void;
}

export interface TokenListProps {
  prevStepHandler: () => void;
}

export interface ProcessModalProps {
  isOpen: boolean;
  newTwinMeta: NewTwinMetadata | undefined;
  closeHandler: () => void;
}
