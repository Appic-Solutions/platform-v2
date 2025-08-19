'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { TxStep } from '../../_api/types';
import { TxStepType, useSwapStore } from '../../_store';
import { getChainLogo } from '@/lib/utils';
import HistoryIcon from '@/components/icons/history';
import { useRouter } from 'next/navigation';

export const TransactionStep = ({
  currentStep,
  step,
  index,
}: {
  step: TxStep;
  currentStep: TxStepType;
  index: number;
}) => {
  const { txErrorMessage, tokenIn, tokenOut, actions, txStep } = useSwapStore();
  const router = useRouter();
  const getLogoHandler = () => {
    // withdrawal tx
    // TODO: fix this condition for ICP to evm or evm to ICP
    // if (steps.length === 4) {
    //   if (currentStep.count < 2) return getChainLogo(tokenIn?.chainId);
    //   return getChainLogo(tokenOut?.chainId);
    // }
    // deposit tx
    if (tokenIn?.chain_type === 'ICP' && tokenOut?.chain_type === 'ICP') {
      if (currentStep.count < 3) return getChainLogo(tokenIn?.chainId);
      return getChainLogo(tokenOut?.chainId);
    }
  };

  const onNavigateToHistory = () => {
    actions.setTxStep({ count: 1, status: 'pending' });
    actions.setPrevTxStep({
      count: 0,
      status: 'pending',
    });
    router.push('/transactions-history/bridge');
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        'w-64 duration-500 ease-in-out',
        'md:animate-slide-in-from-right',
        'animate-slide-in-from-top',
        index === currentStep.count - 1
          ? 'opacity-100'
          : index === currentStep.count && currentStep.status === 'pending'
            ? 'select-none opacity-50'
            : 'hidden',
      )}
    >
      <div className="text-lg font-bold text-[#333333] dark:text-white">{step.title}</div>
      <div
        className={cn(
          'relative flex h-[90px] w-[90px] items-center justify-center rounded-full',
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
            <div className="h-[85px] w-[86px] animate-spin rounded-full border-[3px] border-green-600 border-t-transparent" />
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
          <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
            {txErrorMessage}
          </p>
        </div>
      )}
      {txStep.count === 2 && txStep.status === 'successful' && (
        <>
          <p className="pb-2 text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
            You can safely close this window
          </p>
          <button
            onClick={onNavigateToHistory}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-card-background p-2 text-primary shadow-lg transition-all hover:opacity-90 hover:shadow-md"
          >
            <HistoryIcon width={20} height={20} />
            Check History
          </button>
        </>
      )}
    </div>
  );
};
