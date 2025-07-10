'use client';

import { FormProvider } from 'react-hook-form';
import CreatePoolLogic from './_logic';
import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import CreatePoolStepThree from './_components/step-three';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export default function PoolCreatePage() {
  const {
    // Shared
    step,
    setStep,
    methods,
    stepNextHandler,
    stepBackHandler,
    // Step One
    resetFormHandler,
    selectTokenHandler,
    feeTiers,
    selectFeeHandler,
    // Step Two
    // Step Three
    submitHandler,
  } = CreatePoolLogic();

  const content = () => {
    if (step === 0)
      return (
        <CreatePositionStepOne
          resetFormHandler={resetFormHandler}
          selectTokenHandler={selectTokenHandler}
          feeTiers={feeTiers}
          selectFeeHandler={selectFeeHandler}
          stateNextHandler={stepNextHandler}
        />
      );
    if (step === 1) return <CreatePositionStepTwo />;
    return <CreatePoolStepThree />;
  };

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
            <div
              className={cn(
                'hidden items-center justify-between gap-1.5 lg:flex',
                'rounded-full bg-box-background text-white ring-[5px] ring-box-border',
                'absolute -left-24 top-1/2 h-[185px] -translate-y-1/2 flex-col p-2',
              )}
            >
              {[0, 1].map((item) => (
                <div
                  onClick={() => setStep(item)}
                  key={item}
                  className={cn(
                    'flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full transition-all',
                    step === item
                      ? 'bg-primary-buttons'
                      : 'bg-[linear-gradient(81.4deg,rgba(239,239,239,0)-15.41%,rgba(164,164,164,0.24)113.98%)]',
                  )}
                >
                  {item + 1}
                </div>
              ))}
              <div className="absolute top-1/2 h-[53px] w-[3px] -translate-y-1/2 rounded-full bg-[rgba(86,144,255,1)]"></div>
            </div>
          )}
          {content()}
        </Box>
      </form>
    </FormProvider>
  );
}
