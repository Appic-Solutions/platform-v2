'use client';

import { Avatar } from '@/components/common/ui/avatar';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { cn, limitDecimalPlaces } from '@/lib/utils';
import { useCreatePosition } from '../../_context/CreatePositionContext';

const DepositTokenInputs = () => {
  const { handleDepositAmountInput, createPositionForm } = useCreatePosition();

  const [token0, token1, initialPrice, token0DepositAmount, token1DepositAmount] = useWatch({
    control: createPositionForm.control,
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
      <div className="relative flex justify-start gap-4 lg:justify-between">
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
                src={token0?.logo}
                className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
              />
              <p className="text-base text-[#FFFFFF] lg:text-[21px]">{token0?.symbol || 'N/A'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={createPositionForm.control}
                name="token0DepositAmount"
                render={({ field }) => (
                  <input
                    type="text"
                    disabled={isDisabled}
                    inputMode="decimal"
                    className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = limitDecimalPlaces(e.target.value);
                      field.onChange(value);
                      handleDepositAmountInput({ amount: value, isAmountZero: true });
                    }}
                    placeholder="0"
                  />
                )}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${(Number(token0DepositAmount || 0) * Number(token0?.usdPrice || 0)).toFixed(2)}
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
                src={token1?.logo}
                className="h-[22px] w-[22px] md:h-7 md:w-7 lg:h-[28px] lg:w-[28px]"
              />
              <p className="text-base text-[#FFFFFF] lg:text-[21px]">{token1?.symbol || 'N/A'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                control={createPositionForm.control}
                name="token1DepositAmount"
                render={({ field }) => (
                  <input
                    type="text"
                    disabled={isDisabled}
                    inputMode="decimal"
                    className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = limitDecimalPlaces(e.target.value);
                      field.onChange(value);
                      handleDepositAmountInput({ amount: value, isAmountZero: false });
                    }}
                    placeholder="0"
                  />
                )}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${(Number(token1DepositAmount || 0) * Number(token1?.usdPrice || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {createPositionForm.formState.errors.token0DepositAmount ||
        createPositionForm.formState.errors.token1DepositAmount ? (
          <p className="absolute bottom-[-12%] text-[10px] text-[#EE5D5D] lg:text-sm">
            {createPositionForm.formState.errors.token0DepositAmount?.message ??
              createPositionForm.formState.errors.token1DepositAmount?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default DepositTokenInputs;
