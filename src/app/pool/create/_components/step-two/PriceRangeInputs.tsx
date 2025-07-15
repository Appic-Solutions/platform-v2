'use client';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import { cn } from '@/lib/utils';
import { PriceRangeInputsProps } from '../../_types';

const PriceRangeInputs = ({
  isToken0Selected,
  handleMaxPriceInput,
  handleMinPriceInput,
}: PriceRangeInputsProps) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const { control } = useFormContext<CreatePoolFormDefaultValues>();
  const [
    token0,
    token1,
    token0MaxPrice,
    token1MaxPrice,
    token0MinPrice,
    token1MinPrice,
    token0InitialPrice,
    token1InitialPrice,
  ] = useWatch({
    control,
    name: [
      'token0',
      'token1',
      'token0MaxPrice',
      'token1MaxPrice',
      'token0MinPrice',
      'token1MinPrice',
      'token0InitialPrice',
      'token1InitialPrice',
    ],
  });

  useEffect(() => {
    if (Number(token0InitialPrice) > 0 || Number(token1InitialPrice) > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [token0InitialPrice, token1InitialPrice]);

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold lg:text-2xl">Set Price range</h3>
      <div className="flex justify-start gap-4 lg:justify-between">
        {/* min price */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-[188px] lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Min price</p>
            <div className="flex flex-col gap-2">
              <input
                disabled={isDisabled}
                type="text"
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={isToken0Selected ? token0MinPrice : token1MinPrice || ''}
                onChange={(e) => handleMinPriceInput(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                {isToken0Selected ? token1.symbol : token0.symbol} = 1{' '}
                {isToken0Selected ? token0.symbol : token1.symbol}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {/* max price */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-[188px] lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Max price</p>
            <div className="flex flex-col gap-2">
              <input
                disabled={isDisabled}
                type="text"
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                value={isToken0Selected ? token0MaxPrice : token1MaxPrice}
                onChange={(e) => handleMaxPriceInput(e.target.value)}
                placeholder={'\u221E'}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                {isToken0Selected ? token1.symbol : token0.symbol} = 1{' '}
                {isToken0Selected ? token0.symbol : token1.symbol}
              </p>
            </div>
          </div>
        </GradientBorderCard>
      </div>
    </div>
  );
};

export default PriceRangeInputs;
