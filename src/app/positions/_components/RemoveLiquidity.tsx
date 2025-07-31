import { Avatar } from '@/components/common/ui/avatar';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FormattedPosition, Step } from '../page';
import SolidCard from '@/components/ui/cards/SolidCard';
import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import Link from 'next/link';

interface RemoveLiquidityProps {
  position: FormattedPosition;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

const PERCENTS = [
  { label: '25%', value: '25' },
  { label: '50%', value: '50' },
  { label: '75%', value: '75' },
  { label: 'max', value: '100' },
];

const RemoveLiquidity = ({ position, setCurrentStep }: RemoveLiquidityProps) => {
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
    <div className="w-full animate-fade">
      {/* Header */}
      <div className="relative isolate mb-10 flex w-full items-center justify-between gap-4">
        <ArrowLeftIcon
          onClick={() => setCurrentStep('positionDetail')}
          className="z-10 hidden cursor-pointer md:inline-block"
        />
        <h1 className="text-[27px] font-bold md:absolute md:inset-x-0 md:text-center md:text-[30px]">
          Remove liquidity
        </h1>
        <button
          className={cn(
            'px-2.5 py-0.5',
            'rounded-md',
            'bg-white/10',
            'text-xs font-medium text-white/60',
            'z-10',
          )}
        >
          <Link href="https://t.me/Appic_dao">Get help</Link>
        </button>
      </div>

      {/* Position info */}
      <div className="mb-7 flex w-full items-center justify-between gap-4 md:mb-6">
        <div className="grid max-h-[58px] flex-1 grid-cols-9 md:grid-cols-8 md:grid-rows-2">
          <div className="col-span-2 flex max-w-fit items-center sm:col-span-1 md:col-span-2 md:row-span-full">
            <Avatar src={token0.logo} className="h-[31px] w-[31px] md:h-[58px] md:w-[58px]" />
            <Avatar src={token1.logo} className="-ml-4 h-[31px] w-[31px] md:h-[58px] md:w-[58px]" />
          </div>
          <div className="col-span-7 flex items-center text-[27px] font-bold sm:col-span-8 md:col-span-6 md:text-[32px]">
            {token0.symbol}/{token1.symbol}
          </div>
          <div className="col-span-full flex items-center gap-x-1 text-xs font-medium md:col-span-6">
            <p
              className={cn(
                'flex items-center gap-x-1.5 text-[13px]',
                is_in_range ? 'text-[#77EF4B]' : 'text-[#EE5D5D]',
              )}
            >
              <span
                className={cn(
                  'h-[9px] w-[9px] animate-pulse rounded-full',
                  is_in_range ? 'bg-[#77EF4B]' : 'bg-[#EE5D5D]',
                )}
              />
              {is_in_range ? 'In range' : 'Out of range'}
            </p>
          </div>
        </div>
        <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
          <span className="text-xs leading-5 text-white/60">{total_fees_owed_usd}%</span>
        </SolidCard>
      </div>

      {/* Input */}
      <div className="group mb-8 w-full rounded-[20px] bg-box-border-gradient p-0.5 text-black backdrop-blur-[30px] dark:text-white">
        <div className="w-full rounded-[20px] bg-box-background-secondary px-5 py-6 lg:px-8">
          <p className="mb-3 font-semibold text-white/70 md:text-xl">Withdrawal amount</p>
          <div className="flex items-center justify-between">
            <div className="relative flex w-min items-center">
              <input
                ref={inputRef}
                type="text"
                className="percent max-w-[10rem] border-none bg-transparent pr-5 text-[22px] outline-none lg:text-[27px]"
                defaultValue="%"
              />
            </div>
            <div className="flex items-center gap-x-2">
              {PERCENTS.map(({ label, value }) => (
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
      <SolidCard className="mb-8 bg-transparent px-5 lg:bg-[#222222] lg:px-8">
        <div className={cn('flex flex-col gap-y-3', 'w-full')}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {token0.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={token0.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensReservesAfterRemove.token0.replace(/\.?0+$/, '')} {token0.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/70 md:text-base">
              {token1.symbol} position
            </p>
            <div
              className={cn(
                'relative',
                'flex items-center gap-x-1.5',
                'text-sm font-semibold text-white md:text-base',
              )}
            >
              <Avatar src={token1.logo} className="h-5 w-5 md:h-6 md:w-6" />
              {tokensReservesAfterRemove.token1.replace(/\.?0+$/, '')} {token1.symbol}
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
          onClick={() => {
            setCurrentStep('positionDetail');
          }}
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
    </div>
  );
};

export default RemoveLiquidity;
