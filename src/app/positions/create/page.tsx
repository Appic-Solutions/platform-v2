'use client';

import { FormProvider } from 'react-hook-form';
import { useCreatePosition } from './_context/CreatePositionContext';
import StepNavigator from './_components/StepNavigator';
import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import CreatePositionStepThree from './_components/step-three';

export default function PoolCreatePage() {
  const { step, createPositionForm, submitHandler } = useCreatePosition();

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
