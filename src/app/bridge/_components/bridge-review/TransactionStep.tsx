import { cn } from '@/common/helpers/utils';
import React from 'react';
import Image from 'next/image';
import { Status } from './TransactionStepper';
import { TxStep } from '../../_api/types';

export const TransactionStep = ({
  currentStep,
  step,
  index,
  status,
}: {
  step: TxStep;
  currentStep: number;
  animationDirection: 'left' | 'right' | null;
  index: number;
  status: Status;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        'duration-500 ease-in-out w-64',
        'md:animate-slide-in-from-right',
        'animate-slide-in-from-top',
        index === currentStep - 1 ? 'opacity-100' : index === currentStep ? 'opacity-50 select-none' : 'hidden',
      )}
    >
      <div className="text-lg font-bold text-[#333333] dark:text-white">{step.title}</div>
      <div className={cn('flex items-center justify-center w-[90px] h-[90px] relative rounded-full')}>
        {currentStep === index + 1 && status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85px] h-[85px] border-2 border-t-transparent border-green-600 rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={step.logo || '/images/logo/chains-logos/ethereum.svg'}
          alt={step.title}
          height={80}
          width={80}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-y-4">
        {status && (
          <>
            <p className="text-lg font-bold text-[#333333] dark:text-white"> {step.statuses[status].statusTitle}</p>
            <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
              {step.statuses[status].description}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
