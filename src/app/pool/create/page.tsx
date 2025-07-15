'use client';

import { FormProvider } from 'react-hook-form';
import CreatePoolLogic from './_logic';
import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import CreatePoolStepThree from './_components/step-three';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import StepNavigator from './_components/StepNavigator';

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
    handleMaxPriceInput,
    handleMinPriceInput,
    isToken0Selected,
    setIsToken0Selected,
    handleInitialPriceInput,
    handleSetMarketPrice,
    // Step Three
    submitHandler,
  } = CreatePoolLogic();

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
              handleMaxPriceInput={handleMaxPriceInput}
              handleMinPriceInput={handleMinPriceInput}
              isToken0Selected={isToken0Selected}
              feeTiers={feeTiers}
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
