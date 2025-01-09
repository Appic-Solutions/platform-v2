'use client';
import { useEffect, useState } from 'react';
import { TransactionStep } from './TransactionStep';
import { TxStep } from '../../_api/types';

export type Status = 'failed' | 'successful' | 'pending' | undefined;

export default function BridgeTransactionStepper({
  steps,
  currentStep = 1,
  status,
}: {
  steps: TxStep[];
  currentStep?: number;
  status: Status;
}) {
  const [prevStep, setPrevStep] = useState(currentStep);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (currentStep !== prevStep) {
      setAnimationDirection(currentStep > prevStep ? 'left' : 'right');
      setPrevStep(currentStep);
    }
  }, [currentStep, prevStep]);

  return (
    <div className="w-full max-w-[691px] justify-start gap-y-9">
      <div className="text-center text-lg font-bold text-[#333333] dark:text-white">Bridge Transaction</div>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:gap-x-16 gap-y-16 py-5">
        {steps.map((step, index) => (
          <TransactionStep
            key={index}
            animationDirection={animationDirection}
            currentStep={currentStep}
            index={index}
            step={step}
            status={status}
          />
        ))}
      </div>
    </div>
  );
}
