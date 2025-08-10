import Stepper from '@/app/_layout/Stepper';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import { AddLiquidityStepDetail } from '@/app/positions/types';
import { CloseIcon } from '@/components/icons';
import { DialogClose } from '@/components/ui/dialog';
import { addLiquidityStepsDetails } from '@/lib/constants/positions';
import React from 'react';
import { AddLiquidityStep } from './add-liquidity-step';

interface Props {
  steps: AddLiquidityStepDetail[];
  onCloseModal: () => void;
}

export const AddLiquidityStepper = ({ steps, onCloseModal }: Props) => {
  const { addLiquidityPrevStep, addLiquidityStep, actions } = usePositionDetailsStore();

  const resetTransaction = () => {
    console.log('reset');
  };

  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (addLiquidityPrevStep.step === activeId) return;
    actions.setAddLiquidityPrevStep({ step: activeId, status: 'successful' });
  };

  return (
    <div className="relative w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-primary">Add Liquidity</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {addLiquidityStepsDetails.map((step, index) => (
          <AddLiquidityStep
            key={index}
            onResetTransaction={resetTransaction}
            currentStep={
              addLiquidityPrevStep.step === 0 || addLiquidityPrevStep.step === addLiquidityStep.step
                ? addLiquidityStep
                : addLiquidityPrevStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={addLiquidityStep.step}
        selectedStep={addLiquidityPrevStep.step}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
};
