import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal'; // Assuming Principal is imported from a library like @dfinity/principal
import { Pool } from '../get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { CandidHistoryBucket, CandidPoolHistory, CandidPoolId } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { arePoolsEqual } from '../utils/pool_comparison';
import { HttpAgent, Actor } from '@dfinity/agent';
import { Response } from '@/blockchain_api/types/response';
import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { appic_dex } from "../../../../../canister_ids.json";

// Output interface for individual pool history
interface PoolHistory {
	pool: Pool;
	token0: IcpToken;
	token1: IcpToken;
	daily_volume_usd: string[];
	weekly_volume_usd: string[];
	monthly_volume_usd: string[];
	yearly_volume_usd: string[];
	daily_generated_fees_usd: string[];
	weekly_generated_fees_usd: string[];
	monthly_generated_fees_usd: string[];
	yearly_generated_fees_usd: string[];
	daily_price_token0_in_token1: string[];
	weekly_price_token0_in_token1: string[];
	monthly_price_token0_in_token1: string[];
	yearly_price_token0_in_token1: string[];
	total_24h_volume_usd: string;
	total_24h_collected_fees_usd: string;
	apr: string;
}

export interface DexData {
	total_tvl_usd: string;
	swap_volume_1d_usd: string;
	swap_volume_1m_usd: string;
	swap_volume_1y_usd: string;
	poolHistories: PoolHistory[];
}

export async function get_dex_data(
	unAuthenticated_agent: HttpAgent,
	all_icp_tokens: IcpToken[],
	pools: Pool[]
): Promise<Response<DexData | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: unAuthenticated_agent,
		canisterId: appic_dex,
	});

	try {
		// Fetch pool histories concurrently using Promise.all for multicall efficiency
		const historyPromises = pools.map(pool => dex_actor.get_pool_history(pool.pool_id));
		const historyResults = await Promise.all(historyPromises);

		// Process results to pair pool IDs with their histories, filtering out empty results
		const poolHistories: [CandidPoolId, CandidPoolHistory][] = pools
			.map((pool, index) => {
				const result = historyResults[index] as [] | [CandidPoolHistory];
				return result.length > 0 ? [pool.pool_id, result[0]] : null;
			})
			.filter((entry): entry is [CandidPoolId, CandidPoolHistory] => entry !== null);

		// Transform the data using the provided generateDexData function
		const dex_data = generateDexData(pools, poolHistories, all_icp_tokens);
		return { result: dex_data, success: true, message: '' };
	} catch (error) {
		// Handle any errors during fetching or processing
		return { message: `Failed to get dex data ${error}`, result: undefined, success: false };
	}
}



