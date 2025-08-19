import Stepper from '@/app/_layout/Stepper';
import { CreatePositionStepDetail } from '@/app/positions/types';
import { CloseIcon } from '@/components/icons';
import { DialogClose } from '@/components/ui/dialog';
import React from 'react';
import { PositionStep } from './position-step';
import { usePositionDetailsStore } from '../../_store/usePositionDetailsStore';

interface Props {
  steps: CreatePositionStepDetail[];
  onCloseModal: () => void;
  title: string;
}

export const PositionStepper = ({ steps, onCloseModal, title }: Props) => {
  const { mintPrevStep, mintStep, actions } = usePositionDetailsStore();

  const closeModal = () => {
    onCloseModal();
  };

  const stepperClickHandler = (activeId: number) => {
    if (mintPrevStep.step === activeId) return;
    actions.setMintPrevStep({ step: activeId, status: 'successful' });
  };

  return (
    <div className="relative w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-primary">{title}</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {steps.map((step, index) => (
          <PositionStep
            key={index}
            currentStep={
              mintPrevStep.step === 0 || mintPrevStep.step === mintStep.step
                ? mintStep
                : mintPrevStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={mintStep.step}
        selectedStep={mintPrevStep.step}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
};
