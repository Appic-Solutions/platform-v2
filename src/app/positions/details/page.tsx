'use client';
import React, { useEffect } from 'react';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from '@/components/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSharedStore } from '@/store/store';
import AddLiquidity from './_components/add-liquidity';
import RemoveLiquidity from './_components/remove-liquidity';
import CollectFees from './_components/collect-fees';
import Details from './_components/Details';
import { usePositionDetailsStore } from '../_store/usePositionDetailsStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPositionsByOwner } from '@/blockchain_api/functions/icp/dex/get_positions';
import { queryKeys } from '@/lib/constants/query-keys';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';

const PositionDetails = () => {
  const { currentStep, actions, selectedPosition } = usePositionDetailsStore();
  const { icpIdentity, icpTokens, unAuthenticatedAgent } = useSharedStore();
  const queryClient = useQueryClient();
  const icpPools = queryClient.getQueryData(queryKeys.icpPools) as Pool[];
  const router = useRouter();

  const pathname = usePathname();

  const { isPending, data: positionsData } = useQuery({
    queryKey: ['fetch-details-positions'],
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
    if (
      positionsData &&
      positionsData.success &&
      positionsData.result &&
      icpTokens &&
      icpIdentity
    ) {
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
      // TODO: Find the position with a unique position key
      // currently handle with some parameters that I don't sure about them
      const updatedPosition = formattedPositionsArray.find(
        (position) =>
          position.key.tick_lower === selectedPosition?.key.tick_lower &&
          position.key.tick_upper === selectedPosition?.key.tick_upper &&
          position.key.pool.fee === selectedPosition?.key.pool.fee &&
          position.key.pool.token1.toText() === selectedPosition?.key.pool.token1.toText() &&
          position.key.pool.token0.toText() === selectedPosition?.key.pool.token0.toText() &&
          position.key.pool.token1.toText() === selectedPosition?.key.pool.token1.toText(),
      );
      actions.setUserPositionsList(formattedPositionsArray);
    }
  }, [positionsData]);

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
