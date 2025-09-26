'use client';

import { FormProvider } from 'react-hook-form';
import { useCreatePosition } from './_context/CreatePositionContext';
import StepNavigator from './_components/StepNavigator';
import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import CreatePositionStepThree from './_components/step-three';
import { useQuery } from '@tanstack/react-query';
import { get_all_pools } from '@/blockchain_api/functions/icp/dex/get_pool';
import { HttpAgent } from '@dfinity/agent';
import { useSharedStore } from '@/store/store';
import { usePathname } from 'next/navigation';
import { queryKeys } from '@/lib/constants/query-keys';

export default function PoolCreatePage() {
  const { step, createPositionForm, submitHandler } = useCreatePosition();
  const { unAuthenticatedAgent, icpTokens } = useSharedStore();

  const pathname = usePathname();

  useQuery({
    queryKey: queryKeys.icpPoolsCreatePosition,
    queryFn: async () => {
      const response = await get_all_pools(unAuthenticatedAgent as HttpAgent, icpTokens || []);
      if (!response.success) throw new Error('Failed to fetch icp pools (create position)');
      return response.result;
    },
    refetchInterval: 1000 * 30,
    staleTime: 0,
    gcTime: 1000 * 60,
    enabled: !!unAuthenticatedAgent && !!icpTokens?.length && pathname === '/positions/create',
  });

  return (
    <FormProvider {...createPositionForm}>
      <form
        onSubmit={createPositionForm.handleSubmit(submitHandler)}
        className="flex h-full w-full items-center justify-center"
      >
        <Box
          className={cn(
            'text-white transition-all lg:overflow-visible lg:text-black lg:dark:text-white',
            step === 1 ? 'md:w-[1156px]' : 'md:w-[533px]',
          )}
        >
          {step < 2 && <StepNavigator />}
          {step === 0 ? (
            <CreatePositionStepOne />
          ) : step === 1 ? (
            <CreatePositionStepTwo />
          ) : (
            <CreatePositionStepThree />
          )}
        </Box>
      </form>
    </FormProvider>
  );
}
