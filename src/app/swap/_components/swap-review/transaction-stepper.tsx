'use client';
import { TransactionStep } from './transaction-step';
import { TxStep } from '../../_api/types';
import { useSwapStore } from '../../_store';
import { DialogClose } from '@/components/ui/dialog';
import { CloseIcon } from '@/components/icons';
import Stepper from '@/app/_layout/Stepper';

interface Props {
  steps: TxStep[];
  onCloseModal: () => void;
}

export default function SwapTransactionStepper({ steps, onCloseModal }: Props) {
  const { swapStep, prevSwapStep, actions } = useSwapStore();

  const stepperClickHandler = (activeId: number) => {
    if (prevSwapStep.count === activeId) return;
    actions.setPrevSwapStep({ count: activeId, status: 'successful' });
  };

  return (
    <div className="relative w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-primary">Swap Transaction</div>
      <DialogClose onClick={onCloseModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {steps.map((step, index) => (
          <TransactionStep
            onCloseModal={onCloseModal}
            key={index}
            currentStep={
              prevSwapStep.count === 0 || prevSwapStep.count === swapStep.count
                ? swapStep
                : prevSwapStep
            }
            index={index}
            step={step}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={swapStep.count}
        selectedStep={prevSwapStep.count}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
}
