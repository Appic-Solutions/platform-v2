'use client';
import { cn, getChainLogo, getChainName } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import useLogic from '../_logic';
import Spinner from '@/components/ui/spinner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import SolidCard from '@/components/ui/cards/SolidCard';
import { Avatar } from '@/components/common/ui/avatar';
import { BlockchainIcon } from '@/components/icons';

type dexDataTypes =
	| 'All'
	| 'Swap'
	| 'CreatedPool'
	| 'BurntPosition'
	| 'IncreasedLiquidity'
	| 'CollectedFees'
	| 'DecreasedLiquidity'
	| 'MintedPosition';

const types = [
	{ label: 'All', value: 'All' },
	{ label: 'Swap', value: 'Swap' },
	{ label: 'Collected Fees', value: 'CollectedFees' },
	{ label: 'Created Pools', value: 'CreatedPool' },
	{ label: 'Burnt Positions', value: 'BurntPosition' },
	{ label: 'Increased Liquidity', value: 'IncreasedLiquidity' },
	{ label: 'Decreased Liquidity', value: 'DecreasedLiquidity' },
	{ label: 'Minted Positions', value: 'MintedPosition' },
];

export default function DexContent() {
	const [activeType, setActiveType] = useState<dexDataTypes>('All');
	const { dexData, isLoading, isError } = useLogic();

	const filteredData = dexData?.filter((item) =>
		activeType === 'All' ? true : item.type === activeType,
	);

	if (isError) {
		return (
			<div
				className={cn(
					'flex h-full items-center justify-center text-xl',
					'mx-auto max-w-[490px] px-6 text-center text-white',
				)}
			>
				Failed To Get Dex History
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="my-auto flex items-center justify-center md:absolute md:inset-0">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<Select value={activeType} onValueChange={(value: dexDataTypes) => setActiveType(value)}>
				<SelectTrigger className="absolute right-0 top-0 z-50 h-9 max-w-28 border-2 border-box-border text-xs text-white md:right-8 md:top-8 md:max-w-[150px]">
					<SelectValue placeholder="Select type" />
				</SelectTrigger>
				<SelectContent
					className={cn(
						'bg-input-fields bg-cover bg-center bg-no-repeat shadow-md backdrop-blur-[30px]',
						'border-2 border-box-border text-xs text-white',
					)}
				>
					{types.map((type, idx) => (
						<SelectItem key={idx} value={type.value} className="cursor-pointer">
							{type.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{filteredData && filteredData.length > 0 ? (
				filteredData.map((item, idx) => {
					const { date, time, status, type, label } = item;

					return (
						<div
							className={cn(
								'overflow-hidden',
								'flex w-full flex-col gap-y-4 bg-input-fields bg-cover bg-center bg-no-repeat shadow-md',
								'rounded-2xl p-5 backdrop-blur-[30px] duration-200 hover:bg-black/75',
								'md:rounded-[36px] md:p-6',
							)}
						>
							{/* Date & Time */}
							<div
								className={cn(
									'flex items-center justify-between gap-x-4',
									'text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
								)}
							>
								<p>{date}</p>
								<p>{time}</p>
							</div>

							{/* Type-specific rendering */}
							{type === 'Swap' ? (
								<div className="flex w-full items-center justify-between *:relative">
									{/* Token In */}
									<div>
										<Avatar src={item.token_in.logo} className="h-12 w-12" />
										<Avatar
											src={getChainLogo(item.token_in.chainId)}
											className="absolute -bottom-1 -right-1 h-5 w-5 shadow"
										/>
									</div>

									{/* Arrow */}
									<div className="flex w-full items-center justify-center">
										<div
											className={cn(
												'flex-1 border-t-[3px]',
												status === 'Failed' ? 'border-red-500' : 'border-green-500',
											)}
										/>
										<div
											className={cn(
												'relative z-10 rounded-full p-2.5',
												status === 'Failed'
													? 'border-2 border-red-500'
													: 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
											)}
										>
											<BlockchainIcon className="h-5 w-5 text-white md:h-6 md:w-6" />
										</div>
										<div
											className={cn(
												'flex-1 border-t-[3px]',
												status === 'Failed' ? 'border-red-500' : 'border-green-500',
											)}
										/>
									</div>

									{/* Token Out */}
									<div>
										<Avatar src={item.token_out.logo} className="h-12 w-12" />
										<Avatar
											src={getChainLogo(item.token_out.chainId)}
											className="absolute -bottom-1 -right-1 h-5 w-5 shadow"
										/>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-x-2.5">
										<div className="flex items-center">
											<Avatar src={item.token0.logo} className="h-12 w-12" />
											<Avatar src={item.token1.logo} className="-ml-4 h-12 w-12" />
										</div>
										<p className="text-lg font-medium text-white md:text-xl">
											{item.token0.symbol}/{item.token1.symbol}
										</p>
									</div>
									{'pool_fee' in item && item.pool_fee ? (
										<SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
											<span className="text-xs leading-5 text-white/60">
												{Number(item.pool_fee) / 10000}%
											</span>
										</SolidCard>
									) : 'position' in item && item.position ? (
										<SolidCard size="sm" className="w-max bg-[#FFFFFF1A]">
											<span className="text-xs leading-5 text-white/60">
												{Number(item.position.pool_id.fee) / 10000}%
											</span>
										</SolidCard>
									) : null}
								</div>
							)}

							{/* Footer */}
							<div
								className={cn(
									'flex items-center justify-between gap-x-4 text-xs font-bold',
									'max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
									'*:flex *:flex-1 *:flex-col *:justify-center',
								)}
							>
								<div>
									<p>
										{type === 'Swap'
											? `${item.token_in.symbol} on ${getChainName(item.token_in.chainId)}`
											: `${item.token0.symbol} Amount`}
									</p>
									<p className="text-xl leading-7 max-md:text-white">
										{type === 'Swap'
											? Number(item.human_readable_final_amount_in).toFixed(5)
											: 'human_readable_amount0_paid' in item
												? Number(item.human_readable_amount0_paid).toFixed(5)
												: 'human_readable_amount0_received' in item
													? Number(item.human_readable_amount0_received).toFixed(5)
													: 'human_readable_amount0_collected' in item
														? Number(item.human_readable_amount0_collected).toFixed(5)
														: ''}
									</p>
								</div>

								<div className="items-center text-center max-md:hidden">
									{status === 'Successful' ? `Successful ${label}` : `${label} Failed`}
								</div>

								<div className="items-end">
									<p>
										{type === 'Swap'
											? `${item.token_out.symbol} on ${getChainName(item.token_out.chainId)}`
											: `${item.token1.symbol} Amount`}
									</p>
									<p className="text-xl leading-7 max-md:text-white">
										{type === 'Swap'
											? Number(item.human_readable_final_amount_out).toFixed(5)
											: 'human_readable_amount1_paid' in item
												? Number(item.human_readable_amount1_paid).toFixed(5)
												: 'human_readable_amount1_received' in item
													? Number(item.human_readable_amount1_received).toFixed(5)
													: 'human_readable_amount1_collected' in item
														? Number(item.human_readable_amount1_collected).toFixed(5)
														: ''}
									</p>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div className="flex flex-col items-center justify-center gap-y-10 text-center text-2xl text-white md:absolute md:inset-0">
					<Image src="/images/empty.png" alt="Empty" width={100} height={100} />
					Empty Dex History
				</div>
			)}
		</>
	);
}
