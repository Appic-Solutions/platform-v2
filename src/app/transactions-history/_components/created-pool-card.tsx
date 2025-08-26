import AvatarGroup from '@/app/positions/_components/AvatarGroup';
import { CreatedPoolHistory } from '@/blockchain_api/functions/icp/get_bridge_history';
import SolidCard from '@/components/ui/cards/SolidCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CreatedPoolCard({ token0, token1, pool_fee }: CreatedPoolHistory) {
  return (
    <Link
      href="positions/details"
      className={cn('cursor-pointer rounded-2xl bg-[#222222] lg:rounded-3xl')}
    >
      <div className={cn('flex items-start justify-between', 'p-4 md:p-6')}>
        <div className="flex items-center gap-x-2.5">
          <AvatarGroup avatar0={token0.logo} avatar1={token1.logo} />
          <p className="text-lg font-medium md:text-xl">
            {token0.symbol}/{token1.symbol}
          </p>
        </div>
        <SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
          <span className="text-xs leading-5 text-white/60">{Number(pool_fee) / 10000}%</span>
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
          <span className="text-sm font-semibold md:text-base">$total_reserves_usd</span>
          <span className="text-[13px] font-semibold text-white/50">Position</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold md:text-base">$total_fees_owed_usd</span>
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
    </Link>
  );
}
