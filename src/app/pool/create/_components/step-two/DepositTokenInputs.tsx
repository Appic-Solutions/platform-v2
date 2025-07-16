'use client';

import { Avatar } from '@/components/common/ui/avatar';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import { cn, limitDecimalPlaces } from '@/lib/utils';
import { DepositAmountsInputsProps } from '../../_types';

const DepositTokenInputs = ({ handleDepositAmountInput }: DepositAmountsInputsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1, initialPrice, token0DepositAmount, token1DepositAmount] = useWatch({
    control,
    name: ['token0', 'token1', 'initialPrice', 'token0DepositAmount', 'token1DepositAmount'],
  });

  const isDisabled = !(initialPrice && parseFloat(initialPrice) > 0);

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Deposit tokens</h3>
      <p className="mb-4 text-[15px] font-normal">
        The amount earned providing liquidity. Choose an amount that suits your risk tolerance and
        strategy.
      </p>
      <div className="flex justify-start gap-4 lg:justify-between">
        {/* token0 */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-[188px] lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Avatar
                src={token0.logo}
                className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
              />
              <p className="text-base text-[#FFFFFF] lg:text-[21px]">{token0.symbol}</p>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                disabled={isDisabled}
                inputMode="decimal"
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={token0DepositAmount}
                onChange={(e) => {
                  const value = limitDecimalPlaces(e.target.value);
                  handleDepositAmountInput({ amount: value, isAmountZero: true });
                }}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${(Number(token0DepositAmount) * Number(token0.usdPrice)).toFixed(2)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {/* token1 */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-[188px] lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Avatar
                src={token1.logo}
                className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
              />
              <p className="text-base text-[#FFFFFF] lg:text-[21px]">{token1.symbol}</p>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                disabled={isDisabled}
                inputMode="decimal"
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={token1DepositAmount}
                onChange={(e) => {
                  const value = limitDecimalPlaces(e.target.value);
                  handleDepositAmountInput({ amount: value, isAmountZero: false });
                }}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${(Number(token1DepositAmount) * Number(token1.usdPrice)).toFixed(2)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
      </div>
    </div>
  );
};

export default DepositTokenInputs;
