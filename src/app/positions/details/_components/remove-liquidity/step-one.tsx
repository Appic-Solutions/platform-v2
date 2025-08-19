import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { FormattedPosition } from '@/app/positions/types';
import { TokensRemoveAmount } from '.';
import { removeLiquidityPercents } from '@/lib/constants/positions';
import AvatarGroup from '@/app/positions/_components/AvatarGroup';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';

interface Props {
  position: FormattedPosition;
  tokensRemoveAmount: TokensRemoveAmount;
  setTokensRemoveAmount: React.Dispatch<React.SetStateAction<TokensRemoveAmount>>;
  percentValue: string;
  setPercentValue: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
}

export interface RemoveLiquidityPercent {
  value: string;
  label: string;
}

const RemoveLiquidityStepOne = ({
  position,
  tokensRemoveAmount,
  setTokensRemoveAmount,
  percentValue,
  setPercentValue,
  onNext,
}: Props) => {
  const { actions } = usePositionDetailsStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = percentValue;
    input.setSelectionRange(0, 0);

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      let raw = target.value.replace('%', '').replace(/[^\d.]/g, '');

      const dotIndex = raw.indexOf('.');
      if (dotIndex !== -1) {
        raw = raw.slice(0, dotIndex + 1) + raw.slice(dotIndex + 1).replace(/\./g, '');
      }

      let bn = new BigNumber(raw);
      if (bn.isNaN() || bn.isNegative()) bn = new BigNumber(0);
      if (bn.gt(100)) bn = new BigNumber(100);

      const formatted = bn.toFixed() + '%';
      target.value = formatted;
      setPercentValue(formatted);

      const caretPos = formatted.length - 1;
      target.setSelectionRange(caretPos, caretPos);
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, []);

  const handlePercentClick = (value: string) => {
    const newValue = `${value}%`;
    setPercentValue(newValue);
    if (inputRef.current) {
      inputRef.current.value = newValue;
      inputRef.current.setSelectionRange(newValue.length - 1, newValue.length - 1);
    }
  };

  useEffect(() => {
    const raw = percentValue.replace('%', '');
    const percent = new BigNumber(raw);
    const validPercent = percent.isNaN() ? new BigNumber(0) : percent;

    setTokensRemoveAmount({
      token0: new BigNumber(position.token0_reserves).times(validPercent).div(100),
      token1: new BigNumber(position.token1_reserves).times(validPercent).div(100),
    });
  }, [percentValue]);

  return (
    <div className="flex animate-fade flex-col gap-6">
      <div className="flex flex-col gap-2">
        {/* Position info */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex gap-4">
            {/* avatars */}
            <AvatarGroup avatar0={position.token0.logo} avatar1={position.token1.logo} />

            <div>
              <div className="flex items-center text-xl font-semibold md:text-2xl">
                {position.token0.symbol}/{position.token1.symbol}
              </div>
              <p
                className={cn(
                  'flex items-center gap-x-1.5 text-[13px]',
                  position.is_in_range ? 'text-[#77EF4B]' : 'text-[#EE5D5D]',
                )}
              >
                <span
                  className={cn(
                    'h-[9px] w-[9px] animate-pulse rounded-full',
                    position.is_in_range ? 'bg-[#77EF4B]' : 'bg-[#EE5D5D]',
                  )}
                />
                {position.is_in_range ? 'In range' : 'Out of range'}
              </p>
            </div>
          </div>

          <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
            <span className="text-xs leading-5 text-white/60">
              {Number(position.pool.pool_id.fee) / 10000}%
            </span>
          </SolidCard>
        </div>

        {/* Input */}
        <div className="group w-full rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white">
          <div className="w-full rounded-[20px] bg-box-background-secondary px-5 py-6">
            <p className="mb-3 font-semibold text-white/70 md:text-lg">Withdrawal amount</p>
            <div className="flex items-center justify-between">
              <div className="relative flex w-min items-center">
                <input
                  ref={inputRef}
                  type="text"
                  className="percent max-w-[10rem] border-none bg-transparent pr-5 text-xl outline-none lg:text-2xl"
                  defaultValue="%"
                />
              </div>
              <div className="flex items-center gap-x-2">
                {removeLiquidityPercents.map(({ label, value }) => (
                  <span
                    key={value}
                    onClick={() => handlePercentClick(value)}
                    className={cn(
                      value === percentValue.slice(0, -1) ? 'bg-[#2060D5]/45' : 'bg-white/10',
                      'cursor-pointer rounded-[10px] px-1.5 py-1 text-xs font-medium text-white/80 md:rounded-[16px] md:px-3 md:text-sm',
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* balance */}
      <SolidCard className="bg-transparent lg:bg-[#222222]">
        <div className={cn('flex flex-col gap-y-3', 'w-full')}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token0.symbol}
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensRemoveAmount.token0.toString().replace(/\.?0+$/, '') || '0'}{' '}
              {position.token0.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token1.symbol}
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensRemoveAmount.token1.toString().replace(/\.?0+$/, '') || '0'}{' '}
              {position.token1.symbol}
            </div>
          </div>
        </div>
      </SolidCard>

      {/* Action Button */}
      <div
        className={cn(
          'flex h-[40px] w-full items-center justify-center gap-x-3 self-end lg:h-[52px]',
        )}
      >
        <button
          onClick={() => actions.setCurrentStep('positionDetail')}
          className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
        >
          Cancel
        </button>
        <button
          disabled={!percentValue || percentValue === '0%'}
          onClick={onNext}
          className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RemoveLiquidityStepOne;
