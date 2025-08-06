import React from 'react';
import Link from 'next/link';
import { PlusIcon, PoolIcon } from '@/components/icons';
import PositionCard from '../_components/PositionCard';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Box from '@/components/ui/box';
import { FormattedPosition } from '../types';

interface YourPositionsProps {
  formattedPositions: FormattedPosition[] | undefined;
  onSelectHandler: (position: FormattedPosition) => void;
  selectedPosition: FormattedPosition | undefined;
  error:
    | {
        text: string;
        type: 'walletConnection' | 'network';
      }
    | undefined;
}

const NeedConnectWallet = ({ title, description }: { title: string; description: string }) => {
  return (
    <div
      className={cn(
        'm-auto flex flex-col items-center justify-center gap-y-5',
        'h-full max-w-[490px] px-6 text-center text-white',
      )}
    >
      <Image src="/images/wallet.svg" alt="wallet-Image" width={210} height={210} quality={100} />
      <p className="text-xl">{title}</p>
      <p className="mb-24 text-sm leading-6">{description}</p>
    </div>
  );
};

const YourPositions = ({ formattedPositions, onSelectHandler, error }: YourPositionsProps) => {
  console.log('formattedPositions', formattedPositions);
  return (
    <Box
      className={cn(
        'h-max text-white transition-all md:max-h-[570px] md:w-[490px] md:text-black md:dark:text-white',
      )}
    >
      <div className="w-full animate-fade">
        {/* Header */}
        <div className={cn('mb-8 flex items-center justify-between gap-4', 'w-full')}>
          <h1 className="text-2xl font-semibold md:text-3xl">Your positions</h1>
          <Link
            href="/positions/create"
            className={cn(
              'flex items-center justify-center font-semibold',
              'text-[13px] font-medium md:text-[15px]',
              'rounded-lg p-2.5',
              'bg-primary-buttons',
            )}
          >
            <PlusIcon className="h-[14px] w-[14px] md:h-[17px] md:w-[17px]" />
            Create position
          </Link>
        </div>

        <div
          className={cn(
            'relative isolate',
            'flex w-full flex-col gap-2.5',
            'mb-8 p-4 md:p-6',
            'bg-gradient-to-b from-[#1D55BF]/30 to-[#000000]/30',
            'rounded-2xl md:rounded-3xl',
            'border border-[#4982EF]/40',
          )}
        >
          <div className="flex items-center gap-x-1.5">
            <PoolIcon width={24} height={24} />
            <p className="text-lg font-medium md:text-xl">Welcome to your positions</p>
          </div>
          <p className="text-sm text-white/75 md:text-[15px]">
            Connect your wallet to view your current positions.
          </p>
        </div>

        <div
          className={cn(
            'flex h-full w-full flex-1 flex-col gap-3',
            'pt-3',
            'border-t border-white/20',
            'max-h-[290px] overflow-y-auto',
          )}
        >
          {formattedPositions?.length ? (
            formattedPositions.map((position) => (
              <PositionCard
                onSelectHandler={onSelectHandler}
                key={position.liquidity}
                position={position}
              />
            ))
          ) : error && error.type === 'walletConnection' ? (
            <NeedConnectWallet title={error.text} description="" />
          ) : error && error.type === 'network' ? (
            <p className="w-full text-center">{error.text}</p>
          ) : (
            <Spinner className="my-16" />
          )}
        </div>
      </div>
    </Box>
  );
};

export default YourPositions;
