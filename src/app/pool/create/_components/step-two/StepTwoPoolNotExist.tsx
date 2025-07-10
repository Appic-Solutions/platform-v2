import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import SolidCard from '@/components/ui/cards/SolidCard';
import GradientBorderCard from '@/components/ui/cards/GradientBorderCard';
import { ErrorIcon } from '@/components/icons';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { CreatePoolFormDefaultValues } from '../../schema';
import { useFormContext, useWatch } from 'react-hook-form';
import { calculate_price, get_market_price } from '@/blockchain_api/functions/icp/dex/utils/price';
import { useSharedStore } from '@/store/store';

const StepTwoPoolNotExist: React.FC = () => {
  const { icpTokens } = useSharedStore();
  const { control, setValue, trigger } = useFormContext<CreatePoolFormDefaultValues>();

  const [token0, token1, token0InitialPrice, token1InitialPrice] = useWatch({
    control,
    name: ['token0', 'token1', 'token0InitialPrice', 'token1InitialPrice'],
  });

  const [selectedToken, setSelectedToken] = useState<IcpToken | null>(null);

  const isToken0Selected = useMemo(
    () => selectedToken?.canisterId === token0?.canisterId,
    [selectedToken, token0],
  );

  useEffect(() => {
    if (token0 && !selectedToken) {
      setSelectedToken(token0);
    }
  }, [token0, selectedToken]);

  const priceText = useMemo(() => {
    if (!token0 || !token1) return 'Select tokens to set price';
    const price = isToken0Selected ? token0InitialPrice : token1InitialPrice;
    if (!price || parseFloat(price) <= 0) return 'Enter a valid price';
    return calculate_price({
      token0,
      token1,
      is_token0_selected: isToken0Selected,
      price,
    }).text;
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

  const handleInputChange = (value: string) => {
    const field = isToken0Selected ? 'token0InitialPrice' : 'token1InitialPrice';
    const parsedValue = value === '' ? '' : parseFloat(value) >= 0 ? value : '0';
    setValue(field, parsedValue, { shouldValidate: true, shouldDirty: true });
    trigger(field);
  };

  const handleSetMarketPrice = () => {
    if (!token0 || !token1 || !icpTokens) return;
    const { price } = get_market_price(
      { is_token0_selected: isToken0Selected, token0, token1, price: '0' },
      icpTokens,
    );
    handleInputChange(price);
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
                        onClick={() => setSelectedToken(t)}
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
                value={isToken0Selected ? token0InitialPrice || '' : token1InitialPrice || ''}
                onChange={(e) => handleInputChange(e.target.value)}
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
