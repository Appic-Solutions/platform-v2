'use client';
import { TransactionStep } from './TransactionStep';
import { TxStep } from '../../_api/types';
import { TxStepType } from '../../_store';
import { DialogClose } from '@/common/components/ui/dialog';
import { CloseIcon } from '@/common/components/icons';
import { BridgeLogic } from '../../_logic';
import ProgressBar from './ProgressBar';

export default function BridgeTransactionStepper({ steps, currentStep }: { steps: TxStep[]; currentStep: TxStepType }) {
  const { resetTransaction } = BridgeLogic();
  return (
    <div className="w-full max-w-[691px] justify-start gap-y-9 relative">
      <div className="text-center text-lg font-bold text-primary">Bridge Transaction</div>
      <DialogClose onClick={resetTransaction} className="absolute right-5 top-0">
        <CloseIcon className="text-primary w-6 h-6" />
      </DialogClose>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:gap-x-16 gap-y-16 py-5">
        {steps.map((step, index) => (
          <TransactionStep key={index} currentStep={currentStep} index={index} step={step} steps={steps} />
        ))}
      </div>
      <ProgressBar steps={steps} currentStep={currentStep} />
    </div>
  );
}
