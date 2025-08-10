import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
  onBack: () => void;
  step: string;
}

const PositionDetailsHeader = ({ onBack, step }: Props) => {
  return (
    <div className="relative isolate flex w-full items-center justify-between gap-4">
      <ArrowLeftIcon onClick={onBack} className="z-10 hidden cursor-pointer md:inline-block" />
      <h1 className="text-2xl font-bold md:absolute md:inset-x-0 md:text-center md:text-3xl">
        {step === 'addLiquidity'
          ? 'Add Liquidity'
          : step === 'collectFees'
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
  );
};

export default PositionDetailsHeader;
