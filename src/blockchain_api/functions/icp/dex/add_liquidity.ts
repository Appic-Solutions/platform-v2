import { Position } from './get_positions';
import { IncreaseLiquidityArgs } from '../../../did/appic/appic_dex/appic_dex_types';
import { IcpToken } from '@/blockchain_api/types/tokens';
import BigNumber from 'bignumber.js';

export interface AddLiquidityArgs {
	position: Position;
	amount0_max: string;
	amount1_max: string;
	token0: IcpToken;
	token1: IcpToken;
}

export function generate_increase_liquidty_args({
	position,
	amount0_max,
	amount1_max,
	token0,
	token1,
}: AddLiquidityArgs): {
	increase_liquidty_args: IncreaseLiquidityArgs;
	token0_approval_amount: string;
	token1_approval_amount: string;
} {
	let pool = position.key.pool;
	let tick_lower = position.key.tick_lower;
	let tick_upper = position.key.tick_upper;

	console.log(token0, token1);

	// calculate decimals and apply transfer fees
	let amount0 = BigNumber(amount0_max)
		.multipliedBy(BigNumber(10).pow(token0.decimals))
		.decimalPlaces(0);
	let amount1 = BigNumber(amount1_max)
		.multipliedBy(BigNumber(10).pow(token1.decimals))
		.decimalPlaces(0);

	let token0_approval_amount = amount0.minus(BigNumber(token0.fee!)).toString();
	let token1_approval_amount = amount1.minus(BigNumber(token1.fee!)).toString();

	// fees= 1 approval fee, 1 transfer fee
	amount0 = amount0.minus(BigNumber(token0.fee!).multipliedBy(2));
	amount1 = amount1.minus(BigNumber(token1.fee!).multipliedBy(2));



	// in case providing liquidity for an out of range position
	console.log(amount0_max, amount1_max);
	if (amount0_max == "0") {
		amount0 = BigNumber(0)
		token0_approval_amount = "0"
	}
	if (amount1_max == "0") {
		amount1 = BigNumber(0)
		token1_approval_amount = "0"
	}



	return {
		increase_liquidty_args: {
			pool,
			tick_upper,
			tick_lower,
			amount1_max: BigInt(amount1.toString()),
			amount0_max: BigInt(amount0.toString()),
			from_subaccount: [],
		},
		token1_approval_amount,
		token0_approval_amount,
	};
}
