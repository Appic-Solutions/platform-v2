import { IcpToken } from '@/blockchain_api/types/tokens';
import { calculate_price } from './utils/price';
import { TickMath } from './utils/tick_math';
import { Q96 } from './get_pool';
import BigNumber from 'bignumber.js';

export interface AlignMinMaxPriceArgs {
	is_token0_selected: boolean;
	token0: IcpToken;
	token1: IcpToken;
	price: string;
	tick_spacing: number;
	is_min_price: boolean;
	pool_sqrt_x98_price: string;
}

export interface AlignedPrice {
	tick: number;
	price: string;
	is_token0_active: boolean,
	is_token1_active: boolean,
}
export function alignMinOrMaxPrice({
	is_token0_selected,
	token0,
	token1,
	price,
	tick_spacing,
	is_min_price,
	pool_sqrt_x98_price,
}: AlignMinMaxPriceArgs): AlignedPrice {
	// Input validation

	if (!price || Number(price) <= 0) {
		throw new Error('Invalid price input');
	}
	if (tick_spacing <= 0) {
		throw new Error('Tick spacing must be positive');
	}
	if (!token0 || !token1) {
		throw new Error('Tokens must be provided');
	}

	let tick: number;

	if (price == 'min') {
		tick = is_token0_selected ? -887272 : 887272;
	} else if (price == 'max') {
		tick = is_token0_selected ? 887272 : -887272;
	} else {
		// Calculate sqrt price from input
		const sqrtRatioX96 = new BigNumber(
			calculate_price({ token0, token1, price, is_token0_selected }).sqrt_price_x96,
		);



		// Get corresponding tick
		tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));
	}

	console.log("TICK NOT ALIGNED", tick);

	// Find closest aligned tick
	let tickAligned = Math.round(tick / tick_spacing) * tick_spacing;



	if (tickAligned < -887272) {
		tickAligned += tick_spacing;
	} else if (tickAligned > 887272) {
		tickAligned -= tick_spacing
	}


	console.log("Tick HELLOOOO", tickAligned);


	// Convert back to sqrt price
	const sqrtPrice = new BigNumber(TickMath.getSqrtRatioAtTick(tickAligned).toString());



	// Calculate price in token1 terms
	const priceInToken1 = sqrtPrice
		.div(Q96)
		.pow(2)
		.div(new BigNumber(10).pow(token1.decimals - token0.decimals));

	let is_token0_active = true;
	let is_token1_active = true;
	let is_min_price_slected = is_token0_selected ? is_min_price : !is_min_price;

	if (is_min_price_slected && BigNumber(pool_sqrt_x98_price).lt(sqrtPrice)) {
		is_token1_active = false;
	}

	if (!is_min_price_slected && BigNumber(pool_sqrt_x98_price).gt(sqrtPrice)) {
		is_token0_active = false;
	}




	// Return price based on token selection
	return is_token0_selected
		? { price: priceInToken1.toString(), tick: tickAligned, is_token0_active, is_token1_active }
		: { price: new BigNumber(1).div(priceInToken1).toString(), tick: tickAligned, is_token0_active, is_token1_active };
}
