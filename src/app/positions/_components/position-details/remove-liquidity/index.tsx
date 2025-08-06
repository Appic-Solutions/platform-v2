import React, { useState } from 'react';
import RemoveLiquidityStepOne from './step-one';
import RemoveLiquidityStepTwo from './step-two';
import { FormattedPosition, Step } from '@/app/positions/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ArrowLeftIcon from '@/components/icons/arrow-left';

interface RemoveLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

const RemoveLiquidity = ({ position, setCurrentStep }: RemoveLiquidityProps) => {
  const [step, setStep] = useState(1);
  const onBack = () => {
    if (step === 1) {
      setCurrentStep('positionDetail');
    } else {
      setStep(1);
    }
  };
  return (
    <div className="w-full animate-fade">
      {/* Header */}
      <div className="relative isolate mb-10 flex w-full items-center justify-between gap-4">
        <ArrowLeftIcon onClick={onBack} className="z-10 hidden cursor-pointer md:inline-block" />
        <h1 className="text-2xl font-bold md:absolute md:inset-x-0 md:text-center md:text-3xl">
          Remove liquidity
        </h1>
        <button
          className={cn(
            'px-2.5 py-0.5',
            'rounded-md',
            'bg-white/10',
            'text-xs font-medium text-white/60',
            'z-10',
          )}
        >
          <Link href="https://t.me/Appic_dao">Get help</Link>
        </button>
      </div>
      {step === 1 ? (
        <RemoveLiquidityStepOne onNext={() => setStep(2)} onBack={onBack} position={position} />
      ) : (
        <RemoveLiquidityStepTwo onBack={onBack} position={position} />
      )}
    </div>
  );
};

export default RemoveLiquidity;
