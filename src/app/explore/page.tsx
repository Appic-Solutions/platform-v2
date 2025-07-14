'use client';

import StatusBox from './_components/status-box';
import Box from '@/components/ui/box';
import Skeleton from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PlusIcon, PoolIcon } from '@/components/icons';
import RHFInput from '@/components/form/rhf-input';
import ExplorePageLogic from './_logic';
import { FormProvider } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/common/ui/avatar';

export default function ExplorePage() {
  const router = useRouter();

  const { methods, stats, filteredPools, isLoading } = ExplorePageLogic();

  return (
    <Box
      className={cn(
        'md:overflow-y-hidden',
        'gap-y-10 md:gap-y-14',
        'md:max-h-[789px] md:w-full md:max-w-[1204px]',
        'md:px-11 md:pb-5 md:pt-11',
      )}
    >
      {/* Status Section */}
      <section className={cn('w-full overflow-x-auto', 'flex items-center gap-x-2.5 md:gap-x-5')}>
        {isLoading ? (
          <Skeleton className="min-h-[118px] w-full" />
        ) : (
          stats.map(({ volume, value }, i) => <StatusBox key={i} volume={volume} value={value} />)
        )}
      </section>

      {/* Content Section */}
      <section className="flex w-full flex-col gap-y-3 md:gap-y-4">
        {/* Filter Section */}
        <div className="flex flex-col items-center gap-5 xs:flex-row xs:justify-between">
          <div
            className={cn(
              'flex items-center gap-x-1.5',
              'text-lg font-medium text-white md:text-[22px]',
            )}
          >
            <PoolIcon width={24} height={24} />
            Pools
          </div>
          <FormProvider {...methods}>
            <form className="flex items-center gap-3">
              <Link
                href="/pool/create"
                className={cn(
                  'flex min-w-fit items-center justify-center',
                  'text-[13px] font-medium md:text-[15px]',
                  'rounded-[10px] p-2.5',
                  'bg-primary-buttons text-white',
                )}
              >
                <PlusIcon className="h-[14px] w-[14px] md:h-[17px] md:w-[17px]" />
                Add liquidity
              </Link>
              <RHFInput
                name="search"
                placeholder="Search token"
                className="pl-4"
                disabled={isLoading}
              />
            </form>
          </FormProvider>
        </div>
        {/* Table Section */}
        <div className="w-full overflow-auto md:max-h-[480px]">
          {isLoading ? (
            <Skeleton className="min-h-[480px] w-full" />
          ) : (
            <table className="w-full min-w-[900px] table-fixed overflow-hidden rounded-[21px]">
              <thead
                className={cn(
                  'border-b border-b-[#555555]',
                  'h-12 bg-[#323232]',
                  'font-semibold text-[#8D8D8D]',
                )}
              >
                <tr>
                  <th className="w-20">#</th>
                  <th colSpan={2} className="text-left">
                    Pool
                  </th>
                  <th>Fee</th>
                  <th>TVL</th>
                  <th>APR</th>
                  <th>1D vol</th>
                  <th>30D vol</th>
                </tr>
              </thead>
              <tbody>
                {methods.getValues('search') && filteredPools.length === 0 ? (
                  <tr
                    className={cn(
                      'text-center text-sm text-white',
                      'border-b border-b-[#393939]',
                      'h-12 bg-[#272727] hover:bg-[#2C2C2C]',
                      'cursor-pointer transition-all duration-200 ease-in-out',
                    )}
                  >
                    <td colSpan={7} className="py-6 text-center text-white">
                      No pools found.
                    </td>
                  </tr>
                ) : (
                  filteredPools.map((item, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        'text-center text-sm text-white',
                        'border-b border-b-[#393939]',
                        'h-12 bg-[#272727] hover:bg-[#2C2C2C]',
                        'cursor-pointer transition-all duration-200 ease-in-out',
                      )}
                      onClick={() => {
                        const token0Id = item.token0.canisterId;
                        const token1Id = item.token1.canisterId;
                        const fee = Number(item.pool.pool_id.fee);
                        router.push(`/edit/${token0Id}-${token1Id}-${fee}`);
                      }}
                    >
                      <td>{idx + 1}</td>
                      <td colSpan={2} className="text-left">
                        <div className="flex items-center gap-x-1.5">
                          <div className="flex">
                            <Avatar src={item.token0.logo} className="h-5 w-5" />
                            <Avatar src={item.token1.logo} className="-ml-2 h-5 w-5" />
                          </div>
                          {`${item.token0.symbol}/${item.token1.symbol}`}
                        </div>
                      </td>
                      <td>{(Number(item.pool.pool_id.fee) / 10000).toFixed(2)}%</td>
                      <td>${Number(item.pool.tvl_usd).toFixed(2)}</td>
                      <td>{item.apr ? `${Number(item.apr).toFixed(2)}%` : '0%'}</td>
                      <td>${Number(item.total_24h_volume_usd || 0).toFixed(2)}</td>
                      <td>${Number(item.total_24h_volume_usd || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </Box>
  );
}
