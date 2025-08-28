'use client';

import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { addLiquidityStepsDetails } from '@/lib/constants/positions';
import { useState } from 'react';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import {
  generate_args_and_approve_add_liquidity,
  increase_liquidity,
} from '@/blockchain_api/functions/icp/dex/tx/add_liquidity';
import { PositionStepper } from '@/app/positions/details/_components/position-stepper';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function AddLiquidityStepTwo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFreshRequest, setIsFreshRequest] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    token0DepositAmount,
    token1DepositAmount,
    selectedPosition: position,
    actions,
    mintStep,
  } = usePositionDetailsStore();

  const { authenticatedAgent, unAuthenticatedAgent, icpIdentity } = useSharedStore();
  const { setIcpBalance } = useSharedStoreActions();
  if (!position) {
    router.push('/positions');
    return null;
  }

  const addLiquidityHandler = async () => {
    if (authenticatedAgent && unAuthenticatedAgent && icpIdentity) {
      // step1
      const increaseLiquidityArgs = await generate_args_and_approve_add_liquidity(
        {
          amount0_max: token0DepositAmount,
          amount1_max: token1DepositAmount,
          position: position,
          token0: position.token0,
          token1: position.token1,
        },
        authenticatedAgent,
        unAuthenticatedAgent,
      );

      if (!increaseLiquidityArgs || !increaseLiquidityArgs.success) {
        actions.setMintStep({
          step: 1,
          status: 'failed',
          errorMessage: null,
        });
        return increaseLiquidityArgs;
      }

      actions.setMintStep({
        step: 2,
        status: 'pending',
        errorMessage: null,
      });

      if (increaseLiquidityArgs.result) {
        const { amount0_max, amount1_max, from_subaccount, pool, tick_lower, tick_upper } =
          increaseLiquidityArgs.result;
        // step2
        const result = await increase_liquidity(
          { pool, tick_lower, tick_upper, amount1_max, from_subaccount, amount0_max },
          authenticatedAgent,
        );

        if (!result.success) {
          actions.setMintStep({
            step: 2,
            status: 'failed',
            errorMessage: result.message,
          });
          return result.message;
        }
        actions.setMintStep({
          step: 2,
          status: 'successful',
          errorMessage: null,
        });
        queryClient.invalidateQueries({ queryKey: ['fetch-icp-balances'] });
      }
    }
  };

  const openModalHandler = () => {
    setIsOpen(true);
    if (isFreshRequest) {
      setIsFreshRequest(false);
      addLiquidityHandler();
    }
  };

  const onCloseModal = () => {
    if (mintStep.step === 2) {
      if (mintStep.status === 'successful') {
        actions.resetTxState();
        router.push('/positions');
        actions.setInitialState();
      } else if (mintStep.status === 'failed') {
        setIsFreshRequest(true);
        actions.resetTxState();
        setIsOpen(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  const token0TotalAmount =
    Number(position.token0_reserves || 0) + Number(token0DepositAmount || 0);
  const token1TotalAmount =
    Number(position.token1_reserves || 0) + Number(token1DepositAmount || 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div className="flex h-full w-full animate-fade flex-col gap-6">
        <SolidCard>
          <div className="flex w-full items-center justify-between">
            <div className="flex h-full w-2/3 flex-col justify-between text-lg font-semibold lg:text-xl">
              {token0TotalAmount}
              <p className="text-md text-[#FFFFFF7A] lg:text-lg">
                ${(token0TotalAmount * Number(position.token0.usdPrice || 0)).toFixed(2)}
              </p>
            </div>
            {/* logo */}
            <div className="relative flex w-max items-center gap-x-1.5">
              <Avatar src={position.token0.logo} className="h-8 w-8 md:h-12 md:w-12" />
              <p className="text-sm font-semibold text-white md:text-xl">
                {position.token0.symbol}
              </p>
            </div>
          </div>
        </SolidCard>
        <SolidCard>
          <div className="flex w-full items-center justify-between">
            <div className="flex h-full w-2/3 flex-col justify-between text-lg font-semibold lg:text-xl">
              {token1TotalAmount}
              <p className="text-md text-[#FFFFFF7A] lg:text-lg">
                ${(token1TotalAmount * Number(position.token1.usdPrice || 0)).toFixed(2)}
              </p>
            </div>
            {/* logo */}
            <div className="relative flex w-max items-center gap-x-1.5">
              <Avatar src={position.token1.logo} className="h-8 w-8 md:h-12 md:w-12" />
              <p className="text-sm font-semibold text-white md:text-xl">
                {position.token1.symbol}
              </p>
            </div>
          </div>
        </SolidCard>
        <div className="flex h-[40px] w-full items-center justify-center gap-x-3 self-end lg:h-[52px]">
          <button
            onClick={() => actions.setCurrentStep('positionDetail')}
            type="button"
            className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={openModalHandler}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
          >
            Continue
          </button>
        </div>
      </div>
      <DialogTitle className="hidden" />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          <PositionStepper
            title="Add Liquidity"
            onCloseModal={onCloseModal}
            steps={addLiquidityStepsDetails}
          />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
