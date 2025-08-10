import Stepper from '@/app/_layout/Stepper';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import { RemoveLiquidityStepDetail } from '@/app/positions/types';
import { CloseIcon } from '@/components/icons';
import { DialogClose } from '@/components/ui/dialog';
import { removeLiquidityStepsDetails } from '@/lib/constants/positions';
import React from 'react';
import { RemoveLiquidityStep } from './remove-liquidity-step';

interface Props {
  steps: RemoveLiquidityStepDetail[];
  onCloseModal: () => void;
}

export const RemoveLiquidityStepper = ({ steps, onCloseModal }: Props) => {
  const { removeLiquidityPrevStep, removeLiquidityStep, actions } = usePositionDetailsStore();

  const resetTransaction = () => {
    console.log('reset');
  };

  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (removeLiquidityPrevStep.step === activeId) return;
    actions.setRemoveLiquidityPrevStep({ step: activeId, status: 'successful' });
  };

  return (
    <div className="relative w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-primary">Remove Liquidity</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {removeLiquidityStepsDetails.map((step, index) => (
          <RemoveLiquidityStep
            key={index}
            onResetTransaction={resetTransaction}
            currentStep={
              removeLiquidityPrevStep.step === 0 ||
              removeLiquidityPrevStep.step === removeLiquidityStep.step
                ? removeLiquidityStep
                : removeLiquidityPrevStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={removeLiquidityStep.step}
        selectedStep={removeLiquidityPrevStep.step}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
};
