import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { DefaultValuesType, UseLogicReturn } from '../_types';
import { get_evm_token_and_generate_twin_token } from '@/blockchain_api/functions/icp/new_twin_token';
import { useSharedStore } from '@/common/state/store';
import { HttpAgent } from '@dfinity/agent';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './validation';

export default function LogicHelper(): UseLogicReturn {
  const [step, setStep] = useState(1);
  const [isLoading, setIsloading] = useState(false);
  const { unAuthenticatedAgent } = useSharedStore();

  const methods = useForm<DefaultValuesType>({
    defaultValues: {
      chain_id: '',
      contract_address: '',
      transfer_fee: '',
    },
    resolver: zodResolver(formSchema),
  });

  const chainIdWatch = useWatch({
    control: methods.control,
    name: 'chain_id',
  });

  const onSubmit = async (data: DefaultValuesType) => {
    try {
      setIsloading(true);
      if (step === 1) {
        const resStepOne = await get_evm_token_and_generate_twin_token(
          data.chain_id,
          data.contract_address,
          data.transfer_fee,
          unAuthenticatedAgent as HttpAgent,
        );
        console.log('🚀 ~ onSubmit ~ resStepOne:', resStepOne);
      } else {
        console.log('Data Stap 1 => ', data);
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
    } finally {
      setIsloading(false);
    }
  };

  return {
    // State
    step,
    isLoading,

    // Form
    methods,
    onSubmit,
    chainIdWatch,
  };
}
