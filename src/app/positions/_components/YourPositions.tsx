import React from 'react';
import Link from 'next/link';
import { PlusIcon, PoolIcon } from '@/components/icons';
import PositionCard from '../_components/PositionCard';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Box from '@/components/ui/box';
import { FormattedPosition } from '../types';
import { useAuth } from '@nfid/identitykit/react';
import { useSharedStore } from '@/store/store';

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

const NeedConnectWallet = () => {
  const { connect } = useAuth();
  return (
    <div
      className={cn(
        'm-auto flex flex-col items-center justify-center gap-y-5',
        'h-full max-w-[490px] px-6 text-center text-white',
      )}
    >
      <Image src="/images/wallet.svg" alt="wallet-Image" width={210} height={210} quality={100} />
      <button className="hover:text-blue-500" onClick={() => connect()}>
        Connect Wallet
      </button>
    </div>
  );
};

const YourPositions = ({ formattedPositions, onSelectHandler, error }: YourPositionsProps) => {
  const { icpIdentity, isIcpBalanceLoading } = useSharedStore();
  return (
    <Box
      className={cn(
        'h-max text-white transition-all md:max-h-[570px] md:max-w-[533px] md:text-black md:dark:text-white',
      )}
    >
      <div className="h-full w-full animate-fade">
        {/* Header */}
        <div className="mb-6 flex w-full items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold md:text-3xl">Your positions</h1>
          <Link
            href="/positions/create"
            className={cn(
              'flex items-center justify-center font-semibold',
              'text-[13px] font-medium md:text-sm',
              'rounded-lg p-2.5',
              'h-[42px] bg-primary-buttons',
            )}
          >
            <PlusIcon className="h-[14px] w-[14px] md:h-[17px] md:w-[17px]" />
            Create position
          </Link>
        </div>

        {!icpIdentity && (
          <div
            className={cn(
              'relative isolate',
              'flex w-full flex-col gap-2.5',
              'mb-6 p-4 md:p-6',
              'bg-gradient-to-b from-[#1D55BF]/30 to-[#000000]/30',
              'rounded-2xl md:rounded-3xl',
              'border border-[#4982EF]/40',
            )}
          >
            <div className="flex items-center gap-x-1.5">
              <PoolIcon width={24} height={24} />
              <p className="text-lg font-medium md:text-xl">Welcome to your positions</p>
            </div>
            <p className="text-sm text-white/75">
              Connect your wallet to view your current positions.
            </p>
          </div>
        )}

        <div
          className={cn(
            'flex h-full w-full flex-1 flex-col gap-3',
            'pt-6',
            'border-t border-white/20',
            'max-h-[290px] overflow-y-auto',
          )}
        >
          {!icpIdentity ? (
            <NeedConnectWallet />
          ) : !formattedPositions || !formattedPositions.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-lg font-semibold lg:text-xl">No positions</p>
              <p className="text-center text-sm text-muted lg:text-base">
                Looks like you haven’t added any liquidity yet. Create a position to start earning
                rewards and fees!
              </p>
            </div>
          ) : formattedPositions?.length ? (
            formattedPositions.map((position) => (
              <PositionCard
                onSelectHandler={onSelectHandler}
                key={position.liquidity}
                position={position}
              />
            ))
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
