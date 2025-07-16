'use client';

import { FormProvider } from 'react-hook-form';

import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import CreatePoolStepThree from './_components/step-three';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import StepNavigator from './_components/StepNavigator';
import useCreatePoolLogic from './_logic/useCreatePoolLogic';

export default function PoolCreatePage() {
  const {
    // Shared
    step,
    methods,
    stepNextHandler,
    stepBackHandler,
    getStepValidationFields,
    // Step One
    resetFormHandler,
    selectTokenHandler,
    feeTiers,
    selectFeeHandler,
    // Step Two
    handlePriceInput,
    isToken0Selected,
    setIsToken0Selected,
    handleInitialPriceInput,
    handleSetMarketPrice,
    // Step Three
    submitHandler,
  } = useCreatePoolLogic();

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
          {step < 2 && (
            <StepNavigator
              step={step}
              stepNextHandler={stepNextHandler}
              stepBackHandler={stepBackHandler}
            />
          )}
          {step === 0 ? (
            <CreatePositionStepOne
              getStepValidationFields={getStepValidationFields}
              resetFormHandler={resetFormHandler}
              selectTokenHandler={selectTokenHandler}
              feeTiers={feeTiers}
              selectFeeHandler={selectFeeHandler}
              stateNextHandler={stepNextHandler}
            />
          ) : step === 1 ? (
            <CreatePositionStepTwo
              stepNextHandler={stepNextHandler}
              handlePriceInput={handlePriceInput}
              isToken0Selected={isToken0Selected}
              feeTiers={feeTiers}
              methods={methods}
              setIsToken0Selected={setIsToken0Selected}
              handleInitialPriceInput={handleInitialPriceInput}
              handleSetMarketPrice={handleSetMarketPrice}
            />
          ) : (
            <CreatePoolStepThree />
          )}
        </Box>
      </form>
    </FormProvider>
  );
}
