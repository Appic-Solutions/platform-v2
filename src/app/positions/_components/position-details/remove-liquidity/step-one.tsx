import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { FormattedPosition } from '@/app/positions/types';
import AvatarGroup from '../../AvatarGroup';

interface RemoveLiquidityProps {
  position: FormattedPosition;
  onBack: () => void;
  onNext: () => void;
}

const RemoveLiquidityStepOne = ({ position, onBack, onNext }: RemoveLiquidityProps) => {
  const { token0, token1, is_in_range, total_fees_owed_usd, token0_reserves, token1_reserves } =
    position;
  const inputRef = useRef<HTMLInputElement>(null);
  const [percentValue, setPercentValue] = useState('0%');
  const [tokensReservesAfterRemove, setTokensReservesAfterRemove] = useState({
    token0: token0_reserves,
    token1: token1_reserves,
  });

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

    const token0ReservesAfterRemove = new BigNumber(token0_reserves).minus(
      new BigNumber(token0_reserves).times(validPercent).div(100),
    );
    const token1ReservesAfterRemove = new BigNumber(token1_reserves).minus(
      new BigNumber(token1_reserves).times(validPercent).div(100),
    );

    setTokensReservesAfterRemove({
      token0: token0ReservesAfterRemove.toFixed(8),
      token1: token1ReservesAfterRemove.toFixed(8),
    });
  }, [percentValue]);

  return (
    <>
      {/* Position info */}
      <div className={cn('flex items-center justify-between gap-4', 'mb-3')}>
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
          <span className="text-xs leading-5 text-white/60">{position.total_fees_owed_usd}%</span>
        </SolidCard>
      </div>

      {/* Input */}
      <div className="group mb-8 w-full rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white">
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

      {/* balance */}
      <SolidCard className="mb-8 bg-transparent lg:bg-[#222222]">
        <div className={cn('flex flex-col gap-y-3', 'w-full')}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token0.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensReservesAfterRemove.token0.replace(/\.?0+$/, '')} {position.token0.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {position.token1.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={position.token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensReservesAfterRemove.token1.replace(/\.?0+$/, '')} {position.token1.symbol}
            </div>
          </div>
        </div>
      </SolidCard>

      {/* Action Button */}
      <div
        className={cn(
          'flex h-[50px] items-center justify-center gap-x-3 self-end lg:h-[66px]',
          'w-full',
        )}
      >
        <button
          onClick={onBack}
          className={cn(
            'h-full w-full',
            'bg-white/35',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[15px] duration-200',
            'hover:opacity-85',
          )}
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className={cn(
            'h-full w-full',
            'bg-primary-buttons',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[15px] duration-200',
            'hover:opacity-85',
          )}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default RemoveLiquidityStepOne;
