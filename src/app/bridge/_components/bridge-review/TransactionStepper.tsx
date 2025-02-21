'use client';
import { TransactionStep } from './TransactionStep';
import { TxStep } from '../../_api/types';
import { useBridgeStore } from '../../_store';
import { DialogClose } from '@/common/components/ui/dialog';
import { CloseIcon } from '@/common/components/icons';
import { BridgeLogic } from '../../_logic';
import Stepper from '@/common/components/layout/Stepper';

interface Props {
  steps: TxStep[];
  onCloseModal: () => void;
}

export default function BridgeTransactionStepper({ steps, onCloseModal }: Props) {
  const { resetTransaction } = BridgeLogic();
  const { txStep, prevTxStep, actions } = useBridgeStore()

  const closeModal = () => {
    onCloseModal();
    resetTransaction();
  };

  const stepperClickHandler = (activeId: number) => {
    if (prevTxStep.count === activeId) return;
    actions.setPrevTxStep({ count: activeId, status: "successful" })
  }

  return (
    <div className="w-full max-w-[691px] justify-start gap-y-9 relative">
      <div className="text-center text-lg font-bold text-primary">Bridge Transaction</div>
      <DialogClose onClick={closeModal} className="absolute right-5 top-0">
        <CloseIcon className="text-primary w-6 h-6" />
      </DialogClose>
      <div className="flex flex-col items-center justify-center gap-y-16 py-5 md:flex-row md:items-start md:gap-x-16">
        {steps.map((step, index) => (
          <TransactionStep
            key={index}
            currentStep={(prevTxStep.count === 0 || prevTxStep.count === txStep.count) ? txStep : prevTxStep}
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
