'use client';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PlusIcon, PoolIcon } from '@/components/icons';
import { useSharedStore } from '@/store/store';
import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';
import PositionCard from './_components/PositionCard';
import { useGetPositions } from './_api';
import Spinner from '@/components/ui/spinner';
import { usePoolStore } from './_store';

export default function PositionsPage() {
  const { icpTokens, pools, unAuthenticatedAgent } = useSharedStore();
  const { mutateAsync: getPositions, isPending, isError, data: positionsData } = useGetPositions();
  const { actions } = usePoolStore();

  useEffect(() => {
    const getPositionsHandler = async () => {
      if (!icpTokens || !pools || !unAuthenticatedAgent) return console.log('no data');
      const res = await getPositions({
        icpTokens,
        pools,
        owner: Principal.fromText(
          '7qi53-mqll3-zmsxo-p4vf5-x3wye-nwsca-oag7a-s4tfq-6htqy-3c3zq-bqe',
        ),
        unAuthenticatedAgent,
      });
      if (res.success && res.result) {
        actions.setPositions(res.result);
      }
    };
    getPositionsHandler();
  }, [icpTokens, pools, unAuthenticatedAgent]);
  return (
    <Box
      className={cn(
        'gap-y-9',
        'md:w-[611px]',
        'md:p-12',
        'text-white md:text-black md:dark:text-white',
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center justify-between gap-4', 'w-full')}>
        <h1 className="text-[27px] font-bold md:text-[30px]">Your positions</h1>
        <Link
          href="/pool/create"
          className={cn(
            'flex items-center justify-center',
            'text-[13px] font-medium md:text-[15px]',
            'rounded-[10px] p-2.5',
            'bg-primary-buttons',
          )}
        >
          <PlusIcon className="h-[14px] w-[14px] md:h-[17px] md:w-[17px]" />
          Create position
        </Link>
      </div>

      {/* Main */}
      <div
        className={cn(
          'relative isolate',
          'flex w-full flex-col gap-2.5',
          'px-6 py-5 md:p-8',
          'bg-gradient-to-b from-[#1D55BF]/30 to-[#000000]/30',
          'rounded-[20px] md:rounded-[30px]',
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
          'flex min-h-20 w-full flex-col gap-3',
          'pt-3',
          'border-t border-white/20',
          'max-h-96 overflow-y-auto',
        )}
      >
        {positionsData?.result && positionsData.result.length > 0 ? (
          positionsData.result?.map((position) => (
            <PositionCard key={position.liquidity} position={position} />
          ))
        ) : positionsData?.result && positionsData.result.length === 0 ? (
          <p>You have not any position</p>
        ) : isError ? (
          <p>Something went wrong</p>
        ) : (
          <Spinner className="my-16" />
        )}
      </div>
    </Box>
  );
}
