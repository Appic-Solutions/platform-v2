'use client';

import { FormProvider, useForm } from 'react-hook-form';

import CreatePositionStepOne from './_components/step-one';
import CreatePositionStepTwo from './_components/step-two';
import CreatePoolStepThree from './_components/step-three';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import StepNavigator from './_components/StepNavigator';
import { useCreatePoolStore, useCreatePoolStoreActions } from './useCreatePoolStore';
import { CreatePoolFormSchema, type CreatePoolFormDefaultValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useSharedStore } from '@/store/store';
import { FEE_TIERS, FEE_TIERS_DESC_MAP } from '@/blockchain_api/functions/icp/dex/constants';
import { Principal } from '@dfinity/principal';
import { sortTokens } from '@/blockchain_api/functions/icp/dex/utils/token_order';
export default function CreatePoolPage() {
  const methods = useForm<CreatePoolFormDefaultValues>({
    defaultValues: {
      searchTokenQuery: '',
      fee: 3000,
      tickSpacing: undefined,
      sqrtPriceX96: '',
      initialPrice: '',
      token0: undefined,
      token1: undefined,
      minPrice: '0',
      maxPrice: 'max',
      minTick: undefined,
      maxTick: undefined,
      token0DepositAmount: '',
      token1DepositAmount: '',
    },
    resolver: zodResolver(CreatePoolFormSchema),
    mode: 'onChange',
  });

  const submitHandler = (data: CreatePoolFormDefaultValues) => {
    console.log(data);
  };

  useEffect(() => {
    useCreatePoolStore.setState({ methods });
  }, [methods]);

  const { setFeeTiers, setMethods, feeManuallySelected, getTickSpacingHandler } =
    useCreatePoolStoreActions();
  const { step } = useCreatePoolStore();

  const pools = useSharedStore((state) => state.pools);

  const token0 = methods.watch('token0');
  const token1 = methods.watch('token1');

  React.useEffect(() => {
    setMethods(methods);
  }, [methods, setMethods]);

  useEffect(() => {
    if (!token0 || !token1 || !token0.canisterId || !token1.canisterId) return;

    const { token0: sortedToken0, token1: sortedToken1 } = sortTokens(token0, token1);

    if (
      sortedToken0.canisterId !== token0.canisterId ||
      sortedToken1.canisterId !== token1.canisterId
    ) {
      methods.setValue('token0', sortedToken0);
      methods.setValue('token1', sortedToken1);
    }

    const feeTiersList = FEE_TIERS.map((fee) => ({
      fee: BigInt(fee),
      token0: Principal.fromText(sortedToken0.canisterId),
      token1: Principal.fromText(sortedToken1.canisterId),
      tvl: '0',
      desc: FEE_TIERS_DESC_MAP.get(fee) || 'Best for very stable pairs.',
      isExist: false,
    }));

    const updatedFeeTiers = feeTiersList.map((feeTier) => {
      const matchingPool = pools?.find(
        (pool) =>
          pool.pool_id.fee === feeTier.fee &&
          pool.pool_id.token0.toText() === feeTier.token0.toText() &&
          pool.pool_id.token1.toText() === feeTier.token1.toText(),
      );

      return {
        ...feeTier,
        isExist: Boolean(matchingPool),
        tvl: matchingPool?.tvl_usd || '0',
      };
    });

    setFeeTiers(updatedFeeTiers);

    if (!feeManuallySelected.current && updatedFeeTiers.length > 0) {
      const feeTiersWithTvl = updatedFeeTiers
        .map((tier) => ({
          ...tier,
          numericTvl: parseFloat(tier.tvl) || 0,
        }))
        .filter((tier) => tier.numericTvl > 0);

      if (feeTiersWithTvl.length > 0) {
        feeTiersWithTvl.sort((a, b) => b.numericTvl - a.numericTvl);
        const highestTvlFee = feeTiersWithTvl[0].fee;
        methods.setValue('fee', Number(highestTvlFee));
      }
    }

    getTickSpacingHandler(methods.getValues('fee'));

    feeManuallySelected.current = false;
  }, [token0, token1, pools, methods, setFeeTiers, getTickSpacingHandler, feeManuallySelected]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitHandler)}
        className="flex h-full w-full items-center justify-center"
      >
        <Box
          className={cn(
            'text-white transition-all md:p-12 lg:overflow-visible lg:text-black lg:dark:text-white',
            step === 1 ? 'md:h-[789px] lg:w-[1204px]' : 'lg:h-[716px] lg:w-[611px]',
          )}
        >
          {step < 2 && <StepNavigator />}
          {step === 0 ? (
            <CreatePositionStepOne />
          ) : step === 1 ? (
            <CreatePositionStepTwo />
          ) : (
            <CreatePoolStepThree />
          )}
        </Box>
      </form>
    </FormProvider>
  );
}
