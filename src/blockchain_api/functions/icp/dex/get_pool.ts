import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CandidPoolState, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";
import { FEE_TIERS } from "./constants";
import { Principal } from "@dfinity/principal";
import { sortTokens } from "./utils/token_order";
import BigNumber from 'bignumber.js';
import { IcpToken } from "@/blockchain_api/types/tokens";
import { TickMath } from "./utils/tick_math";

export interface Pool {
	pool_id: CandidPoolId,
	sqrt_price_x96: string,
	pool_reserves0: string,
	pool_reserves1: string,
	fee_protocol: string,
	token0_transfer_fee: string,
	swap_volume1_all_time: string,
	fee_growth_global_1_x128: string,
	tick: string,
	liquidity: string,
	generated_swap_fee0: string,
	generated_swap_fee1: string,
	swap_volume0_all_time: string,
	fee_growth_global_0_x128: string,
	max_liquidity_per_tick: string,
	token1_transfer_fee: string,
	tick_spacing: string,
	reserves0_usd?: string,
	reserves1_usd?: string,
	tvl_usd?: string,
	swap_volume_all_time_usd?: string,
	generated_swap_fee0_usd?: string,
	generated_swap_fee1_usd?: string,
	generated_swap_fee_all_time_usd?: string,
	token0_usd_price?: string,
	token1_usd_price?: string,
	token0_price_in_token1?: string,
	token1_price_in_token0?: string,
}

const CKUSDC_CANISTER_ID = "xevnm-gaaaa-aaaar-qafnq-cai";
export const Q96 = new BigNumber(2).pow(96);

function transformPool(poolId: CandidPoolId, poolState: CandidPoolState, getTokenInfo: (principal: Principal) => IcpToken | undefined): Pool {
	const token0Info = getTokenInfo(poolId.token0);
	const token1Info = getTokenInfo(poolId.token1);

	if (!token0Info || !token1Info) {
		const partialPool: Pool = {
			pool_id: poolId,
			sqrt_price_x96: poolState.sqrt_price_x96.toString(),
			pool_reserves0: poolState.pool_reserves0.toString(),
			pool_reserves1: poolState.pool_reserves1.toString(),
			fee_protocol: poolState.fee_protocol.toString(),
			token0_transfer_fee: poolState.token0_transfer_fee.toString(),
			swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
			fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
			tick: poolState.tick.toString(),
			liquidity: poolState.liquidity.toString(),
			generated_swap_fee0: poolState.generated_swap_fee0.toString(),
			generated_swap_fee1: poolState.generated_swap_fee1.toString(),
			swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
			fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
			max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
			token1_transfer_fee: poolState.token1_transfer_fee.toString(),
			tick_spacing: poolState.tick_spacing.toString(),
		};
		return partialPool;
	}

	const decimals0 = token0Info.decimals;
	const decimals1 = token1Info.decimals;
	const sqrtPriceX96 = new BigNumber(poolState.sqrt_price_x96.toString());
	const P = sqrtPriceX96.div(Q96).pow(2);

	const isToken0CkUSDC = poolId.token0.toText() === CKUSDC_CANISTER_ID;
	const isToken1CkUSDC = poolId.token1.toText() === CKUSDC_CANISTER_ID;

	let token0_usd_price: string;
	let token1_usd_price: string;

	if (isToken0CkUSDC) {
		token0_usd_price = "1";
		// USD price of token1 = 10^d1 / (P * 10^d0)
		token1_usd_price = new BigNumber(10).pow(decimals1).div(P.multipliedBy(new BigNumber(10).pow(decimals0))).toString();
	} else if (isToken1CkUSDC) {
		token1_usd_price = "1";
		// USD price of token0 = (P * 10^d0) / 10^d1
		token0_usd_price = P.multipliedBy(new BigNumber(10).pow(decimals0)).div(new BigNumber(10).pow(decimals1)).toString();
	} else {
		token0_usd_price = token0Info.usdPrice;
		token1_usd_price = token1Info.usdPrice;
	}

	// token_0_price_in_token_1 = P / 10^(d1 - d0)
	const token0_price_in_token1 = P.dividedBy(new BigNumber(10).pow(decimals1 - decimals0));
	// token_0_price_in_token_1 = 1 / token_1_price_in_token_0
	const token1_price_in_token0 = new BigNumber(1).div(token0_price_in_token1);

	const pool: Pool = {
		pool_id: poolId,
		sqrt_price_x96: poolState.sqrt_price_x96.toString(),
		pool_reserves0: poolState.pool_reserves0.toString(),
		pool_reserves1: poolState.pool_reserves1.toString(),
		fee_protocol: poolState.fee_protocol.toString(),
		token0_transfer_fee: poolState.token0_transfer_fee.toString(),
		swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
		fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
		tick: poolState.tick.toString(),
		liquidity: poolState.liquidity.toString(),
		generated_swap_fee0: poolState.generated_swap_fee0.toString(),
		generated_swap_fee1: poolState.generated_swap_fee1.toString(),
		swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
		fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
		max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
		token1_transfer_fee: poolState.token1_transfer_fee.toString(),
		tick_spacing: poolState.tick_spacing.toString(),
		token0_usd_price,
		token1_usd_price,
		token0_price_in_token1: token0_price_in_token1.toString(),
		token1_price_in_token0: token1_price_in_token0.toString(),
	};

	const reserves0 = new BigNumber(pool.pool_reserves0).dividedBy(new BigNumber(10).pow(decimals0));
	const reserves1 = new BigNumber(pool.pool_reserves1).dividedBy(new BigNumber(10).pow(decimals1));
	const token0UsdPriceBN = new BigNumber(token0_usd_price);
	const token1UsdPriceBN = new BigNumber(token1_usd_price);

	pool.reserves0_usd = reserves0.multipliedBy(token0UsdPriceBN).toString();
	pool.reserves1_usd = reserves1.multipliedBy(token1UsdPriceBN).toString();
	pool.tvl_usd = reserves0.multipliedBy(token0UsdPriceBN).plus(reserves1.multipliedBy(token1UsdPriceBN)).toString();

	const swapVolume0 = new BigNumber(pool.swap_volume0_all_time).dividedBy(new BigNumber(10).pow(decimals0));
	const swapVolume1 = new BigNumber(pool.swap_volume1_all_time).dividedBy(new BigNumber(10).pow(decimals1));
	pool.swap_volume_all_time_usd = swapVolume0.multipliedBy(token0UsdPriceBN).plus(swapVolume1.multipliedBy(token1UsdPriceBN)).toString();

	const generatedSwapFee0 = new BigNumber(pool.generated_swap_fee0).dividedBy(new BigNumber(10).pow(decimals0));
	const generatedSwapFee1 = new BigNumber(pool.generated_swap_fee1).dividedBy(new BigNumber(10).pow(decimals1));
	pool.generated_swap_fee0_usd = generatedSwapFee0.multipliedBy(token0UsdPriceBN).toString();
	pool.generated_swap_fee1_usd = generatedSwapFee1.multipliedBy(token1UsdPriceBN).toString();
	pool.generated_swap_fee_all_time_usd = generatedSwapFee0.multipliedBy(token0UsdPriceBN).plus(generatedSwapFee1.multipliedBy(token1UsdPriceBN)).toString();

	return pool;
}


