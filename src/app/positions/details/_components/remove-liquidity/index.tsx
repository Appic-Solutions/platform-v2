import React, { useState } from 'react';
import RemoveLiquidityStepOne from './step-one';
import RemoveLiquidityStepTwo from './step-two';
import BigNumber from 'bignumber.js';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';

export interface TokensRemoveAmount {
  token0: BigNumber;
  token1: BigNumber;
}

const RemoveLiquidity = () => {
  const { selectedPosition } = usePositionDetailsStore();
  const [percentValue, setPercentValue] = useState('0%');
  const [step, setStep] = useState(1);

  const [tokensRemoveAmount, setTokensRemoveAmount] = useState<TokensRemoveAmount>({
    token0: new BigNumber(0),
    token1: new BigNumber(0),
  });

  const onNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      submitHandler;
    }
  };

  if (!selectedPosition) return null;

  const submitHandler = () => {
    console.log('submit');
  };

  return (
    <div className="flex w-full animate-fade flex-col gap-6">
      {step === 1 ? (
        <RemoveLiquidityStepOne
          onNext={() => setStep(2)}
          tokensRemoveAmount={tokensRemoveAmount}
          setTokensRemoveAmount={setTokensRemoveAmount}
          position={selectedPosition}
          setPercentValue={setPercentValue}
          percentValue={percentValue}
        />
      ) : (
        <RemoveLiquidityStepTwo
          percentValue={percentValue}
          position={selectedPosition}
          tokensRemoveAmount={tokensRemoveAmount}
        />
      )}
    </div>
  );
};

export default RemoveLiquidity;
