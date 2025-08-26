import { IcpToken } from '@/blockchain_api/types/tokens';
import { calculate_price } from './utils/price';
import { TickMath } from './utils/tick_math';
import { Q96 } from './get_pool';
import BigNumber from 'bignumber.js';

export interface AlignMinMaxPriceArgs {
	is_token0_selected: boolean;
	token0: IcpToken;
	token1: IcpToken;
	min_price: string;
	max_price: string;
	tick_spacing: number;
	pool_sqrt_x98_price: string;
}

export interface AlignedPrice {
	min_tick: number;
	max_tick: number;
	min_price: string;
	max_price: string;
	is_token0_active: boolean;
	is_token1_active: boolean;
}
export function alignMinOrMaxPrice({
	is_token0_selected,
	token0,
	token1,
	min_price,
	max_price,
	tick_spacing,
	pool_sqrt_x98_price,
}: AlignMinMaxPriceArgs): AlignedPrice {

	console.log({
		is_token0_selected,
		token0,
		token1,
		min_price,
		max_price,
		tick_spacing,
		pool_sqrt_x98_price,
	});
	// Input validation

	if (!min_price) {
		throw new Error('Invalid price input');
	}
	if (!max_price) {
		throw new Error('Invalid price input');
	}

	if (tick_spacing <= 0) {
		throw new Error('Tick spacing must be positive');
	}
	if (!token0 || !token1) {
		throw new Error('Tokens must be provided');
	}

	let min_tick: number;
	let max_tick: number;

	if (is_token0_selected) {
		// min tick calculation
		if (min_price == 'min') {
			min_tick = -887272;

		} else {
			// Calculate sqrt price from input
			const sqrtRatioX96 = new BigNumber(
				calculate_price({ token0, token1, price: min_price, is_token0_selected }).sqrt_price_x96,
			);

			// Get corresponding tick
			min_tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));
		}

		// max tick calculation
		if (max_price == 'max') {
			max_tick = 887272;
		} else {
			// Calculate sqrt price from input
			const sqrtRatioX96 = new BigNumber(
				calculate_price({ token0, token1, price: max_price, is_token0_selected }).sqrt_price_x96,
			);

			// Get corresponding tick
			max_tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));
		}

		// token 0 not selected
	} else {
		// min tick calculation
		if (min_price == 'min') {
			max_tick = 887272;

		} else {
			// Calculate sqrt price from input
			const sqrtRatioX96 = new BigNumber(
				calculate_price({ token0, token1, price: min_price, is_token0_selected }).sqrt_price_x96,
			);

			// Get corresponding tick
			max_tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));
		}

		// max tick calculation
		if (max_price == 'max') {
			min_tick = -887272;
		} else {
			// Calculate sqrt price from input
			const sqrtRatioX96 = new BigNumber(
				calculate_price({ token0, token1, price: max_price, is_token0_selected }).sqrt_price_x96,
			);

			// Get corresponding tick
			min_tick = TickMath.getTickAtSqrtRatio(BigInt(sqrtRatioX96.toFixed()));
		}
	}


	console.log('TICK NOT ALIGNED', "MIN_TICK", min_tick, "MAX_TICK", max_tick);

	// Find closest aligned tick
	let min_tickAligned = Math.round(min_tick / tick_spacing) * tick_spacing;
	let max_tickAligned = Math.round(max_tick / tick_spacing) * tick_spacing;

	if (min_tickAligned < -887272) {
		min_tickAligned += tick_spacing;
	} else if (min_tickAligned > 887272) {
		min_tickAligned -= tick_spacing;
	}

	if (max_tickAligned < -887272) {
		max_tickAligned += tick_spacing;
	} else if (max_tickAligned > 887272) {
		max_tickAligned -= tick_spacing;
	}

	console.log('Tick HELLOOOO', "MIN_TICK", min_tickAligned, "MAX_TICK", max_tickAligned);

	// Convert back to sqrt price
	const min_sqrtPrice = new BigNumber(TickMath.getSqrtRatioAtTick(min_tickAligned).toString());
	const max_sqrtPrice = new BigNumber(TickMath.getSqrtRatioAtTick(max_tickAligned).toString());

	// Calculate price in token1 terms
	const min_priceInToken1 = min_sqrtPrice
		.div(Q96)
		.pow(2)
		.div(new BigNumber(10).pow(token1.decimals - token0.decimals));

	const max_priceInToken1 = max_sqrtPrice
		.div(Q96)
		.pow(2)
		.div(new BigNumber(10).pow(token1.decimals - token0.decimals));

	let is_token0_active = true;
	let is_token1_active = true;

	const price_lower = min_sqrtPrice.lt(max_sqrtPrice) ? min_sqrtPrice : max_sqrtPrice;
	const price_higher = min_sqrtPrice.lt(max_sqrtPrice) ? max_sqrtPrice : min_sqrtPrice;

	if (BigNumber(pool_sqrt_x98_price).lt(price_lower)) {
		is_token1_active = false;
	}

	if (BigNumber(pool_sqrt_x98_price).gt(price_higher)) {
		is_token0_active = false;
	}

	// Return price based on token selection
	return is_token0_selected
		? {
			min_price: min_priceInToken1.toString(),
			max_price: max_priceInToken1.toString(),
			min_tick: min_tickAligned,
			max_tick: max_tickAligned,
			is_token0_active,
			is_token1_active,
		}
		: {
			min_price: new BigNumber(1).div(min_priceInToken1).toString(),
			max_price: new BigNumber(1).div(max_priceInToken1).toString(),
			max_tick: max_tickAligned,
			min_tick: min_tickAligned,
			is_token0_active,
			is_token1_active,
		};
}
