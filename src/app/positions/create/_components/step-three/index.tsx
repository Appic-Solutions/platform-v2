'use client';

import { Avatar } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';
import { useFormContext, useWatch } from 'react-hook-form';
import SolidCard from '@/components/ui/cards/SolidCard';
import AvatarGroup from '../step-two/AvatarGroup';
import { useCreatePosition } from '../../_context/CreatePositionContext';

export default function CreatePositionStepThree() {
  const { isToken0Selected, resetFormHandler, createPositionForm } = useCreatePosition();

  const [token0, token1, fee, minPrice, maxPrice, token0DepositAmount, token1DepositAmount] =
    useWatch({
      control: createPositionForm.control,
      name: [
        'token0',
        'token1',
        'fee',
        'minPrice',
        'maxPrice',
        'initialPrice',
        'token0DepositAmount',
        'token1DepositAmount',
      ],
    });
  const token0DepositAmountInUsd = parseFloat(token0DepositAmount) * parseFloat(token0.usdPrice);
  const token1DepositAmountInUsd = parseFloat(token1DepositAmount) * parseFloat(token1.usdPrice);

  const onCancel = () => {
    resetFormHandler();
  };

  return (
    <div className="flex h-full w-full animate-fade flex-col gap-5">
      {/* header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-2 lg:gap-4">
          <AvatarGroup token0={token0} token1={token1} />
          <h3 className="text-[27px] font-bold lg:text-[40px]">
            {token0.symbol}/{token1.symbol}
          </h3>
        </div>
        <div className="flex items-center gap-x-1">
          <SolidCard size="sm">
            <span className="text-xs leading-5 text-white/60">{Number(fee) / 10000}%</span>
          </SolidCard>
        </div>
      </div>

      <div className="flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
        <SolidCard>
          <p className="font-medium text-white/70 md:text-[21px]">Min price</p>
          <p className="text-nowrap text-xl font-semibold text-white">
            {minPrice === 'min' ? '0' : minPrice}
          </p>
          <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
            {isToken0Selected ? token0.symbol : token1.symbol}/
            {isToken0Selected ? token1.symbol : token0.symbol}
          </p>
        </SolidCard>
        <SolidCard>
          <p className="font-medium text-white/70 md:text-[21px]">Max price</p>
          <p className="text-nowrap text-xl font-semibold text-white">
            {maxPrice === 'max' ? '∞' : maxPrice}
          </p>
          <p className="text-xs text-[#FFFFFF7A] lg:text-sm">
            {isToken0Selected ? token0.symbol : token1.symbol}/
            {isToken0Selected ? token1.symbol : token0.symbol}
          </p>
        </SolidCard>
      </div>

      <div
        className={cn(
          'flex flex-col gap-y-3.5',
          'bg-[#222222]',
          'rounded-[21px]',
          'px-6 py-5 md:px-8 md:py-6',
          'w-full',
        )}
      >
        <p className="font-bold text-white md:text-xl">Position Amounts</p>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 font-semibold">
            <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
            <p className="text-white md:text-lg">
              {token0DepositAmount} {token0.symbol}
            </p>
            <p className="text-xs text-white/50">${token0DepositAmountInUsd.toFixed(2)}</p>
          </div>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-2',
              'font-semibold text-white md:text-xl',
            )}
          >
            <Avatar src={token0.logo} className="h-6 w-6 md:h-7 md:w-7" />
            <Avatar
              src={token0.logo}
              className={cn('h-3 w-3 md:h-3.5 md:w-3.5', 'absolute bottom-0 left-3')}
            />
            {token0.symbol}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 font-semibold">
            <p className="text-[13px] text-white/50 md:text-sm">Depositing</p>
            <p className="text-white md:text-lg">
              {token1DepositAmount} {token1.symbol}
            </p>
            <p className="text-xs text-white/50">${token1DepositAmountInUsd.toFixed(2)}</p>
          </div>
          <div
            className={cn(
              'relative',
              'flex items-center gap-x-2',
              'font-semibold text-white md:text-xl',
            )}
          >
            <Avatar src={token1.logo} className="h-6 w-6 md:h-7 md:w-7" />
            <Avatar
              src={token1.logo}
              className={cn('h-3 w-3 md:h-3.5 md:w-3.5', 'absolute bottom-0 left-3')}
            />
            {token1.symbol}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className={cn('mt-auto flex items-center justify-center gap-x-3', 'w-full')}>
        <button
          onClick={onCancel}
          className={cn(
            'min-h-14 w-full',
            'bg-white/35',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[16px] duration-200',
            'hover:opacity-85',
          )}
        >
          Cancel
        </button>
        <button
          className={cn(
            'min-h-14 w-full',
            'bg-primary-buttons',
            'text-white',
            'mt-auto md:mt-0',
            'select-none rounded-[16px] duration-200',
            'hover:opacity-85',
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
