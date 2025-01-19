import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { DefaultValuesType, UseLogicReturn } from '../_types';
import { get_evm_token_and_generate_twin_token, NewTwinMetadata } from '@/blockchain_api/functions/icp/new_twin_token';
import { useSharedStore } from '@/common/state/store';
import { HttpAgent } from '@dfinity/agent';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './validation';
import { useToast } from '@/common/hooks/use-toast';

export default function LogicHelper(): UseLogicReturn {
  const [step, setStep] = useState(1);
  const [newTwinMeta, setNewTwinMeta] = useState<NewTwinMetadata>();
  const [isLoading, setIsloading] = useState(false);

  const { unAuthenticatedAgent } = useSharedStore();
  const { toast } = useToast()

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
        if (!resStepOne.success) throw new Error(resStepOne.message || "we have new error")
        setNewTwinMeta(resStepOne.result)
        setStep(2)
      } else {
        console.log('Data Stap 1 => ', data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive"
        })
      }
    } finally {
      setIsloading(false);
    }
  };

  return {
    // State
    step,
    setStep,
    isLoading,
    newTwinMeta,

    // Form
    methods,
    onSubmit,
    chainIdWatch,
  };
}
