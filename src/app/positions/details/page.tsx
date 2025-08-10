'use client';
import React from 'react';
import { usePositionDetailsStore } from '../_store/usePositionDetailsStore';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from '@/components/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSharedStore } from '@/store/store';
import AddLiquidity from './_components/add-liquidity';
import RemoveLiquidity from './_components/remove-liquidity';
import CollectFees from './_components/collect-fees';
import Details from './_components/Details';

const PositionDetails = () => {
  const { currentStep, actions, selectedPosition } = usePositionDetailsStore();
  const { icpIdentity } = useSharedStore();
  const router = useRouter();

  if (!selectedPosition || !icpIdentity) {
    router.push('/positions');
    return;
  }

  return (
    <Box
      className={cn(
        'gap-8 text-white transition-all md:overflow-auto md:text-black md:dark:text-white',
        currentStep === 'positionDetail'
          ? 'md:h-[580px] md:w-[965px]'
          : 'md:max-h-[600px] md:w-[533px]',
      )}
    >
      {currentStep !== 'positionDetail' && (
        <div className="relative isolate flex w-full items-center justify-between gap-4">
          <ArrowLeftIcon
            onClick={() => actions.setCurrentStep('positionDetail')}
            className="z-10 hidden cursor-pointer md:inline-block"
          />
          <h1 className="text-2xl font-bold md:absolute md:inset-x-0 md:text-center md:text-3xl">
            {currentStep === 'addLiquidity'
              ? 'Add Liquidity'
              : currentStep === 'collectFees'
                ? 'Collect Fees'
                : 'Remove Liquidity'}
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
      )}
      {currentStep === 'addLiquidity' ? (
        <AddLiquidity />
      ) : currentStep === 'removeLiquidity' ? (
        <RemoveLiquidity />
      ) : currentStep === 'collectFees' ? (
        <CollectFees />
      ) : (
        <Details />
      )}
    </Box>
  );
};

export default PositionDetails;
