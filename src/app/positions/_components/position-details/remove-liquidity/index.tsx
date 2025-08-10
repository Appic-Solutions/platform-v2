import React, { useState } from 'react';
import RemoveLiquidityStepOne from './step-one';
import RemoveLiquidityStepTwo from './step-two';
import { FormattedPosition, Step } from '@/app/positions/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ArrowLeftIcon from '@/components/icons/arrow-left';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import BigNumber from 'bignumber.js';

interface RemoveLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

export interface TokensRemoveAmount {
  token0: BigNumber;
  token1: BigNumber;
}

const RemoveLiquidity = ({ position, setCurrentStep }: RemoveLiquidityProps) => {
  const [percentValue, setPercentValue] = useState('0%');
  const [step, setStep] = useState(1);
  const [tokensReservesAfterRemove, setTokensReservesAfterRemove] = useState({
    token0: position.token0_reserves,
    token1: position.token1_reserves,
  });
  const [tokensRemoveAmount, setTokensRemoveAmount] = useState<TokensRemoveAmount>({
    token0: new BigNumber(0),
    token1: new BigNumber(0),
  });

  const onBack = () => {
    if (step === 1) {
      setCurrentStep('positionDetail');
    } else {
      setStep(1);
    }
  };

  const onNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      submitHandler;
    }
  };

  const submitHandler = () => {
    console.log('submit');
  };

  return (
    <div className="flex w-full animate-fade flex-col gap-6">
      {step === 1 ? (
        <RemoveLiquidityStepOne
          setTokensRemoveAmount={setTokensRemoveAmount}
          position={position}
          setPercentValue={setPercentValue}
          percentValue={percentValue}
        />
      ) : (
        <RemoveLiquidityStepTwo position={position} tokensRemoveAmount={tokensRemoveAmount} />
      )}
      {/* balance */}
      <SolidCard className="bg-transparent lg:bg-[#222222]">
        <div className={cn('flex flex-col gap-y-3', 'w-full')}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token0.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {BigNumber(position.token0_reserves)
                .minus(tokensRemoveAmount.token0)
                .toString()
                .replace(/\.?0+$/, '')}{' '}
              {position.token0.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token1.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {BigNumber(position.token0_reserves)
                .minus(tokensRemoveAmount.token0)
                .toString()
                .replace(/\.?0+$/, '')}{' '}
              {position.token1.symbol}
            </div>
          </div>
        </div>
      </SolidCard>
      {/* Action Button */}
      <div
        className={cn(
          'flex h-[40px] w-full items-center justify-center gap-x-3 self-end lg:h-[52px]',
        )}
      >
        <button
          onClick={onBack}
          className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
        >
          Cancel
        </button>
        <button
          disabled={!percentValue || percentValue === '0%'}
          onClick={onNext}
          className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
