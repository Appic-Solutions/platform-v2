import { useEffect, useState } from 'react';
import { DefaultValuesType, Status, UseLogicReturn } from '../_types';
import { NewTwinMetadata } from '@/blockchain_api/functions/icp/new_twin_token';
import { useSharedStore } from '@/store/store';
import { useToast } from '@/lib/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiService } from './api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../validation';
import { Chain } from '@/blockchain_api/types/chains';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { queryKeys } from '@/lib/constants/query-keys';

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

  // Store
  const { unAuthenticatedAgent, authenticatedAgent } = useSharedStore();
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);

  // Form
  const methods = useForm<DefaultValuesType>({
    defaultValues: {
      baseChain: undefined,
      twinChain: undefined,
      canisterIdOrTokenAddress: '',
    },
    resolver: zodResolver(formSchema),
  });

  // Hook
  const { toast } = useToast();
  const { data } = useQuery({
    queryKey: ['checkStepFour'],
    queryFn: () => apiService.checkTwinRequest(newTwinMeta!, unAuthenticatedAgent!),
    enabled: shouldPoll && !!newTwinMeta,
    refetchInterval: 1000 * 60,
  });

  // Effect
  useEffect(() => {
    if (data?.success) {
      setShouldPoll(false);
      setIsLoading(false);
      setStatus('successful');
      setCanCloseModal(true);
    }
  }, [data]);

  // Handler
  const onSubmit = async (data: DefaultValuesType) => {
    try {
      setIsLoading(true);
      if (step === 1) {
        const result = await apiService.fetchTwinToken(
          data.baseChain as Chain,
          data.twinChain as Chain,
          data.canisterIdOrTokenAddress,
          unAuthenticatedAgent!,
          icpTokens ? icpTokens : [],
        );
        setNewTwinMeta(result);
        setStep(2);
      } else {
        setIsOpen(true);
        await apiService.approveICP(newTwinMeta!, authenticatedAgent!);
        setCreationStep(2);

        await apiService.requestNewTwin(newTwinMeta!, authenticatedAgent!);
        setCreationStep(3);
        setShouldPoll(true);
        setCanCloseModal(true);
      }
    } catch (error: unknown) {
      handleError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (message: string) => {
    setStatus('failed');
    setErrorMessage(message);
    setCanCloseModal(true);
    toast({ title: message, variant: 'destructive' });
  };

  const closeModalHandler = () => {
    setIsOpen(false);
    setStatus('pending');
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
    // Handler
    onSubmit,
  };
}
