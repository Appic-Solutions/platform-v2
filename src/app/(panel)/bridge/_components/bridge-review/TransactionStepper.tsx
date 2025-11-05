'use client';
import { TransactionStep } from './TransactionStep';
import { TxStep } from '../../_api/types';
import { useBridgeStore } from '../../_store';
import { DialogClose } from '@/components/ui/dialog';
import { CloseIcon } from '@/components/icons';
import Stepper from '@/app/(panel)/_layout/Stepper';
import BridgeReviewLogic from './_logic';

interface Props {
  steps: TxStep[];
  onCloseModal: () => void;
}

export default function BridgeTransactionStepper({ steps, onCloseModal }: Props) {
  const { resetTransaction } = BridgeReviewLogic();
  const { txStep, prevTxStep, actions } = useBridgeStore();
  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (prevTxStep.count === activeId) return;
    actions.setPrevTxStep({ count: activeId, status: 'successful' });
  };

  return (
    <div className="relative max-h-[80vh] w-full max-w-[691px] justify-start gap-y-9 overflow-x-hidden md:overflow-y-auto">
      <div className="text-center text-lg font-bold text-primary">Bridge Transaction</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="h-6 w-6 text-primary" />
      </DialogClose>
      <div className="flex w-full flex-col items-center justify-center gap-y-16 px-6 py-5 md:flex-row md:items-start md:gap-x-16">
        {steps.map((step, index) => (
          <TransactionStep
            key={index}
            onResetTransaction={resetTransaction}
            currentStep={
              prevTxStep.count === 0 || prevTxStep.count === txStep.count ? txStep : prevTxStep
            }
            index={index}
            step={step}
            steps={steps}
          />
        ))}
      </div>
      <Stepper
        totalSteps={steps.length}
        currentStep={txStep.count}
        selectedStep={prevTxStep.count}
        clickHandler={stepperClickHandler}
      />
    </div>
  );
}
