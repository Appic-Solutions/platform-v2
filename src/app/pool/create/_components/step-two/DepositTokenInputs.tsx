'use client';

import { calculate_mint_amounts } from '@/blockchain_api/functions/icp/dex/calculate_mint_amounts';
import { Avatar } from '@/components/common/ui/avatar';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import { cn } from '@/lib/utils';

const DepositTokenInputs = ({ isToken0Selected }: { isToken0Selected: boolean }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { control } = useFormContext<CreatePoolFormDefaultValues>();
  const [
    token0,
    token1,
    token0InitialPrice,
    token1InitialPrice,
    token0MaxPrice,
    token1MaxPrice,
    token0MinPrice,
    token1MinPrice,
    token0DepositAmount,
    token1DepositAmount,
    tickSpacing,
    sqrtPriceX96,
  ] = useWatch({
    control,
    name: [
      'token0',
      'token1',
      'token0InitialPrice',
      'token1InitialPrice',
      'token0MaxPrice',
      'token1MaxPrice',
      'token0MinPrice',
      'token1MinPrice',
      'token0DepositAmount',
      'token1DepositAmount',
      'tickSpacing',
      'sqrtPriceX96',
    ],
  });

  useEffect(() => {
    if (Number(token0InitialPrice) > 0 || Number(token1InitialPrice) > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [token0InitialPrice, token1InitialPrice]);

  const calculateDepositAmountsHandler = (amount: string, isAmountZero: boolean) => {
    console.log({
      is_token0_selected: isToken0Selected,
      selected_amount: amount,
      token0,
      token1,
      sqrt_price_x96: sqrtPriceX96 ?? '',
      min_price: isAmountZero ? token0MinPrice! : token1MinPrice!,
      max_price: isAmountZero ? token0MaxPrice! : token1MaxPrice!,
      tick_spacing: tickSpacing,
      is_amount_zero: isAmountZero,
    });

    const result = calculate_mint_amounts({
      is_token0_selected: isToken0Selected,
      selected_amount: amount,
      token0,
      token1,
      sqrt_price_x96: sqrtPriceX96 ?? '',
      min_price: isAmountZero ? token0MinPrice! : token1MinPrice!,
      max_price: isAmountZero ? token0MaxPrice! : token1MaxPrice!,
      tick_spacing: tickSpacing,
      is_amount_zero: isAmountZero,
    });

    console.log('result', result);
  };
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
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={token0DepositAmount}
                onChange={(e) => calculateDepositAmountsHandler(e.target.value, true)}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${Number(token1DepositAmount) * Number(token0.usdPrice)}
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
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={token1DepositAmount}
                onChange={(e) => calculateDepositAmountsHandler(e.target.value, false)}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                ${Number(token1DepositAmount) * Number(token1.usdPrice)}
              </p>
            </div>
          </div>
        </GradientBorderCard>
      </div>
    </div>
  );
};

export default DepositTokenInputs;
