'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get_single_pool_data } from '@/blockchain_api/functions/icp/dex/explore/get_pool_history';
import { useSharedStore } from '@/store/store';
import { HttpAgent } from '@dfinity/agent';
import { Pool } from '@/blockchain_api/functions/icp/dex/get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';
import Box from '@/components/ui/box';
import { cn, copyToClipboard } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon, SwapHorizontalIcon } from '@/components/icons';
import { Avatar } from '@/components/common/ui/avatar';
import { CopyIcon } from 'lucide-react';
import ChartSection from './chart-section';
import SkeletonSection from './skeleton';
import { CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { queryKeys } from '@/lib/constants/query-keys';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';

interface PositionDetailProps extends CandidPoolId {
	clearDataHandler: () => void;
}

export default function PositionDetail({
	token0,
	token1,
	fee,
	clearDataHandler,
}: PositionDetailProps) {
	const { unAuthenticatedAgent } = useSharedStore();
	const [isTokenSwap, setIsTokenSwap] = useState(false);
	const icpPools = useTypedQueryData(queryKeys.icpPools);
	const icpTokens = useTypedQueryData(queryKeys.icpTokens);

	useEffect(() => {
		if (!token0 || !token1 || !fee) {
			clearDataHandler();
		}
	}, [token0, token1, fee]);

	const { data, isLoading } = useQuery({
		queryKey: ['explore-data', token0, token1],
		queryFn: async () => {
			if (!token0 || !token1 || !fee) return undefined;

			return await get_single_pool_data(
				unAuthenticatedAgent as HttpAgent,
				{
					token0,
					token1,
					fee,
				},
				icpTokens as IcpToken[],
				icpPools as Pool[],
			);
		},
		enabled:
			!!unAuthenticatedAgent &&
			!!icpTokens?.length &&
			!!icpPools?.length &&
			!!token0 &&
			!!token1 &&
			!!fee,
	});

	const value0 = Number(data?.result?.pool?.human_readable_reserves0 ?? 0);
	const value1 = Number(data?.result?.pool?.human_readable_reserves1 ?? 0);
	const total = value0 + value1;
	const percent0 = total > 0 ? (value0 / total) * 100 : 0;
	const percent1 = total > 0 ? (value1 / total) * 100 : 0;

	return (
		<Box
			className={cn(
				'md:overflow-y-hidden',
				'gap-y-6 md:flex-row md:gap-x-16',
				'md:max-h-[789px] md:w-full md:max-w-[1204px]',
			)}
		>
			{data?.success ? (
				<>
					{/* Chart Section */}
					<div className="flex w-full flex-col gap-y-[31px]">
						<div className="flex items-center justify-between gap-3">
							<div
								className={cn(
									'flex items-center gap-x-3',
									'text-2xl font-bold text-white md:text-3xl',
								)}
							>
								<div className="flex items-center gap-x-2">
									<ArrowLeftIcon
										onClick={() => clearDataHandler()}
										className="z-10 cursor-pointer"
									/>
									<Avatar
										src={isTokenSwap ? data.result?.token1.logo : data.result?.token0.logo}
										className="h-8 w-8 md:h-12 md:w-12"
									/>
									<Avatar
										src={isTokenSwap ? data.result?.token0.logo : data.result?.token1.logo}
										className="-ml-3 h-8 w-8 md:-ml-4 md:h-12 md:w-12"
									/>
								</div>
								{isTokenSwap
									? `${data?.result?.token1.symbol}/${data.result?.token0.symbol}`
									: `${data?.result?.token0.symbol}/${data.result?.token1.symbol}`}
								<SwapHorizontalIcon
									width={22}
									height={22}
									className="cursor-pointer justify-self-end text-white/40"
									onClick={() => setIsTokenSwap((prev) => !prev)}
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
									{Number(data.result?.pool.pool_id.fee) / 10000}%
								</div>
							</div>
						</div>
						{/* Chart Section */}
						<ChartSection data={data.result} priceSwap={isTokenSwap} />
					</div>

					{/* Stats Section */}
					<div className="flex w-full flex-col gap-y-6 md:max-w-[400px]">
						<div className="flex flex-col gap-y-2">
							<p className="text-xl font-bold text-white md:text-2xl">Stats</p>
							<div
								className={cn(
									'flex flex-col gap-y-3',
									'rounded-2xl md:rounded-[20px]',
									'bg-[#222222] p-6',
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
									<p className="flex flex-col gap-y-1 font-bold text-white md:text-lg">
										${Number(data?.result?.pool?.tvl_usd).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-[#898989]">24H volume</p>
									<p className="flex flex-col gap-y-1 font-bold text-white md:text-lg">
										${Number(data?.result?.total_24h_volume_usd || 0).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-[#898989]">24H fees</p>
									<p className="flex flex-col gap-y-1 font-bold text-white md:text-lg">
										${Number(data?.result?.total_24h_collected_fees_usd || 0).toFixed(2)}
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-y-2">
							<p className="text-xl font-bold text-white md:text-2xl">Links</p>
							<div
								className={cn(
									'flex flex-col gap-y-3',
									'rounded-2xl md:rounded-[20px]',
									'bg-[#222222] p-6',
									'text-sm font-medium text-white',
									'*:flex *:items-center *:justify-between *:gap-3',
								)}
							>
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
								'text-sm font-medium',
								'*:flex *:flex-1 *:items-center *:justify-center *:gap-1',
								'*:bg-primary-buttons *:text-white',
								'*:rounded-lg *:p-2.5',
							)}
						>
							<Link href="/swap">
								<SwapHorizontalIcon width={20} height={20} />
								Swap
							</Link>
							<Link href="/positions/create">
								<PlusIcon width={20} height={20} />
								Add liquidity
							</Link>
						</div>
					</div>
				</>
			) : isLoading ? (
				<SkeletonSection />
			) : (
				data?.message
			)}
		</Box>
	);
}
