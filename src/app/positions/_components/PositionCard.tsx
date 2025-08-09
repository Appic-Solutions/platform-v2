import SolidCard from '@/components/ui/cards/SolidCard';
import { cn } from '@/lib/utils';
import React from 'react';
import { FormattedPosition } from '../types';
import AvatarGroup from './AvatarGroup';

const PositionCard = ({
  position,
  onSelectHandler,
}: {
  position: FormattedPosition;
  onSelectHandler: (position: FormattedPosition) => void;
}) => {
  return (
    <div
      className={cn('cursor-pointer rounded-2xl bg-[#222222] lg:rounded-3xl')}
      onClick={() => onSelectHandler(position)}
    >
      <div className={cn('flex items-start justify-between', 'p-4 md:p-6')}>
        <div className="flex items-center gap-x-2.5">
          <AvatarGroup avatar0={position.token0.logo} avatar1={position.token1.logo} />
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-medium md:text-xl">
              {position.token0.symbol}/{position.token1.symbol}
            </p>
            <p
              className={cn(
                'flex items-center gap-x-1.5 text-xs',
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
            {Number(position.key.pool.fee) / 10000}%
          </span>
        </SolidCard>
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-4',
          'px-4 pb-3.5 pt-4 md:px-6 md:pb-[18px] md:pt-3.5',
          'border-t border-t-white/5',
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-base">${position.total_reserves_usd}</span>
          <span className="text-[13px] font-semibold text-white/50">Position</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-base">
            ${position.total_fees_owed_usd}
          </span>
          <span className="text-[13px] font-semibold text-white/50">Fees</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-base">-</span>
          <span className="text-[13px] font-semibold text-white/50">APR</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-base">-</span>
          <span className="text-[13px] font-semibold text-white/50">Full range</span>
        </div>
      </div>
    </div>
  );
};

export default PositionCard;
