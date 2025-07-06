import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CandidTickInfo, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Principal } from "@dfinity/principal";
import { Response } from "@/blockchain_api/types/response";
import { TickMath } from "./utils/tick_math";
import BigNumber from 'bignumber.js';
import { IcpToken } from "@/blockchain_api/types/tokens";

export interface ActiveTickArgs{
	pool_id: CandidPoolId,
	token0:IcpToken,
	token1:IcpToken,
}

export interface ActiveTick {
	tick: number,
	sqrtx96_price: string,
	price: string,
	liquidity_gross: string,
}

export async function get_active_liquidity(
	{
		pool_id,
		token0,
		token1
	}:ActiveTickArgs,
	authenticated_agent: HttpAgent
): Promise<Response<ActiveTick[]>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});

	try {
		let ticks = await dex_actor.get_active_ticks(pool_id) as CandidTickInfo[];

		let active_ticks = ticks.map((tick) => {
			// Convert tick to number safely (ticks are within JS Number range in Uniswap V3)
			let tick_index = Number(tick.tick);

			// Calculate sqrt price in X96 format (assume TickMath returns BigNumber)
			let sqrtx96_price = TickMath.getSqrtRatioAtTick(tick_index);
			let sqrtx96_price_str = sqrtx96_price.toFixed();

			// Calculate price with precision using BigNumber
			// P = (sqrt_price_x96 / 2^96)^2, then adjust for decimals
			const Q96 = new BigNumber(2).pow(96);
			let P = sqrtx96_price.div(Q96).pow(2);

			// Adjust for token decimals
			const decimal_adjustment = new BigNumber(10).pow(token0.decimals - token1.decimals);
			let P_adjusted = P.times(decimal_adjustment);

			// Convert to string with 18 decimal places
			let price_str = P_adjusted.toFixed(18);

			// Remove trailing zeros and unnecessary decimal point
			price_str = price_str.replace(/\.?0+$/, '');

			// Convert liquidity_gross to string
			let liquidity_gross_str = tick.liquidity_gross.toString();

			return {
				tick: tick_index,
				sqrtx96_price: sqrtx96_price_str,
				price: price_str,
				liquidity_gross: liquidity_gross_str,
			};
		});

		return { success: true, result: active_ticks, message: "" };
	} catch (error) {
		return {
			success: false,
			result: [],
			message: String(error)
		};
	}
}

