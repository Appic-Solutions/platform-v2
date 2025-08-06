'use client';

import { UseFormReturn, useWatch } from 'react-hook-form';
import { FormattedPosition } from '@/app/positions/types';
import { AddLiquidityFormDefaultValues } from '@/app/positions/create/schema';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

export default function AddLiquidityStepTwo({
  position,
  addLiquidityForm,
}: {
  position: FormattedPosition;
  addLiquidityForm: UseFormReturn<AddLiquidityFormDefaultValues>;
}) {
  const [token0DepositAmount, token1DepositAmount] = useWatch({
    control: addLiquidityForm.control,
    name: ['token0DepositAmount', 'token1DepositAmount'],
  });

  const token0TotalAmount =
    Number(position.token0_reserves || 0) + Number(token0DepositAmount || 0);
  const token1TotalAmount =
    Number(position.token1_reserves || 0) + Number(token1DepositAmount || 0);

  return (
    <div className="h-full w-full space-y-3">
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
            <p className="text-sm font-semibold text-white md:text-xl">{position.token0.symbol}</p>
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
            <p className="text-sm font-semibold text-white md:text-xl">{position.token1.symbol}</p>
          </div>
        </div>
      </SolidCard>
    </div>
  );
}
