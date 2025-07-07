'use client';

import { FormProvider } from 'react-hook-form';
import CreatePoolLogic from './_logic';
import CreatePoolStepOne from './_components/step-one/page';
import CreatePoolStepThree from './_components/step-three/page';
import CreatePoolStepTwo from './_components/new-position/PositionStepTwo';

export default function PoolCreatePage() {
  const {
    // Shared
    step,
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitHandler)} className="w-full">
        {step === 0 ? (
          <CreatePoolStepOne
            resetFormHandler={resetFormHandler}
            selectTokenHandler={selectTokenHandler}
            feeTiers={feeTiers}
            selectFeeHandler={selectFeeHandler}
            stateNextHandler={stepNextHandler}
          />
        ) : step === 1 ? (
          <CreatePoolStepTwo />
        ) : (
          <CreatePoolStepThree />
        )}
      </form>
    </FormProvider>
  );
}
