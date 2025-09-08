import React, { useEffect, useMemo, useRef } from 'react';
import SolidCard from '@/components/ui/cards/SolidCard';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { ErrorIcon } from '@/components/icons';
import { useWatch } from 'react-hook-form';
import { calculate_price, get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { useSharedStore } from '@/store/store';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import BigNumber from 'bignumber.js';
import TokenSwitcher from './TokenSwitcher';

const StepTwoPoolNotExist = () => {
  const { handleSelectedTokenChange, isToken0Selected, createPositionForm } = useCreatePosition();

  const { icpTokens, pools } = useSharedStore();

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
    console.log('updated sqrtPrice every 30 seconds PoolNotExist ======>');

    return result.text;
  }, [token0, token1, isToken0Selected, initialPrice, pools]);

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
          Full-range liquidity ensures seamless market participation across all prices but risks
          higher impermanent loss. Custom-range liquidity boosts capital efficiency and fee earnings
          within set price bounds, requiring active management.
        </p>
      </SolidCard>

      <div>
        <h3 className="mb-2 text-lg font-semibold lg:text-xl">Set initial price</h3>
        <p className="mb-4 text-sm font-medium text-muted">
          When initializing a new liquidity pool, you must define the initial exchange rate for both
          tokens, which establishes their starting market price.
        </p>
        <GradientBorderCard className="h-[148px] md:h-40">
          <div className="flex h-full w-full flex-col justify-between font-semibold">
            <div className="flex items-start justify-between">
              <p className="text-now text-base text-[#FFFFFFB8] lg:text-xl">Initial price</p>
              <TokenSwitcher />
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                {...createPositionForm.register('initialPrice')}
                className="border-none bg-transparent text-xl outline-none lg:text-2xl"
                placeholder="0"
              />
              <p className="text-xs text-[#FFFFFF7A] lg:text-sm">{priceText}</p>
            </div>
          </div>
        </GradientBorderCard>
      </div>

      <SolidCard>
        <div className="flex w-full flex-col items-start gap-1 text-sm font-medium lg:flex-row lg:items-center lg:justify-between lg:text-lg">
          <h3 className="w-full text-ellipsis md:w-3/4">Market Price: {marketPriceText}</h3>
          <button
            type="button"
            className="text-base text-[#FFFFFFC9] disabled:opacity-50"
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
