import React, { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SolidCard from '@/components/ui/cards/SolidCard';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { ErrorIcon } from '@/components/icons';
import { useWatch } from 'react-hook-form';
import { calculate_price, get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { useSharedStore } from '@/store/store';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import BigNumber from 'bignumber.js';

const StepTwoPoolNotExist = () => {
  const { handleSelectedTokenChange, isToken0Selected, createPositionForm, maxOrMinPriceHandler } =
    useCreatePosition();

  const { icpTokens } = useSharedStore();

  const [token0, token1, initialPrice] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'initialPrice'],
  });

  const priceText = useMemo(() => {
    if (!token0 || !token1) return 'Select tokens to set price';

    const price = initialPrice;
    if (!price || parseFloat(price) <= 0 || isNaN(Number(initialPrice)))
      return 'Enter a valid price';

    const result = calculate_price({
      token0,
      token1,
      is_token0_selected: isToken0Selected,
      price,
    });
    createPositionForm.setValue('sqrtPriceX96', result.sqrt_price_x96);

    return result.text;
  }, [token0, token1, isToken0Selected, initialPrice]);

  const marketPriceText = useMemo(() => {
    if (!token0 || !token1 || !icpTokens) return 'Market price unavailable';
    return get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0,
        token1,
        price: initialPrice || '0',
      },
      icpTokens,
    ).text;
  }, [token0, token1, isToken0Selected, icpTokens, initialPrice]);

  const handleSetMarketPrice = () => {
    if (!token0 || !token1 || !icpTokens) return;
    const { price } = get_market_price(
      {
        is_token0_selected: isToken0Selected,
        token0,
        token1,
        price: initialPrice,
      },
      icpTokens,
    );
    const formattedPrice = BigNumber(price).toFixed(18, BigNumber.ROUND_DOWN);

    createPositionForm.setValue('initialPrice', formattedPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });
    createPositionForm.setValue('minPrice', 'min');
    createPositionForm.setValue('maxPrice', 'max');

    createPositionForm.trigger('initialPrice');
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
                {/* token pairs */}
                {[token0, token1].map(
                  (t, idx) =>
                    t && (
                      <button
                        type="button"
                        key={idx}
                        className={cn(
                          'flex items-center gap-1 rounded-md px-[10px] py-[4px] text-xs font-semibold transition-all',
                          (isToken0Selected && idx === 0) || (!isToken0Selected && idx === 1)
                            ? 'bg-[#1E53B8] text-white'
                            : 'bg-[#222222] text-white/70',
                        )}
                        onClick={() => handleSelectedTokenChange()}
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
                {...createPositionForm.register('initialPrice')}
                className="border-none bg-transparent text-[22px] outline-none lg:text-[27px]"
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
            type="button"
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