export async function get_all_pools(
	unAuthenticated_agent: HttpAgent,
	all_icp_tokens: IcpToken[]
): Promise<Response<Pool[]>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: unAuthenticated_agent,
		canisterId: appic_dex,
	});

	try {



		let pools = await dex_actor.get_pools() as [CandidPoolId, CandidPoolState][];

		const tokenMap = new Map<string, IcpToken>();
		all_icp_tokens.forEach(token => {
			tokenMap.set(token.canisterId, token);
		});

		const getTokenInfo = (principal: Principal) => tokenMap.get(principal.toText());

		let transformed_pools = pools.map(([poolId, poolState]) => transformPool(poolId, poolState, getTokenInfo));

		return { success: true, result: transformed_pools, message: "" };
	} catch (error) {
		return {
			success: false,
			result: [],
			message: String(error)
		};
	}
}

export async function get_pool_by_id(
	token_a: IcpToken,
	token_b: IcpToken,
	pool_fee: string,
	unAuthenticated_agent: HttpAgent
): Promise<Pool | undefined> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: unAuthenticated_agent,
		canisterId: appic_dex,
	});

	try {
		const { token0, token1 } = sortTokens(token_a, token_b);
		const pool_id: CandidPoolId = {
			token0: Principal.fromText(token0.canisterId),
			token1: Principal.fromText(token1.canisterId),
			fee: BigInt(pool_fee),
		};

		const result = await dex_actor.get_pool(pool_id) as [CandidPoolState] | [];

		if (result.length === 0) {
			return undefined;
		}

		const poolState = result[0];

		const tokenMap = new Map<string, IcpToken>();
		[token_a, token_b].forEach(token => {
			tokenMap.set(token.canisterId, token);
		});

		const getTokenInfo = (principal: Principal) => tokenMap.get(principal.toText());

		return transformPool(pool_id, poolState, getTokenInfo);
	} catch (error) {
		console.error("Error fetching pool:", error);
		return undefined;
	}
}

export async function get_pools_by_tokens(
	token_a: IcpToken,
	token_b: IcpToken,
	unAuthenticated_agent: HttpAgent
): Promise<Pool[]> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: unAuthenticated_agent,
		canisterId: appic_dex,
	});

	const pools: Pool[] = [];

	try {
		const { token0, token1 } = sortTokens(token_a, token_b);

		const tokenMap = new Map<string, IcpToken>();
		[token_a, token_b].forEach(token => {
			tokenMap.set(token.canisterId, token);
		});

		const getTokenInfo = (principal: Principal) => tokenMap.get(principal.toText());

		for (const fee of FEE_TIERS) {
			const poolId: CandidPoolId = {
				token0:Principal.fromText(token0.canisterId),
				token1:Principal.fromText(token1.canisterId),
				fee: BigInt(fee),
			};

			const result = await dex_actor.get_pool(poolId) as [CandidPoolState] | [];

			if (result.length !== 0) {
				const poolState = result[0];
				const pool = transformPool(poolId, poolState, getTokenInfo);
				pools.push(pool);
			}
		}
	} catch (error) {
		console.error("Error fetching pools for tokens:", error);
	}

	return pools;
}
