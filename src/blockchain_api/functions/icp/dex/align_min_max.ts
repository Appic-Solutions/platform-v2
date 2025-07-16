import { IcpToken } from "@/blockchain_api/types/tokens";
import { calculate_price } from "./utils/price";
import { TickMath } from "./utils/tick_math";
import { Q96 } from "./get_pool";
import BigNumber from "bignumber.js";

export interface AlignMinMaxPriceArgs {
	is_token0_selected: boolean;
	token0: IcpToken;
	token1: IcpToken;
	price: string;
	tick_spacing: number;
}

export interface AlignedPrice {
	tick: number,
	price: string,
}
export function alignMinOrMaxPrice({
	is_token0_selected,
	token0,
	token1,
	price,
	tick_spacing,
}: AlignMinMaxPriceArgs): AlignedPrice {
	// Input validation
	if (!price || isNaN(Number(price)) || Number(price) <= 0) {
		throw new Error("Invalid price input");
	}
	if (tick_spacing <= 0) {
		throw new Error("Tick spacing must be positive");
	}
	if (!token0 || !token1) {
		throw new Error("Tokens must be provided");
	}

	let tick: number;

	if (price == "min") {

		tick = is_token0_selected ? -887272 : 887272;
	} else if (price == "max") {
		tick = is_token0_selected ? 887272 : -887272;
	}
	else {
		// Calculate sqrt price from input
		const sqrtRatioX96 = new BigNumber(
			calculate_price({ token0, token1, price, is_token0_selected }).sqrt_price_x96
		);

		// Get corresponding tick
		tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));

	}


	// Find closest aligned tick
	const tickAligned = Math.round(tick / tick_spacing) * tick_spacing;

	// Convert back to sqrt price
	const sqrtPrice = new BigNumber(TickMath.getSqrtRatioAtTick(tickAligned).toString());

	// Calculate price in token1 terms
	const priceInToken1 = sqrtPrice
		.div(Q96)
		.pow(2)
		.div(new BigNumber(10).pow(token1.decimals - token0.decimals));

	// Return price based on token selection
	return is_token0_selected
		? { price: priceInToken1.toString(), tick: tickAligned }
		: { price: new BigNumber(1).div(priceInToken1).toString(), tick: tickAligned };
}
