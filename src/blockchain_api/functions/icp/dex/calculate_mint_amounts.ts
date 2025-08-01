import BigNumber from 'bignumber.js';
import {
	maxLiquidityForAmount0Precise,
	maxLiquidityForAmount1,
} from './utils/max_liquidity_amount';
import { SqrtPriceMath } from './utils/sqrt_price-math';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { TickMath } from './utils/tick_math';
import { MintPositionArgs, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";


interface TokenAmount {
	raw: string;
	formatted: string;
}

interface MintAmounts {
	token0: TokenAmount;
	token1: TokenAmount;
}

// Helper function to format BigNumber with decimals
function formatUnits(amount: BigNumber, decimals: number): string {
	const scale = new BigNumber(10).pow(decimals);
	return amount.dividedBy(scale).toFixed();
}

export interface CalculateMintAmountsArgs {
	selected_amount: string;


	is_amount_zero: boolean;
	token0: IcpToken;
	token1: IcpToken;
	sqrt_price_x96: string; // sqrt_price_x96 from the pool state, get from calculate_price function
	min_tick: string; // min tick from align price function
	max_tick: string; // max tick from align price function
}

export function calculate_mint_amounts({
	selected_amount, // amount that users input in the UI
	is_amount_zero, // token0 or token1
	token0,
	token1,
	sqrt_price_x96, // sqrt_price_x96 from the pool state
	min_tick,
	max_tick,
}: CalculateMintAmountsArgs): MintAmounts {
	let liquidity: BigNumber;
	let amount0: BigNumber;
	let amount1: BigNumber;

	if (BigNumber(selected_amount).lte(0)) throw new Error("Amount must be positive");

	let tickA = BigNumber(min_tick);
	let tickB = BigNumber(max_tick);

	let currentsqrtRatioX96 = BigNumber(sqrt_price_x96);

	let amount = BigNumber(selected_amount).multipliedBy(BigNumber(10).pow(is_amount_zero ? token0.decimals : token1.decimals));

	// Ensure sqrtRatioAX96 is the lower price and sqrtRatioBX96 is the upper price
	const tick_lower = tickA.lt(tickB) ? tickA : tickB;
	const tick_higer = tickA.lt(tickB) ? tickB : tickA;


	const sqrtPriceLower = BigNumber(TickMath.getSqrtRatioAtTick(tick_lower.toNumber()).toString());
	const sqrtPriceUpper = BigNumber(TickMath.getSqrtRatioAtTick(tick_higer.toNumber()).toString());

	if (is_amount_zero) {
		// User specifies token0 amount
		if (currentsqrtRatioX96.lte(sqrtPriceLower)) {
			// Current price is below the range: only token0 is needed
			liquidity = maxLiquidityForAmount0Precise(sqrtPriceLower, sqrtPriceUpper, amount);
			amount0 = amount;
			amount1 = new BigNumber(0);
		} else if (currentsqrtRatioX96.lt(sqrtPriceUpper)) {
			// Current price is within the range: both tokens are needed
			liquidity = maxLiquidityForAmount0Precise(currentsqrtRatioX96, sqrtPriceUpper, amount);
			amount0 = amount;
			amount1 = SqrtPriceMath.getAmount1Delta(sqrtPriceLower, currentsqrtRatioX96, liquidity, false);
		} else {
			// Current price is above the range: only token1 is needed, so token0 alone can't mint
			amount0 = new BigNumber(0);
			amount1 = new BigNumber(0);
		}
	} else {
		// User specifies token1 amount
		if (currentsqrtRatioX96.gte(sqrtPriceUpper)) {
			// Current price is above the range: only token1 is needed
			liquidity = maxLiquidityForAmount1(sqrtPriceLower, sqrtPriceUpper, amount);
			amount0 = new BigNumber(0);
			amount1 = amount;
		} else if (currentsqrtRatioX96.gt(sqrtPriceLower)) {
			// Current price is within the range: both tokens are needed
			liquidity = maxLiquidityForAmount1(sqrtPriceLower, currentsqrtRatioX96, amount);
			amount0 = SqrtPriceMath.getAmount0Delta(currentsqrtRatioX96, sqrtPriceUpper, liquidity, false);
			amount1 = amount;
		} else {
			// Current price is below the range: only token0 is needed, so token1 alone can't mint
			amount0 = new BigNumber(0);
			amount1 = new BigNumber(0);
		}
	}

	// Format amounts with decimals
	const formattedAmount0 = formatUnits(amount0, token0.decimals);
	const formattedAmount1 = formatUnits(amount1, token1.decimals);

	return {
		token0: {
			raw: amount0.toFixed(),
			formatted: formattedAmount0,
		},
		token1: {
			raw: amount1.toFixed(),
			formatted: formattedAmount1,
		},
	};



}



export interface GenerateMintPositionArgsParams {
	mint_tick: string;
	max_tick: string;
	amount0_max: string;
	amount1_max: string;
	token0: IcpToken;
	token1: IcpToken;
	pool_id: CandidPoolId;
}



export function generate_mint_position_args({
	mint_tick,
	max_tick,
	amount0_max,
	amount1_max,
	token0,
	token1,
	pool_id,
}: GenerateMintPositionArgsParams): { mint_position_args: MintPositionArgs, token0_approval_amount: string, token1_approval_amount: string } {



	let tick_lower = mint_tick < max_tick ? mint_tick : max_tick;
	let tick_upper = mint_tick < max_tick ? max_tick : mint_tick;


	// calculate decimals and apply transfer fees
	let amount0 = BigNumber(amount0_max).multipliedBy(BigNumber(10).pow(token0.decimals)).decimalPlaces(0);
	let amount1 = BigNumber(amount1_max).multipliedBy(BigNumber(10).pow(token1.decimals)).decimalPlaces(0);

	let token0_approval_amount = amount0.minus(BigNumber(token0.fee!)).toString();
	let token1_approval_amount = amount1.minus(BigNumber(token1.fee!)).toString();



	// fees= 1 approval fee, 1 transfer fee
	amount0 = amount0.minus(BigNumber(token0.fee!).multipliedBy(2));
	amount1 = amount1.minus(BigNumber(token1.fee!).multipliedBy(2));

	// Return MintPositionArgs
	return {
		mint_position_args: {
			amount1_max: BigInt(amount1.toString()),
			pool: pool_id,
			from_subaccount: [],
			amount0_max: BigInt(amount0.toString()),
			tick_lower: BigInt(tick_lower),
			tick_upper: BigInt(tick_upper),

		},
		token0_approval_amount,
		token1_approval_amount
	};
}



