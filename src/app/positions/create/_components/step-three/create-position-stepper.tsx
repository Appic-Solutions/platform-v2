'use client';
import { CreatePositionStep } from './create-position-step';
import { DialogClose } from '@/components/ui/dialog';
import { CloseIcon } from '@/components/icons';
import Stepper from '@/app/_layout/Stepper';
import { createPositionStepsDetails } from '@/lib/constants/positions';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { CreatePositionStepDetail } from '@/app/positions/types';

interface Props {
  steps: CreatePositionStepDetail[];
  onCloseModal: () => void;
}

export default function CreatePositionStepper({ steps, onCloseModal }: Props) {
  const {
    resetTransaction,
    createPositionPrevStep,
    setCreatePositionPrevStep,
    createPositionStep,
  } = useCreatePosition();

  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (createPositionPrevStep.step === activeId) return;
    setCreatePositionPrevStep({ step: activeId, status: 'successful' });
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
              createPositionPrevStep.step === 0 ||
              createPositionPrevStep.step === createPositionStep.step
                ? createPositionStep
                : createPositionPrevStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={createPositionStep.step}
        selectedStep={createPositionPrevStep.step}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
}
