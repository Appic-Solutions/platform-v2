import { useState } from 'react';
import { FormattedPosition, Step } from '@/app/positions/types';
import AddLiquidityStepOne from './step-one';
import AddLiquidityStepTwo from './step-two';

export default function AddLiquidity() {
  const [step, setStep] = useState<number>(1);

  return (
    <div className="flex h-full w-full animate-fade flex-col gap-6">
      {step === 1 && <AddLiquidityStepOne onNext={() => setStep(2)} />}

      {step === 2 && <AddLiquidityStepTwo />}
    </div>
  );
}
