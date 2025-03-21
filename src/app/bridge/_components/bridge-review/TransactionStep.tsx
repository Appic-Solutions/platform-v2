'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { TxStep } from '../../_api/types';
import { TxStepType, useBridgeStore } from '../../_store';
import { getChainLogo } from '@/lib/utils';
import HistoryIcon from '@/components/icons/history';
import { useRouter } from 'next/navigation';

export const TransactionStep = ({
  currentStep,
  step,
  index,
  steps,
  onResetTransaction,
}: {
  step: TxStep;
  currentStep: TxStepType;
  index: number;
  steps: TxStep[];
  onResetTransaction: () => void;
}) => {
  const { txErrorMessage, fromToken, toToken } = useBridgeStore();
  const router = useRouter();
  const getLogoHandler = () => {
    // withdrawal tx
    if (steps.length === 4) {
      if (currentStep.count < 2) return getChainLogo(fromToken?.chainId);
      return getChainLogo(toToken?.chainId);
    }
    // deposit tx
    if (steps.length === 5) {
      if (currentStep.count < 3) return getChainLogo(fromToken?.chainId);
      return getChainLogo(toToken?.chainId);
    }
  };

  const onNavigateToHistory = () => {
    onResetTransaction();
    router.push('/transactions-history/bridge');
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        'duration-500 ease-in-out w-64',
        'md:animate-slide-in-from-right',
        'animate-slide-in-from-top',
        index === currentStep.count - 1
          ? 'opacity-100'
          : index === currentStep.count && currentStep.status === 'pending'
            ? 'opacity-50 select-none'
            : 'hidden',
      )}
    >
      <div className="text-lg font-bold text-[#333333] dark:text-white">{step.title}</div>
      <div
        className={cn(
          'flex items-center justify-center w-[90px] h-[90px] relative rounded-full',
          currentStep.count === index + 1 && currentStep.status === 'failed'
            ? 'border-2 border-red-500'
            : currentStep.count === index + 1 && currentStep.status === 'successful'
              ? 'border-2 border-green-500'
              : '',
        )}
      >
        {/* steps status before last step */}
        {currentStep.count === index + 1 && currentStep.status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[86px] h-[85px] border-[3px] border-t-transparent border-green-600 rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={getLogoHandler() || '/images/logo/chains-logos/ethereum.svg'}
          alt={step.title}
          height={80}
          width={80}
          className="object-contain"
        />
      </div>
      {currentStep.status && (
        <div className="flex flex-col gap-y-2">
          <p className="text-lg font-bold text-[#333333] dark:text-white">
            {' '}
            {step.statuses[currentStep.status].statusTitle}
          </p>
          <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
            {step.statuses[currentStep.status].description}
          </p>
          <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">{txErrorMessage}</p>
        </div>
      )}
      {((fromToken?.chain_type === 'ICP' && currentStep.count === 4) ||
        (fromToken?.chain_type === 'EVM' && currentStep.count === 5)) && (
          <>
            <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F] pb-2">
              You can safely close this window
            </p>
            <button
              onClick={onNavigateToHistory}
              className="bg-card-background flex items-center gap-2 shadow-lg hover:opacity-90 hover:shadow-md transition-all text-primary border p-2 rounded-lg border-gray-200"
            >
              <HistoryIcon width={20} height={20} />
              Check History
            </button>
          </>
        )}
    </div>
  );
};
