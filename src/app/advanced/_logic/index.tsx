import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { DefaultValuesType, Status, UseLogicReturn } from '../_types';
import {
  approve_icp,
  check_new_twin_ls_request,
  get_evm_token_and_generate_twin_token,
  NewTwinMetadata,
  request_new_twin,
} from '@/blockchain_api/functions/icp/new_twin_token';
import { useSharedStore } from '@/common/state/store';
import { Agent, HttpAgent } from '@dfinity/agent';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './validation';
import { useToast } from '@/common/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function LogicHelper(): UseLogicReturn {
  // State
  const [step, setStep] = useState(1);
  const [creationStep, setCreationStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const [status, setStatus] = useState<Status>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTwinMeta, setNewTwinMeta] = useState<NewTwinMetadata>();
  const [shouldPoll, setShouldPoll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { unAuthenticatedAgent, authenticatedAgent } = useSharedStore();

  // Hook
  const { toast } = useToast();

  // Form
  const methods = useForm<DefaultValuesType>({
    defaultValues: {
      chain_id: '',
      contract_address: '',
    },
    resolver: zodResolver(formSchema),
  });

  const chainIdWatch = useWatch({
    control: methods.control,
    name: 'chain_id',
  });

  // Handler
  const closeModalHandler = () => {
    setIsOpen(false);
  };

  // React Query for polling Step Four
  const { data } = useQuery({
    queryKey: ['checkStepFour'],
    queryFn: async () => {
      const response = await check_new_twin_ls_request(
        newTwinMeta as NewTwinMetadata,
        unAuthenticatedAgent as HttpAgent,
      );
      return response;
    },
    enabled: shouldPoll && !!newTwinMeta,
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    if (data?.result === 'success') {
      setShouldPoll(false);
      setIsLoading(false);
      setStatus('successful');
      setCanCloseModal(true);
    }
  }, [data]);

  const failedSubmitHandler = (message: string) => {
    setStatus('failed');
    setCreationStep(1)
    setErrorMessage(message);
    setCanCloseModal(true);
    throw new Error(message || 'we have new error')
  }

  const onSubmit = async (data: DefaultValuesType) => {
    try {
      setIsLoading(true);
      if (step === 1) {
        const resStepOne = await get_evm_token_and_generate_twin_token(
          data.chain_id,
          data.contract_address,
          unAuthenticatedAgent as HttpAgent,
        );
        console.log('🚀 ~ onSubmit ~ resStepOne:', resStepOne);
        if (!resStepOne.success) throw new Error(resStepOne.message || 'we have new error');
        setNewTwinMeta(resStepOne.result);
        setStep(2);
      } else {
        setIsOpen(true);
        const resStepTwo = await approve_icp(newTwinMeta as NewTwinMetadata, authenticatedAgent as Agent);
        console.log('🚀 ~ onSubmit ~ resStepTwo:', resStepTwo);
        if (!resStepTwo.success) failedSubmitHandler(resStepTwo.message)
        setCreationStep(2)

        const resStepThree = await request_new_twin(newTwinMeta as NewTwinMetadata, authenticatedAgent as Agent);
        console.log('🚀 ~ onSubmit ~ resStepThree:', resStepThree);
        if (!resStepThree.success) failedSubmitHandler(resStepThree.message)
        setCreationStep(3)
        setShouldPoll(true);
        setCanCloseModal(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    step,
    setStep,
    creationStep,
    isLoading,
    newTwinMeta,
    isOpen,
    status,
    errorMessage,
    canCloseModal,
    closeModalHandler,

    // Form
    methods,
    onSubmit,
    chainIdWatch,
  };
}
