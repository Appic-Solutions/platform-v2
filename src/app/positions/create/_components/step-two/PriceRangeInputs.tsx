'use client';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { useWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { useEffect, useRef } from 'react';

const PriceRangeInputs = () => {
  const { isToken0Selected, createPositionForm, maxOrMinPriceHandler } = useCreatePosition();

  const [token0, token1, minPrice, maxPrice, initialPrice, sqrtPriceX96] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'minPrice', 'maxPrice', 'initialPrice', 'sqrtPriceX96'],
  });

  const isDisabled = !(initialPrice && parseFloat(initialPrice) > 0);

  const handleDecimalInput = (value: string) => {
    if (!value.includes('.')) return value;
    if (value.includes('.') && value.length === 1) return '';

    const [intPart, decimalPart] = value.split('.');
    const trimmedDecimal = decimalPart.slice(0, 6);

    return `${intPart}.${trimmedDecimal}`;
  };

  const hasResetPrices = useRef(false);
  useEffect(() => {
    if (sqrtPriceX96 && !hasResetPrices.current) {
      maxOrMinPriceHandler({ maxValue: 'max', minValue: 'min' });
      hasResetPrices.current = true;
    }
  }, [sqrtPriceX96]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold lg:text-xl">Set Price range</h3>
      <div className="relative flex justify-start gap-4 lg:justify-between">
        {/* min price */}
        <GradientBorderCard
          className={cn(
            'h-[148px] w-[166px] transition-opacity lg:h-36 lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <p className="text-base text-[#FFFFFFB8] lg:text-xl">Min price</p>

            <div className="flex flex-col gap-2">
              <input
                disabled={isDisabled}
                type="text"
                className="border-none bg-transparent text-lg outline-none lg:text-xl"
                value={minPrice === 'min' ? '0' : minPrice}
                onFocus={(e) => {
                  if (e.target.value === '0') {
                    createPositionForm.setValue('minPrice', '');
                  }
                }}
                onChange={(e) => {
                  createPositionForm.setValue('minPrice', handleDecimalInput(e.target.value));
                  createPositionForm.trigger(['minPrice', 'maxPrice']);
                }}
                onBlur={(e) => {
                  if (minPrice === '' || minPrice === '0') {
                    createPositionForm.setValue('minPrice', 'min', { shouldValidate: true });
                  }
                  maxOrMinPriceHandler({
                    minValue:
                      e.target.value === '0' || e.target.value === '' || e.target.value === 'min'
                        ? 'min'
                        : e.target.value,
                    maxValue: maxPrice,
                  });
                }}
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
            'h-[148px] w-[166px] transition-opacity lg:h-36 lg:w-[210px]',
            isDisabled && 'opacity-30',
          )}
        >
          <div className="flex h-full flex-col justify-between font-semibold">
            <p className="text-base text-[#FFFFFFB8] lg:text-xl">Max price</p>
            <div className="flex flex-col gap-2">
              <input
                disabled={isDisabled}
                type="text"
                className="border-none bg-transparent text-lg outline-none lg:text-xl"
                value={maxPrice === 'max' || maxPrice === 'Infinity' ? '\u221E' : maxPrice}
                onFocus={(e) => {
                  if (e.target.value === '\u221E') {
                    createPositionForm.setValue('maxPrice', '');
                  }
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === '') {
                    createPositionForm.setValue('maxPrice', '');
                  } else {
                    createPositionForm.setValue(
                      'maxPrice',

                      handleDecimalInput(inputValue) || 'max',
                    );
                  }

                  createPositionForm.trigger(['minPrice', 'maxPrice']);
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value;
                  if (maxPrice === '' || maxPrice === 'Infinity') {
                    createPositionForm.setValue('maxPrice', 'max', { shouldValidate: true });
                  }
                  maxOrMinPriceHandler({
                    minValue: minPrice,
                    maxValue:
                      inputValue === '' || inputValue === '0' || inputValue === '\u221E'
                        ? 'max'
                        : inputValue,
                  });
                }}
                placeholder="∞"
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