function generateDexData(
	pools: Pool[],
	poolHistories: [CandidPoolId, CandidPoolHistory][],
	tokens: IcpToken[]
): DexData {
	// Current timestamp in seconds
	const currentTimestamp = BigInt(Math.floor(Date.now() / 1_000));

	// Helper to find token by Principal
	const findToken = (principal: Principal): IcpToken | undefined => {
		return tokens.find((token) => token.canisterId === principal.toText());
	};

	// Helper to convert sqrt_price_x96 to price (token1 per token0)
	const sqrtPriceX96ToPrice = (sqrtPriceX96: string, token0_decimals: number, token1_decimals: number): BigNumber => {
		const sqrtPrice = new BigNumber(sqrtPriceX96).dividedBy(new BigNumber(2).pow(96));
		return sqrtPrice.pow(2).multipliedBy(BigNumber(10).pow(token0_decimals - token1_decimals)); // Returns token1/token0
	};

	// 1. Calculate Total TVL
	const total_tvl_usd = pools.reduce((sum, pool) => {
		return sum.plus(new BigNumber(pool.tvl_usd || '0'));
	}, new BigNumber(0)).toString();

	// 2. Calculate Swap Volume for DEX
	const calculateSwapVolume = (days: number): string => {
		const startTimestamp = currentTimestamp - BigInt(days * 86400);
		let totalVolume = new BigNumber(0);

		poolHistories.forEach((history) => {
			const pool = pools.find((p) => arePoolsEqual(p.pool_id, history[0]));
			if (!pool) return;

			const token0 = findToken(history[0].token0);
			const token1 = findToken(history[0].token1);
			if (!token0 || !token1) return;

			// Use hourly_frame for accurate 1-day volume, daily/monthly/yearly for others
			const buckets = days <= 1 ? history[1].hourly_frame : days <= 30 ? history[1].daily_frame : history[1].yearly_frame;
			buckets.forEach((bucket) => {
				// console.log(bucket.start_timestamp, bucket.end_timestamp);
				if (bucket.start_timestamp >= startTimestamp || bucket.end_timestamp > startTimestamp) {
					const volumeToken0 = new BigNumber(bucket.swap_volume_token0_during_bucket.toString()).dividedBy(
						new BigNumber(10).pow(token0.decimals)
					);
					const volumeToken1 = new BigNumber(bucket.swap_volume_token1_during_bucket.toString()).dividedBy(
						new BigNumber(10).pow(token1.decimals)
					);
					const volumeUsd = volumeToken0
						.multipliedBy(new BigNumber(token0.usdPrice))
						.plus(volumeToken1.multipliedBy(new BigNumber(token1.usdPrice)));
					totalVolume = totalVolume.plus(volumeUsd);
				}
			});
		});

		return totalVolume.toString();
	};

	const swap_volume_1d_usd = calculateSwapVolume(1);
	const swap_volume_1m_usd = calculateSwapVolume(30);
	const swap_volume_1y_usd = calculateSwapVolume(365);

	// 3. Generate PoolHistory for Each Pool
	const poolHistoriesData: PoolHistory[] = pools.map((pool) => {
		const history = poolHistories.find((h) => arePoolsEqual(pool.pool_id, h[0]));
		if (!history) throw new Error(`History not found for pool`);

		const token0 = findToken(pool.pool_id.token0);
		const token1 = findToken(pool.pool_id.token1);
		if (!token0 || !token1) throw new Error(`Tokens not found for pool`);

		// Process buckets for a time frame
		const processBuckets = (buckets: CandidHistoryBucket[]) => {
			const volumes: string[] = [];
			const fees: string[] = [];
			const prices: string[] = [];
			const prices_inverse: string[] = [];

			buckets.forEach((bucket) => {
				// Volume in USD
				const volumeToken0 = new BigNumber(bucket.swap_volume_token0_during_bucket.toString()).dividedBy(
					new BigNumber(10).pow(token0.decimals)
				);
				const volumeToken1 = new BigNumber(bucket.swap_volume_token1_during_bucket.toString()).dividedBy(
					new BigNumber(10).pow(token1.decimals)
				);
				const volumeUsd = volumeToken0
					.multipliedBy(new BigNumber(token0.usdPrice))
					.plus(volumeToken1.multipliedBy(new BigNumber(token1.usdPrice)))
					.toString();

				// Fees in USD
				const feesToken0 = new BigNumber(bucket.fee_generated_token0_during_bucket.toString()).dividedBy(
					new BigNumber(10).pow(token0.decimals)
				);
				const feesToken1 = new BigNumber(bucket.fee_generated_token1_during_bucket.toString()).dividedBy(
					new BigNumber(10).pow(token1.decimals)
				);
				const feesUsd = feesToken0
					.multipliedBy(new BigNumber(token0.usdPrice))
					.plus(feesToken1.multipliedBy(new BigNumber(token1.usdPrice)))
					.toString();

				// Price (token1 per token0, corrected naming)
				const price = sqrtPriceX96ToPrice(bucket.last_sqrtx96_price.toString(), token0.decimals, token1.decimals).toString();
				// Price (token0 per token1)
				const price_inverse = BigNumber(1).dividedBy(price).toString();

				volumes.push(volumeUsd);
				fees.push(feesUsd);
				prices.push(price);
				prices_inverse.push(price_inverse);
			});

			return { volumes, fees, prices, prices_inverse };
		};

		const dailyData = processBuckets(history[1].daily_frame);
		const weeklyData = processBuckets(history[1].daily_frame.slice(-7)); // Last 7 days for weekly
		const monthlyData = processBuckets(history[1].monthly_frame);
		const yearlyData = processBuckets(history[1].yearly_frame);

		// Calculate 24h totals using nanoseconds
		const last24hStart = currentTimestamp - BigInt(86400);
		const last24hBuckets = history[1].hourly_frame.filter(
			(bucket) => bucket.start_timestamp >= last24hStart
		);

		let total_24h_volume_usd = new BigNumber(0);
		let total_24h_collected_fees_usd = new BigNumber(0);

		last24hBuckets.forEach((bucket) => {
			const volumeToken0 = new BigNumber(bucket.swap_volume_token0_during_bucket.toString()).dividedBy(
				new BigNumber(10).pow(token0.decimals)
			);
			const volumeToken1 = new BigNumber(bucket.swap_volume_token1_during_bucket.toString()).dividedBy(
				new BigNumber(10).pow(token1.decimals)
			);
			const volumeUsd = volumeToken0
				.multipliedBy(new BigNumber(token0.usdPrice))
				.plus(volumeToken1.multipliedBy(new BigNumber(token1.usdPrice)));

			const feesToken0 = new BigNumber(bucket.fee_generated_token0_during_bucket.toString()).dividedBy(
				new BigNumber(10).pow(token0.decimals)
			);
			const feesToken1 = new BigNumber(bucket.fee_generated_token1_during_bucket.toString()).dividedBy(
				new BigNumber(10).pow(token1.decimals)
			);
			const feesUsd = feesToken0
				.multipliedBy(new BigNumber(token0.usdPrice))
				.plus(feesToken1.multipliedBy(new BigNumber(token1.usdPrice)));

			total_24h_volume_usd = total_24h_volume_usd.plus(volumeUsd);
			total_24h_collected_fees_usd = total_24h_collected_fees_usd.plus(feesUsd);
		});

		// Calculate APR
		const tvl_usd = new BigNumber(pool.tvl_usd || '0');
		const daily_fees_usd = total_24h_collected_fees_usd;
		const annual_fees_usd = daily_fees_usd.multipliedBy(365);
		const apr = tvl_usd.isGreaterThan(0) ? annual_fees_usd.dividedBy(tvl_usd).multipliedBy(100).toString() : '0';


		return {
			pool,
			token0,
			token1,
			daily_volume_usd: dailyData.volumes,
			weekly_volume_usd: weeklyData.volumes,
			monthly_volume_usd: monthlyData.volumes,
			yearly_volume_usd: yearlyData.volumes,
			daily_generated_fees_usd: dailyData.fees,
			weekly_generated_fees_usd: weeklyData.fees,
			monthly_generated_fees_usd: monthlyData.fees,
			yearly_generated_fees_usd: yearlyData.fees,
			daily_price_token0_in_token1: dailyData.prices, // Note: actually token1/token0, see below
			weekly_price_token0_in_token1: weeklyData.prices,
			monthly_price_token0_in_token1: monthlyData.prices,
			yearly_price_token0_in_token1: yearlyData.prices,

			daily_price_token1_in_token0: dailyData.prices_inverse, // Note: actually token0/token1, see below
			weekly_price_token1_in_token: weeklyData.prices_inverse,
			monthly_price_token1_in_token0: monthlyData.prices_inverse,
			yearly_price_token1_in_token0: yearlyData.prices_inverse,

			total_24h_volume_usd: total_24h_volume_usd.toString(),
			total_24h_collected_fees_usd: total_24h_collected_fees_usd.toString(),

			apr,
		};
	});

	return {
		total_tvl_usd,
		swap_volume_1d_usd,
		swap_volume_1m_usd,
		swap_volume_1y_usd,
		poolHistories: poolHistoriesData,
	};
}
export { generateDexData };
