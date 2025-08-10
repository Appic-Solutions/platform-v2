'use client';

import { FormattedPosition } from '@/app/positions/types';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { TokensRemoveAmount } from '.';

interface Props {
  position: FormattedPosition;
  tokensRemoveAmount: TokensRemoveAmount;
}

export default function RemoveLiquidityStepTwo({ position, tokensRemoveAmount }: Props) {
  return (
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
            <p className="text-sm font-semibold text-white md:text-xl">{position.token0.symbol}</p>
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
            <p className="text-sm font-semibold text-white md:text-xl">{position.token1.symbol}</p>
          </div>
        </div>
      </SolidCard>
    </div>
  );
}
