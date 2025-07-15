import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SolidCard from '@/components/ui/cards/SolidCard';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { ErrorIcon } from '@/components/icons';
import { CreatePoolFormDefaultValues } from '../../schema';
import { useFormContext, useWatch } from 'react-hook-form';
import { calculate_price, get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { useSharedStore } from '@/store/store';
import { StepTwoPoolNotExistProps } from '../../_types';

const StepTwoPoolNotExist = ({
  setIsToken0Selected,
  isToken0Selected,
  handleInitialPriceInput,
  handleSetMarketPrice,
  selectedToken,
  setSelectedToken,
}: StepTwoPoolNotExistProps) => {
  const { icpTokens } = useSharedStore();
  const { control, setValue } = useFormContext<CreatePoolFormDefaultValues>();
  const [token0, token1, token0InitialPrice, token1InitialPrice] = useWatch({
    control,
    name: ['token0', 'token1', 'token0InitialPrice', 'token1InitialPrice'],
  });
  const [localInputValue, setLocalInputValue] = useState<string>('');
  useEffect(() => {
    const newValue = isToken0Selected ? token0InitialPrice : token1InitialPrice;
    setLocalInputValue(newValue || '');
  }, [isToken0Selected, token0InitialPrice, token1InitialPrice]);

  const priceText = useMemo(() => {
    if (!token0 || !token1) return 'Select tokens to set price';
    const price = isToken0Selected ? token0InitialPrice : token1InitialPrice;
    if (!price || parseFloat(price) <= 0) return 'Enter a valid price';
    const result = calculate_price({
      token0,
      token1,
      is_token0_selected: isToken0Selected,
      price,
    });
    setValue('sqrtPriceX96', result.sqrt_price_x96);
    return result.text;
  }, [token0, token1, isToken0Selected, token0InitialPrice, token1InitialPrice]);

  const marketPriceText = useMemo(() => {
    if (!token0 || !token1 || !icpTokens) return 'Market price unavailable';
    return get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0,
        token1,
        price: isToken0Selected ? token0InitialPrice : token1InitialPrice,
      },
      icpTokens,
    ).text;
  }, [token0, token1, isToken0Selected, icpTokens, token0InitialPrice, token1InitialPrice]);

  const isValidNumberInput = (value: string): boolean => {
    const trimmed = value.trim();

    if (trimmed === '') return true;

    if (trimmed.length > 24) return false;

    const parts = trimmed.split('.');
    if (parts.length > 2) return false;

    const [integerPart, decimalPart] = parts;

    if (!/^\d*$/.test(integerPart)) return false;
    if (decimalPart && !/^\d*$/.test(decimalPart)) return false;

    if (decimalPart && decimalPart.length > 18) return false;

    return true;
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isValidNumberInput(value)) return;

    setLocalInputValue(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleInitialPriceInput(value); // updates the state
    }, 500);
  };

  return (
    <>
      <SolidCard>
        <div className="flex items-center gap-2">
          <ErrorIcon width={22} height={22} />
          <h3 className="text-lg font-medium md:text-xl">Create new pool</h3>
        </div>
        <p className="mt-2 text-sm font-light text-[#FFFFFFBA]">
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.. Choose the tokens you want to provide liquidity for. You can select
          tokens on all supported networks.
        </p>
      </SolidCard>

      <div className="mt-4 md:mt-8">
        <h3 className="mb-4 text-2xl font-bold">Set initial price</h3>
        <p className="mb-4 text-[15px] font-thin">
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.
        </p>
        <GradientBorderCard className="h-[148px] lg:h-[196px]">
          <div className="flex h-full w-full flex-col justify-between font-semibold">
            <div className="flex items-start justify-between">
              <p className="text-base text-[#FFFFFFB8] lg:text-[21px]">Initial price</p>
              <div className="flex rounded-[10px] bg-[#222222] px-[4px] py-[2px]">
                {[token0, token1].map(
                  (t, idx) =>
                    t && (
                      <button
                        key={idx}
                        className={cn(
                          'flex items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                          t.canisterId === selectedToken?.canisterId
                            ? 'bg-[#1E53B8] text-white'
                            : 'bg-[#222222] text-white/70',
                        )}
                        onClick={() => {
                          setSelectedToken(t);
                          setIsToken0Selected(idx === 0);
                        }}
                        disabled={!t}
                      >
                        <Image
                          src={t.logo}
                          alt={t.symbol}
                          width={17}
                          height={17}
                          className="rounded-full"
                        />
                        {t.symbol}
                      </button>
                    ),
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
                maxLength={24}
                value={localInputValue}
                onChange={handleInputChange}
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">{priceText}</p>
            </div>
          </div>
        </GradientBorderCard>
      </div>

      <SolidCard>
        <div className="flex w-full flex-col items-start gap-1 text-sm font-medium lg:flex-row lg:items-center lg:justify-between lg:text-[17px]">
          <h3 className="md:text-xl">Market Price: {marketPriceText}</h3>
          <button
            className="text-[#FFFFFFC9] disabled:opacity-50"
            onClick={handleSetMarketPrice}
            disabled={!token0 || !token1 || !icpTokens}
          >
            Use Market Price
          </button>
        </div>
      </SolidCard>
    </>
  );
};

export default StepTwoPoolNotExist;
