'use client';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePositionFormDefaultValues } from '../../schema';
import { cn } from '@/lib/utils';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { useEffect, useRef } from 'react';

const PriceRangeInputs = () => {
  const { isToken0Selected, minPriceHandler, createPositionForm, maxPriceHandler } =
    useCreatePosition();

  const [token0, token1, minPrice, maxPrice, initialPrice, sqrtPriceX96] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'minPrice', 'maxPrice', 'initialPrice', 'sqrtPriceX96'],
  });

  const hasResetPrices = useRef(false);
  useEffect(() => {
    if (sqrtPriceX96 && !hasResetPrices.current) {
      minPriceHandler('');
      maxPriceHandler('');
      hasResetPrices.current = true;
    }
  }, [sqrtPriceX96]);

  const isDisabled = !(initialPrice && parseFloat(initialPrice) > 0);

  const handleDecimalInput = (value: string) => {
    if (!value.includes('.')) return value;

    const [intPart, decimalPart] = value.split('.');
    const trimmedDecimal = decimalPart.slice(0, 6);
    return `${intPart}.${trimmedDecimal}`;
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold lg:text-2xl">Set Price range</h3>
      <div className="relative flex justify-start gap-4 lg:justify-between">
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
                value={minPrice === 'min' ? '0' : minPrice}
                onChange={(e) =>
                  createPositionForm.setValue('minPrice', handleDecimalInput(e.target.value))
                }
                onBlur={(e) => minPriceHandler(e.target.value)}
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
                value={maxPrice === 'max' ? '\u221E' : maxPrice}
                onChange={(e) =>
                  createPositionForm.setValue('maxPrice', handleDecimalInput(e.target.value))
                }
                onBlur={(e) => maxPriceHandler(e.target.value)}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                {isToken0Selected ? token1.symbol : token0.symbol} = 1{' '}
                {isToken0Selected ? token0.symbol : token1.symbol}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {createPositionForm.formState.errors.maxPrice ||
        createPositionForm.formState.errors.minPrice ? (
          <p className="absolute bottom-[-12%] text-[10px] text-[#EE5D5D] lg:text-sm">
            {createPositionForm.formState.errors.maxPrice?.message ??
              createPositionForm.formState.errors.minPrice?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PriceRangeInputs;
