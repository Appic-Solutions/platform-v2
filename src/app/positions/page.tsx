'use client';
import React, { useEffect } from 'react';
import { useSharedStore } from '@/store/store';
import { usePositionDetailsStore } from './_store/usePositionDetailsStore';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PlusIcon, PoolIcon } from '@/components/icons';
import { useAuth } from '@nfid/identitykit/react';
import Image from 'next/image';
import PositionCard from './_components/PositionCard';
import Spinner from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { getPositionsByOwner } from '@/blockchain_api/functions/icp/dex/get_positions';
import { usePathname } from 'next/navigation';
import { queryKeys } from '@/lib/constants/query-keys';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';

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

export default function PositionsPage() {
  const { icpIdentity, unAuthenticatedAgent } = useSharedStore();
  const { actions, userPositionsList } = usePositionDetailsStore();
  const pathname = usePathname();
  const icpPools = useTypedQueryData(queryKeys.icpPools);
  const icpTokens = useTypedQueryData(queryKeys.icpTokens);

  const { isPending, data: positionsData } = useQuery({
    queryKey: [queryKeys.positions],
    queryFn: () =>
      getPositionsByOwner({
        icpTokens: icpTokens!,
        pools: icpPools!,
        owner: icpIdentity!,
        unAuthenticatedAgent: unAuthenticatedAgent!,
      }),
    refetchInterval: 1000 * 30,
    staleTime: 0,
    gcTime: 1000 * 60,
    enabled:
      !!icpIdentity &&
      !!unAuthenticatedAgent &&
      !!icpPools &&
      !!icpTokens &&
      (pathname === '/positions' || pathname === '/positions/details'),
  });

  useEffect(() => {
    if (positionsData && positionsData.success && positionsData.result && icpTokens) {
      const formattedPositionsArray = positionsData.result.map((position) => {
        const positionToken0 = icpTokens.find(
          (token) => token.canisterId === position.key.pool.token0.toString(),
        );
        const positionToken1 = icpTokens.find(
          (token) => token.canisterId === position.key.pool.token1.toString(),
        );
        return {
          ...position,
          token0: positionToken0!,
          token1: positionToken1!,
        };
      });
      actions.setUserPositionsList(formattedPositionsArray);
    }
  }, [positionsData]);

  return (
    <Box
      className={cn(
        'h-max text-white transition-all md:max-h-[570px] md:max-w-[537px] md:text-black md:dark:text-white',
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
            'overflow-y-auto md:max-h-[290px]',
          )}
        >
          {!icpIdentity ? (
            <NeedConnectWallet />
          ) : isPending ? (
            <Spinner className="my-16" />
          ) : !userPositionsList || !userPositionsList.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-lg font-semibold lg:text-xl">No positions</p>
              <p className="text-center text-sm text-muted lg:text-base">
                Looks like you haven’t added any liquidity yet. Create a position to start earning
                rewards and fees!
              </p>
            </div>
          ) : userPositionsList?.length ? (
            userPositionsList.map((position) => (
              <PositionCard
                onSelectHandler={(position) => actions.setSelectedPosition(position)}
                key={position.liquidity}
                position={position}
              />
            ))
          ) : null}
        </div>
      </div>
    </Box>
  );
}
