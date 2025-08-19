'use client';

import { FormattedPosition } from '@/app/positions/types';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { TokensRemoveAmount } from '.';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { removeLiquidityStepsDetails } from '@/lib/constants/positions';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSharedStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import {
  generate_decrease_liquidity_args,
  remove_liquidity,
} from '@/blockchain_api/functions/icp/dex/tx/remove_liquidity';
import { PositionStepper } from '@/app/positions/details/_components/position-stepper';
import { DecreaseLiquidityArgs } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { QueryClient } from '@tanstack/react-query';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';

interface Props {
  position: FormattedPosition;
  tokensRemoveAmount: TokensRemoveAmount;
  percentValue: string;
}

export default function RemoveLiquidityStepTwo({
  position,
  tokensRemoveAmount,
  percentValue,
}: Props) {
  const [isFreshRequest, setIsFreshRequest] = useState(true);
  const { actions, selectedPosition, mintStep } = usePositionDetailsStore();
  const { authenticatedAgent, unAuthenticatedAgent } = useSharedStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = new QueryClient();

  if (!selectedPosition) {
    router.push('/positions');
    return null;
  }

  const openModalHandler = () => {
    setIsOpen(true);
    if (isFreshRequest) {
      setIsFreshRequest(false);
      removeLiquidityHandler();
    }
  };

  const onCloseModal = () => {
    if (mintStep.step === 2) {
      if (mintStep.status === 'successful') {
        actions.resetTxState();
        router.push('/positions');
      } else if (mintStep.status === 'failed') {
        setIsFreshRequest(true);
        actions.resetTxState();
        setIsOpen(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  const removeLiquidityHandler = async () => {
    if (authenticatedAgent && unAuthenticatedAgent && selectedPosition) {
      const generatedArgs = generate_decrease_liquidity_args({
        position: selectedPosition,
        percentage: Number(percentValue.slice(0, -1)),
      }) as DecreaseLiquidityArgs;

      if (!generatedArgs) {
        actions.setMintStep({
          step: 1,
          status: 'failed',
          errorMessage: null,
        });
        return;
      }

      actions.setMintStep({
        step: 2,
        status: 'pending',
        errorMessage: null,
      });

      // Step 2
      const removeLiquidityResponse = await remove_liquidity(generatedArgs, authenticatedAgent);

      if (!removeLiquidityResponse.success) {
        actions.setMintStep({
          step: 2,
          status: 'failed',
          errorMessage: removeLiquidityResponse.message,
        });
        return;
      }
      actions.setMintStep({
        step: 2,
        status: 'successful',
        errorMessage: null,
      });
      queryClient.invalidateQueries({ queryKey: ['fetch-wallet-balances'] });
    }
  };

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

        <SolidCard className="bg-transparent lg:bg-[#222222]">
          <div className={cn('flex flex-col gap-y-3', 'w-full')}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-white/70 md:text-base">
                {position.token0.symbol} fees
              </p>
              <div
                className={cn(
                  'relative',
                  'flex items-center gap-x-1.5',
                  'text-sm font-semibold text-white md:text-base',
                )}
              >
                <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
                {position.fees_token0_owed} {position.token0.symbol}{' '}
                <span className="text-muted">({position.fees_token0_owed_usd}$)</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-white/70 md:text-base">
                {position.token1.symbol} fees
              </p>
              <div
                className={cn(
                  'relative',
                  'flex items-center gap-x-1.5',
                  'text-sm font-semibold text-white md:text-base',
                )}
              >
                <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
                {position.fees_token1_owed} {position.token1.symbol}{' '}
                <span className="text-muted">({position.fees_token1_owed_usd}$)</span>
              </div>
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
          <PositionStepper
            title="Remove Liquidity"
            onCloseModal={onCloseModal}
            steps={removeLiquidityStepsDetails}
          />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
