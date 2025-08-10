'use client';

import { FormattedPosition } from '@/app/positions/types';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { TokensRemoveAmount } from '.';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { RemoveLiquidityStepper } from './remove-liquidity-stepper';
import { removeLiquidityStepsDetails } from '@/lib/constants/positions';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import { useSharedStore } from '@/store/store';
import { generate_args_and_approve_mint_position } from '@/blockchain_api/functions/icp/dex/tx/mint_position';
import { useRouter } from 'next/navigation';
import BigNumber from 'bignumber.js';
import { remove_liquidity } from '@/blockchain_api/functions/icp/dex/tx/remove_liquidity';

interface Props {
  position: FormattedPosition;
  tokensRemoveAmount: TokensRemoveAmount;
}

export default function RemoveLiquidityStepTwo({ position, tokensRemoveAmount }: Props) {
  const { actions, selectedPosition } = usePositionDetailsStore();
  const { authenticatedAgent, unAuthenticatedAgent } = useSharedStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!selectedPosition) {
    router.push('/positions');
    return;
  }

  const openModalHandler = () => {
    setIsOpen(true);
  };

  async function executeRemoveLiquidity() {
    if (authenticatedAgent && unAuthenticatedAgent && selectedPosition) {
      // step1
      const generatedArgs = await generate_args_and_approve_mint_position(
        {
          amount0_max: BigNumber(position.token0_reserves)
            .minus(tokensRemoveAmount.token0)
            .toString(),
          amount1_max: BigNumber(position.token1_reserves)
            .minus(tokensRemoveAmount.token1)
            .toString(),
          max_tick: selectedPosition.key.tick_upper.toString(),
          mint_tick: selectedPosition.key.tick_lower.toString(),
          pool_id: selectedPosition.pool.pool_id,
          token0: selectedPosition.token0,
          token1: selectedPosition.token1,
        },
        authenticatedAgent,
        unAuthenticatedAgent,
      );
      if (!generatedArgs.success || !generatedArgs.result) {
        actions.setRemoveLiquidityStep({
          step: 1,
          status: 'failed',
          errorMessage: generatedArgs.message,
        });
        return generatedArgs.message;
      }
      actions.setRemoveLiquidityStep({
        step: 2,
        status: 'pending',
        errorMessage: null,
      });

      // Step 2
      const removeLiquidityResponse = await remove_liquidity(
        {
          // TODO: Fix these properties
          amount0_min: '',
          amount1_min: '',
          liquidity: '',
          pool: selectedPosition.pool.pool_id,
          tick_lower: selectedPosition.key.tick_lower,
          tick_upper: selectedPosition.key.tick_upper,
        },
        authenticatedAgent,
      );

      if (!removeLiquidityResponse.success) {
        actions.setRemoveLiquidityStep({
          step: 2,
          status: 'failed',
          errorMessage: removeLiquidityResponse.message,
        });
        return removeLiquidityResponse.message;
      }
      actions.setRemoveLiquidityStep({
        step: 2,
        status: 'successful',
        errorMessage: null,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div className="flex h-full w-full animate-fade flex-col gap-6">
        <SolidCard>
          <div className="flex w-full items-center justify-between">
            <div className="flex h-full w-2/3 flex-col justify-between text-lg font-semibold lg:text-xl">
              {tokensRemoveAmount.token0.toFixed(8)}
              <p className="text-md text-[#FFFFFF7A] lg:text-lg">
                $
                {(
                  tokensRemoveAmount.token0.toNumber() * Number(position.token0.usdPrice || 0)
                ).toFixed(2)}
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
              {tokensRemoveAmount.token1.toFixed(8)}
              <p className="text-md text-[#FFFFFF7A] lg:text-lg">
                $
                {(
                  tokensRemoveAmount.token1.toNumber() * Number(position.token1.usdPrice || 0)
                ).toFixed(2)}
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

        {/* Action Button */}
        <div
          className={cn(
            'flex h-[40px] w-full items-center justify-center gap-x-3 self-end lg:h-[52px]',
          )}
        >
          <button
            onClick={() => actions.setCurrentStep('positionDetail')}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
          >
            Cancel
          </button>
          <button
            onClick={openModalHandler}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
          >
            Continue
          </button>
        </div>
      </div>
      <DialogTitle />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          <RemoveLiquidityStepper
            onCloseModal={() => setIsOpen(false)}
            steps={removeLiquidityStepsDetails}
          />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
