import { useState } from 'react';
import { FormattedPosition, Step } from '@/app/positions/types';
import AddLiquidityStepOne from './step-one';
import AddLiquidityStepTwo from './step-two';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AddLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

export default function AddLiquidity({ position, setCurrentStep }: AddLiquidityProps) {
  const [step, setStep] = useState<number>(1);

  const onBack = () => {
    if (step === 1) {
      setCurrentStep('positionDetail');
    } else {
      setStep(1);
    }
  };

  return (
    <div className="flex h-full w-full animate-fade flex-col justify-between">
      {/* Header */}
      <div className="relative isolate mb-10 flex w-full items-center justify-between gap-4">
        <ArrowLeftIcon onClick={onBack} className="z-10 hidden cursor-pointer md:inline-block" />
        <h1
          className={cn(
            'text-[27px] font-bold md:text-[30px]',
            'md:absolute md:inset-x-0 md:text-center',
          )}
        >
          Add liquidity
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
        <AddLiquidityStepOne onNext={() => setStep(2)} position={position} onBack={onBack} />
      ) : (
        <AddLiquidityStepTwo position={position} onBack={onBack} />
      )}
    </div>
  );
}
