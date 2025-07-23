'use client';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';
import { cn } from '@/lib/utils';
import { PriceRangeInputsProps } from '../../_types';

const PriceRangeInputs = ({
  isToken0Selected,
  handlePriceInput,
  methods,
}: PriceRangeInputsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1, minPrice, maxPrice, initialPrice] = useWatch({
    control,
    name: ['token0', 'token1', 'minPrice', 'maxPrice', 'initialPrice'],
  });

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
                value={minPrice === 'min' ? '' : minPrice}
                onChange={(e) => methods.setValue('minPrice', handleDecimalInput(e.target.value))}
                onBlur={(e) =>
                  handlePriceInput({
                    minOrMax: 'min',
                    value: e.target.value,
                  })
                }
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
                value={maxPrice === 'max' ? '' : maxPrice}
                onChange={(e) => methods.setValue('maxPrice', handleDecimalInput(e.target.value))}
                onBlur={(e) =>
                  handlePriceInput({
                    minOrMax: 'max',
                    value: e.target.value,
                  })
                }
                placeholder={'\u221E'}
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
                {isToken0Selected ? token1.symbol : token0.symbol} = 1{' '}
                {isToken0Selected ? token0.symbol : token1.symbol}
              </p>
            </div>
          </div>
        </GradientBorderCard>
        {errors.maxPrice || errors.minPrice ? (
          <p className="absolute bottom-[-12%] text-[10px] text-[#EE5D5D] lg:text-sm">
            {errors.maxPrice?.message ?? errors.minPrice?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PriceRangeInputs;
