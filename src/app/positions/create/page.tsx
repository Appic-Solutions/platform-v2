'use client';

import { FormProvider } from 'react-hook-form';
import { CreatePositionProvider, useCreatePosition } from './_context/CreatePositionContext';
import StepNavigator from './_components/StepNavigator';
import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import CreatePositionStepThree from './_components/step-three';

export default function PoolCreatePage() {
  const { step, methods, submitHandler } = useCreatePosition();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitHandler)}
        className="flex h-full w-full items-center justify-center"
      >
        <Box
          className={cn(
            'text-white transition-all md:p-12 lg:overflow-visible lg:text-black lg:dark:text-white',
            step === 1 ? 'md:h-[789px] lg:w-[1204px]' : 'lg:h-[716px] lg:w-[611px]',
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
