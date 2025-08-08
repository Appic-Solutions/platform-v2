'use client';

import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import { useWatch } from 'react-hook-form';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import AvatarGroup from '@/app/positions/_components/AvatarGroup';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import CreatePositionStepper from './create-position-stepper';
import { createPositionStepsDetails } from '@/lib/constants/positions';
import { useSharedStore } from '@/store/store';
import { Principal } from '@dfinity/principal';

export default function CreatePositionStepThree() {
  const { isToken0Selected, createPositionForm, setStep, executeMintPosition, existPool } =
    useCreatePosition();
  const [isOpen, setIsOpen] = useState(false);
  const { authenticatedAgent, unAuthenticatedAgent } = useSharedStore();

  const [
    token0,
    token1,
    fee,
    minPrice,
    maxPrice,
    token0DepositAmount,
    token1DepositAmount,
    isToken0DepositAmountActive,
    isToken1DepositAmountActive,
    maxTick,
    minTick,
    sqrtPriceX96,
  ] = useWatch({
    control: createPositionForm.control,
    name: [
      'token0',
      'token1',
      'fee',
      'minPrice',
      'maxPrice',
      'token0DepositAmount',
      'token1DepositAmount',
      'isToken0DepositAmountActive',
      'isToken1DepositAmountActive',
      'maxTick',
      'minTick',
      'sqrtPriceX96',
    ],
  });

  const token0DepositAmountInUsd = parseFloat(token0DepositAmount) * parseFloat(token0.usdPrice);
  const token1DepositAmountInUsd = parseFloat(token1DepositAmount) * parseFloat(token1.usdPrice);

  const openModalHandler = () => {
    setIsOpen(true);
    if (authenticatedAgent && unAuthenticatedAgent) {
      executeMintPosition({
        amount0_max: token0DepositAmount,
        amount1_max: token1DepositAmount,
        authenticatedAgent,
        max_tick: maxTick,
        mint_tick: minTick,
        pool_exists: !!existPool,
        sqrt_price_x96: sqrtPriceX96,
        pool_id: existPool
          ? existPool.pool_id
          : {
              fee: BigInt(fee),
              token0: Principal.fromText(token0.canisterId),
              token1: Principal.fromText(token1.canisterId),
            },
        token0,
        token1,
        unAuthenticatedAgent,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      {/* review card */}
      <div className="flex h-full w-full animate-fade flex-col gap-5">
        {/* header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 lg:gap-4">
            <AvatarGroup avatar0={token0.logo} avatar1={token1.logo} />
            <h3 className="text-2xl font-semibold lg:text-3xl">
              {token0.symbol}/{token1.symbol}
            </h3>
          </div>
          <div className="flex items-center gap-x-1">
            <SolidCard size="sm">
              <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
            </SolidCard>
          </div>
        </div>

        <div className="flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
          <SolidCard>
            <p className="mb-2 font-medium text-white/70 md:text-lg">Min price</p>
            <p className="text-nowrap text-xl font-semibold text-white">
              {minPrice === 'min' ? '0' : Number(minPrice).toFixed(6)}
            </p>
            <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
              {isToken0Selected ? token0.symbol : token1.symbol}/
              {isToken0Selected ? token1.symbol : token0.symbol}
            </p>
          </SolidCard>
          <SolidCard>
            <p className="mb-2 font-medium text-white/70 md:text-lg">Max price</p>
            <p className="text-nowrap text-xl font-semibold text-white">
              {maxPrice === 'max' ? '∞' : Number(maxPrice).toFixed(6)}
            </p>
            <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
              {isToken0Selected ? token0.symbol : token1.symbol}/
              {isToken0Selected ? token1.symbol : token0.symbol}
            </p>
          </SolidCard>
        </div>

        <div
          className={cn(
            'flex flex-col gap-y-3.5',
            'bg-[#222222]',
            'rounded-[21px]',
            'px-6 py-5 md:px-8 md:py-6',
            'w-full',
          )}
        >
          <p className="font-bold text-white md:text-xl">Position Amounts</p>
          {isToken0DepositAmountActive && (
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 font-semibold">
                <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
                <p className="text-white md:text-lg">
                  {token0DepositAmount} {token0.symbol}
                </p>
                <p className="text-xs text-white/50">
                  ${Number(token0DepositAmountInUsd).toFixed(2)}
                </p>
              </div>
              <div
                className={cn(
                  'relative',
                  'flex items-center gap-x-2',
                  'font-semibold text-white md:text-xl',
                )}
              >
                <Avatar src={token0.logo} className="h-6 w-6 md:h-7 md:w-7" />
                {token0.symbol}
              </div>
            </div>
          )}
          {isToken1DepositAmountActive && (
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 font-semibold">
                <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
                <p className="text-white md:text-lg">
                  {token1DepositAmount} {token1.symbol}
                </p>
                <p className="text-xs text-white/50">${token1DepositAmountInUsd.toFixed(2)}</p>
              </div>
              <div
                className={cn(
                  'relative',
                  'flex items-center gap-x-2',
                  'font-semibold text-white md:text-xl',
                )}
              >
                <Avatar src={token1.logo} className="h-6 w-6 md:h-7 md:w-7" />
                {token1.symbol}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div
          className={cn(
            'flex h-[40px] items-center justify-center gap-x-3 self-end lg:h-[52px]',
            'mt-3 w-full',
          )}
        >
          <button
            onClick={() => setStep(1)}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
          >
            Cancel
          </button>
          <DialogTrigger
            className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
            onClick={openModalHandler}
          >
            Continue
          </DialogTrigger>
        </div>
      </div>
      <DialogTitle />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          <CreatePositionStepper
            onCloseModal={() => setIsOpen(false)}
            steps={createPositionStepsDetails}
          />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
