'use client';
import { TransactionStep } from './TransactionStep';
import { TxStep } from '../../_api/types';
import { TxStepType } from '../../_store';

export default function BridgeTransactionStepper({ steps, currentStep }: { steps: TxStep[]; currentStep: TxStepType }) {
  return (
    <div className="w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-[#333333] dark:text-white">Bridge Transaction</div>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:gap-x-16 gap-y-16 py-5">
        {steps.map((step, index) => (
          <TransactionStep key={index} currentStep={currentStep} index={index} step={step} />
        ))}
      </div>
    </div>
  );
}
