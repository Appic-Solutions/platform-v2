import { RemoveLiquidityStepDetail } from '@/app/positions/types';
import React, { useState } from 'react';

interface Props {
  steps: RemoveLiquidityStepDetail[];
  onCloseModal: () => void;
}

export const RemoveLiquidityStepper = ({ steps, onCloseModal }: Props) => {
  const [step, prevStep] = useState();

  const resetTransaction = () => {
    console.log('reset');
  };

  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (prevStep.step === activeId) return;
    setPrevStep({ step: activeId, status: 'successful' });
  };

  return (
    <div className="relative w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-primary">Bridge Transaction</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {createPositionStepsDetails.map((step, index) => (
          <CreatePositionStep
            key={index}
            onResetTransaction={resetTransaction}
            currentStep={
              prevStep.step === 0 || prevStep.step === createPositionStep.step
                ? createPositionStep
                : prevStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={createPositionStep.step}
        selectedStep={prevStep.step}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
};
