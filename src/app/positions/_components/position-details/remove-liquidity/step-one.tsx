import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { FormattedPosition } from '@/app/positions/types';
import AvatarGroup from '../../AvatarGroup';
import { TokensRemoveAmount } from '.';

interface Props {
  position: FormattedPosition;
  setTokensRemoveAmount: React.Dispatch<React.SetStateAction<TokensRemoveAmount>>;
  percentValue: string;
  setPercentValue: React.Dispatch<React.SetStateAction<string>>;
}

const RemoveLiquidityStepOne = ({
  position,
  setTokensRemoveAmount,
  percentValue,
  setPercentValue,
}: Props) => {
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
    <div className="flex animate-fade flex-col gap-2">
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
              {[
                { label: '25%', value: '25' },
                { label: '50%', value: '50' },
                { label: '75%', value: '75' },
                { label: 'max', value: '100' },
              ].map(({ label, value }) => (
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
  );
};

export default RemoveLiquidityStepOne;
