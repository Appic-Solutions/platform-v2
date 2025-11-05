import { NewTwinMetadata } from '@/blockchain_api/functions/icp/new_twin_token';
import { Chain } from '@/blockchain_api/types/chains';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

export type Status = 'failed' | 'pending' | 'successful';

export interface DefaultValuesType {
  baseChain?: Chain;
  twinChain?: Chain;
  canisterIdOrTokenAddress: string;
}

export interface UseLogicReturn {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  creationStep: number;
  isLoading: boolean;
  newTwinMeta: NewTwinMetadata | undefined;
  isOpen: boolean;
  status: Status;
  errorMessage: string;
  canCloseModal: boolean;
  closeModalHandler: () => void;
  methods: UseFormReturn<DefaultValuesType>;
  onSubmit: (data: DefaultValuesType) => void;
}

export interface Step1Props {
  methods: UseFormReturn<DefaultValuesType>;
  isLoading: boolean;
}

export interface Step2Props {
  isLoading: boolean;
  newTwinMeta: NewTwinMetadata | undefined;
  prevStepHandler: () => void;
}

export interface TokenListProps {
  prevStepHandler: () => void;
  fieldName: string;
  title: string;
  baseChain: Chain | undefined;
  twinChain: Chain | undefined;
}

export interface ProcessModalProps {
  isOpen: boolean;
  title: string;
  step: number;
  subTitle: string;
  newTwinMeta: NewTwinMetadata | undefined;
  closeHandler: () => void;
  status: Status;
  canCloseModal: boolean;
}

export interface ModalStepDataReturn {
  title: string;
  pending: string;
  successful: string;
  failed: string;
}
