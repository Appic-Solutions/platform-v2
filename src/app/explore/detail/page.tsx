'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { get_single_pool_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { useSharedStore } from '@/store/store';
import { HttpAgent } from '@dfinity/agent';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';
import Box from '@/components/ui/box';
import { cn, copyToClipboard } from '@/lib/utils';
import Link from 'next/link';
import { PlusIcon, SwapHorizontalIcon } from '@/components/icons';
import { Avatar } from '@/components/common/ui/avatar';
import { CopyIcon } from 'lucide-react';
import ChartSection from '../_components/chart-section';

export default function ExploreDetailPage() {
  const { unAuthenticatedAgent, icpTokens, pools } = useSharedStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const token0Id = searchParams.get('token0');
  const token1Id = searchParams.get('token1');
  const fee = searchParams.get('fee');

  const token0 = token0Id ? Principal.fromText(token0Id) : undefined;
  const token1 = token1Id ? Principal.fromText(token1Id) : undefined;
  const feeBigInt = fee ? BigInt(fee) : undefined;

  useEffect(() => {
    if (!token0Id || !token1Id || !fee) {
      router.push('/explore');
    }
  }, [token0Id, token1Id, fee]);

  const { data, isLoading } = useQuery({
    queryKey: ['explore-data', token0Id, token1Id, fee],
    queryFn: async () => {
      if (!token0 || !token1 || !feeBigInt) return undefined;

      return await get_single_pool_data(
        unAuthenticatedAgent as HttpAgent,
        {
          token0,
          token1,
          fee: feeBigInt,
        },
        icpTokens as IcpToken[],
        pools as Pool[],
      );
    },
    enabled:
      !!unAuthenticatedAgent &&
      !!icpTokens?.length &&
      !!pools?.length &&
      !!token0 &&
      !!token1 &&
      !!feeBigInt,
  });

  console.log('🚀 -----------------------------------🚀');
  console.log('🚀 ~ ExploreDetailPage ~ data:', data);
  console.log('🚀 -----------------------------------🚀');

  const value0 = Number(data?.result?.pool?.reserves0_usd ?? 0);
  const value1 = Number(data?.result?.pool?.reserves1_usd ?? 0);
  const total = value0 + value1;
  const percent0 = total > 0 ? (value0 / total) * 100 : 0;
  const percent1 = total > 0 ? (value1 / total) * 100 : 0;

  return data?.success ? (
    <Box
      className={cn(
        'md:overflow-y-hidden',
        'gap-y-10 md:flex-row md:gap-x-16 md:gap-y-14',
        'md:max-h-[789px] md:w-full md:max-w-[1204px]',
        'md:p-11',
      )}
    >
      {/* Chart Section */}
      <div className="flex w-full flex-col gap-y-8">
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              'flex items-center gap-x-3',
              'text-[27px] font-bold text-white md:text-[40px]',
            )}
          >
            <div className="flex">
              <Avatar src={data.result?.token0.logo} className="h-8 w-8 md:h-12 md:w-12" />
              <Avatar
                src={data.result?.token1.logo}
                className="-ml-3 h-8 w-8 md:-ml-4 md:h-12 md:w-12"
              />
            </div>
            {`${data?.result?.token0.symbol}/${data.result?.token1.symbol}`}
            <SwapHorizontalIcon
              width={22}
              height={22}
              className="cursor-pointer justify-self-end text-white/40"
            />
          </div>
          <div className="flex items-center justify-start gap-x-1">
            <div
              className={cn(
                'rounded-[6px] bg-white/10',
                'px-1.5 py-px',
                'text-xs leading-5 text-white/60',
              )}
            >
              V3
            </div>
            <div
              className={cn(
                'rounded-[6px] bg-white/10',
                'px-1.5 py-px',
                'text-xs leading-5 text-white/60',
              )}
            >
              1%
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2.5">
          <p className="text-xl font-semibold text-white md:text-[34px]">Tell Me What !</p>
          <div className="text-sm font-medium text-[#898989] md:text-base">Tell Me What !</div>
        </div>
        {/* Chart Section */}
        <ChartSection data={data.result} />
      </div>

      {/* Stats Section */}
      <div className="flex w-full flex-col gap-y-10 md:max-w-[440px] md:gap-y-6">
        <div className="flex flex-col gap-y-2 md:gap-y-2.5">
          <p className="text-xl font-bold text-white md:text-2xl">Stats</p>
          <div
            className={cn(
              'flex flex-col gap-y-4',
              'rounded-2xl md:rounded-[21px]',
              'bg-[#222222] p-6 md:p-8',
              '*:flex *:flex-col *:gap-y-1',
            )}
          >
            <div>
              <p className="text-sm font-medium text-[#898989]">Pool balances</p>
              <div className="flex flex-col gap-y-1">
                <div
                  className={cn(
                    'flex items-center justify-between',
                    'text-xs font-bold text-white/80 md:text-base md:text-white',
                  )}
                >
                  <p>
                    {value0.toLocaleString()} {data.result?.token0.symbol}
                  </p>
                  <p>
                    {value1.toLocaleString()} {data.result?.token1.symbol}
                  </p>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#1C68F8]/70"
                    style={{ width: `${percent0}%` }}
                    title={`${data.result?.token0.symbol}: $${value0.toFixed(2)}`}
                  />
                  <div
                    className="h-full bg-[#FF2C8B]/70"
                    style={{ width: `${percent1}%` }}
                    title={`${data.result?.token1.symbol}: $${value1.toFixed(2)}`}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#898989]">TVL</p>
              <p className="flex flex-col gap-y-1 font-bold text-white md:text-[22px]">
                {(Number(data?.result?.pool?.pool_id.fee) / 10000).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#898989]">24H volume</p>
              <p className="flex flex-col gap-y-1 font-bold text-white md:text-[22px]">
                ${Number(data?.result?.total_24h_volume_usd || 0).toFixed(2)}$
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#898989]">24H fees</p>
              <p className="flex flex-col gap-y-1 font-bold text-white md:text-[22px]">
                ${Number(data?.result?.total_24h_collected_fees_usd || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 md:gap-y-2.5">
          <p className="text-xl font-bold text-white md:text-2xl">Links</p>
          <div
            className={cn(
              'flex flex-col gap-y-3 md:gap-y-4',
              'rounded-2xl md:rounded-[21px]',
              'bg-[#222222] p-6 md:p-8',
              'text-sm font-medium text-white',
              '*:flex *:items-center *:justify-between *:gap-3',
            )}
          >
            <div>
              <div className="flex items-center gap-x-1.5">
                <div className="flex">
                  <Avatar src={data.result?.token0.logo} className="h-5 w-5" />
                  <Avatar src={data.result?.token1.logo} className="-ml-1.5 h-5 w-5" />
                </div>
                {`${data?.result?.token0.symbol}/${data.result?.token1.symbol}`}
              </div>
              <div
                className={cn(
                  'flex items-center gap-x-1.5 rounded-full',
                  'px-4 py-1.5',
                  'text-xs font-bold md:text-sm',
                  'bg-gradient-to-tr from-black to-[#1D1D1D]',
                )}
              >
                Tell Me What !
                <CopyIcon
                  width={13}
                  height={13}
                  className="cursor-pointer"
                  onClick={() => copyToClipboard('Tell Me What !')}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-1.5">
                <Avatar src={data.result?.token0.logo} className="h-5 w-5" />
                {data?.result?.token0.symbol}
              </div>
              <div
                className={cn(
                  'flex items-center gap-x-1.5 rounded-full',
                  'px-4 py-1.5',
                  'text-xs font-bold md:text-sm',
                  'bg-gradient-to-tr from-black to-[#1D1D1D]',
                )}
              >
                {data.result?.token0.canisterId.slice(0, 20)}
                <CopyIcon
                  width={13}
                  height={13}
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(data.result?.token0.canisterId as string)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-1.5">
                <Avatar src={data.result?.token1.logo} className="h-5 w-5" />
                {data?.result?.token1.symbol}
              </div>
              <div
                className={cn(
                  'flex items-center gap-x-1.5 rounded-full',
                  'px-4 py-1.5',
                  'text-xs font-bold md:text-sm',
                  'bg-gradient-to-tr from-black to-[#1D1D1D]',
                )}
              >
                {data.result?.token1.canisterId.slice(0, 20)}
                <CopyIcon
                  width={13}
                  height={13}
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(data.result?.token1.canisterId as string)}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-center gap-3 md:gap-4',
            'text-[13px] font-medium md:text-[15px]',
            '*:flex *:flex-1 *:items-center *:justify-center *:gap-1',
            '*:bg-primary-buttons *:text-white',
            '*:rounded-[10px] *:p-2.5',
          )}
        >
          <Link href="/swap">
            <SwapHorizontalIcon width={20} height={20} />
            Swap
          </Link>
          <Link href="/pool/create">
            <PlusIcon width={20} height={20} />
            Add liquidity
          </Link>
        </div>
      </div>
    </Box>
  ) : (
    <Box
      className={cn(
        'md:overflow-y-hidden',
        'items-center justify-center',
        'gap-y-10 md:flex-row md:gap-x-16 md:gap-y-14',
        'md:h-96 md:w-full md:max-w-[1204px]',
        'md:p-11',
        'text-center text-3xl font-medium text-white',
      )}
    >
      {isLoading ? <>Loading Data ...</> : data?.message}
    </Box>
  );
}
