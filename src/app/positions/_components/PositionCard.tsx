import { Position } from '@/blockchain_api/functions/icp/dex/get_positions';
import { Avatar } from '@/components/common/ui/avatar';
import SolidCard from '@/components/ui/cards/SolidCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const PositionCard = ({ position }: { position: Position }) => {
  return (
    <Link href="positions/detail" className={cn('bg-[#222222]', 'rounded-[21px]')}>
      <div className={cn('flex items-start justify-between', 'px-6 pb-5 pt-5 md:px-8 md:pt-6')}>
        <div className="flex items-center gap-x-2.5">
          <div className="relative flex">
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className="h-[34px] w-[34px] md:h-[46px] md:w-[46px]"
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/"
              className={cn('h-[34px] w-[34px] md:h-[46px] md:w-[46px]', '-ml-4')}
            />
            <Avatar
              // src={token?.logo}
              src="/images/logo/icp-logo.svg"
              className={cn(
                'h-[13px] w-[13px] md:h-[17px] md:w-[17px]',
                'absolute bottom-1 right-0',
              )}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-medium md:text-2xl">USDC/ETH</p>
            <p
              className={cn(
                'flex items-center gap-x-1.5 text-[13px]',
                position.is_in_range ? 'text-[#77EF4B]' : 'text-[#EE5D5D]',
              )}
            >
              <span
                className={cn(
                  'h-[9px] w-[9px] rounded-full',
                  position.is_in_range ? 'bg-[#77EF4B]' : 'bg-[#EE5D5D]',
                )}
              />
              {position.is_in_range ? 'In range' : 'Out of range'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <SolidCard size="sm">
            <span className="text-xs leading-5 text-white/60">{position.total_fees_owed_usd}%</span>
          </SolidCard>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-4',
          'px-6 pb-3.5 pt-6 md:px-8 md:pb-[18px] md:pt-3.5',
          'border-t border-t-white/5',
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-lg">${position.total_reserves_usd}</span>
          <span className="text-[13px] font-semibold text-white/50">Position</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-lg">${position.total_fees_owed_usd}</span>
          <span className="text-[13px] font-semibold text-white/50">Fees</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-lg">-</span>
          <span className="text-[13px] font-semibold text-white/50">APR</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-lg">-</span>
          <span className="text-[13px] font-semibold text-white/50">Full range</span>
        </div>
      </div>
    </Link>
  );
};

export default PositionCard;
