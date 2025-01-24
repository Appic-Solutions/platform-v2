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
  const [isOpen, setIsOpen] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const [status, setStatus] = useState<Status>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTwinMeta, setNewTwinMeta] = useState<NewTwinMetadata>();
  const [shouldPoll, setShouldPoll] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { unAuthenticatedAgent, authenticatedAgent, icpIdentity } = useSharedStore();

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
  const { data, error } = useQuery({
    queryKey: ['checkStepFour'],
    queryFn: async () => {
      const response = await check_new_twin_ls_request(newTwinMeta as NewTwinMetadata, authenticatedAgent as Agent);
      setCanCloseModal(true);
      if (!response.success) {
        setStatus('failed');
        throw new Error(response.message || 'Still processing...');
      }
      console.log('🚀 ~ queryFn: ~ response:', response);
      return response;
    },
    enabled: shouldPoll && !!newTwinMeta,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (data?.success) {
      toast({ title: data.message || 'Twin Token created successfully' });
      setStep(1);
      setStatus('successfull');
      setShouldPoll(false);
    }

    if (error) {
      toast({
        title: (error as Error)?.message || 'Failed to create Twin Token',
        variant: 'destructive',
      });
      setErrorMessage(error.message);
      setShouldPoll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const onSubmit = async (data: DefaultValuesType) => {
    try {
      setIsloading(true);
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
        if (!!icpIdentity) return
        setIsOpen(true);
        const resStepTwo = await approve_icp(newTwinMeta as NewTwinMetadata, authenticatedAgent as Agent);
        console.log('🚀 ~ onSubmit ~ resStepTwo:', resStepTwo);
        if (!resStepTwo.success) {
          setStatus('failed');
          setErrorMessage(resStepTwo.message);
          setCanCloseModal(true);
          throw new Error(resStepTwo.message || 'we have new error');
        }

        const resStepThree = await request_new_twin(newTwinMeta as NewTwinMetadata, authenticatedAgent as Agent);
        console.log('🚀 ~ onSubmit ~ resStepThree:', resStepThree);
        if (!resStepThree.success) {
          setStatus('failed');
          setErrorMessage(resStepThree.message);
          setCanCloseModal(true);
          throw new Error(resStepThree.message || 'we have new error');
        }

        setShouldPoll(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: 'destructive',
        });
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
