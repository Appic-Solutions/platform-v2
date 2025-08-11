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

interface Props {
  position: FormattedPosition;
  tokensRemoveAmount: TokensRemoveAmount;
}

export default function RemoveLiquidityStepTwo({ position, tokensRemoveAmount }: Props) {
  const { actions } = usePositionDetailsStore();
  const [isOpen, setIsOpen] = useState(false);
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
            onClick={() => setIsOpen(true)}
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
