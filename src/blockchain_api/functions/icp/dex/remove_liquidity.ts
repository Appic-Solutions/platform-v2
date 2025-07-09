import { HttpAgent, Actor } from "@dfinity/agent";
import { appic_dex } from "../../../../canister_ids.json";
import { Position } from './get_positions';
import { Result_1 as CollectFeeResult, DecreaseLiquidityArgs, BurnPositionArgs, Result as BurnLiquidityResult, Result_3 as DecreaseLiquidityResult } from "../../../did/appic/appic_dex/appic_dex_types";
import { idlFactory } from "@/blockchain_api/did/appic/appic_dex/appic_dex.did";
import { Response } from "@/blockchain_api/types/response";
import { BigNumber } from "bignumber.js";
export interface RemoveLiquidityArgs {
	position: Position,
	percentage: number
}


const burn_slippage_percentage: number = 0.3;


export function generate_decrease_liquidty_args({ position, percentage }: RemoveLiquidityArgs): DecreaseLiquidityArgs | BurnPositionArgs {
	if (percentage < 0 || percentage > 100) {
		throw "Invlaid liquidity percentage selected";
	}
	let pool = position.key.pool;
	let tick_lower = position.key.tick_lower;
	let tick_upper = position.key.tick_upper;
	if (percentage == 100) {
		let amount0_min = BigNumber(position.token0_reserves_raw).multipliedBy((100 - burn_slippage_percentage) / 100).toFixed();
		let amount1_min = BigNumber(position.token1_reserves_raw).multipliedBy((100 - burn_slippage_percentage) / 100).toFixed();
		return {
			amount1_min: BigInt(amount1_min),
			pool,
			amount0_min: BigInt(amount0_min),
			tick_lower,
			tick_upper,
		} as BurnPositionArgs;
	} else {
		let liquidity = BigNumber(position.liquidity).multipliedBy(percentage / 100).toFixed()
		let amount0_min = BigNumber(position.token0_reserves_raw).multipliedBy(percentage / 100).minus((100 - burn_slippage_percentage) / 100).toFixed();
		let amount1_min = BigNumber(position.token1_reserves_raw).multipliedBy(percentage / 100).minus((100 - burn_slippage_percentage) / 100).toFixed();

		return {
			pool,
			tick_lower, tick_upper, amount0_min: BigInt(amount0_min), amount1_min: BigInt(amount1_min), liquidity: BigInt(liquidity)
		} as DecreaseLiquidityArgs

	}

}

export async function remove_liquidity(
	args: DecreaseLiquidityArgs | BurnPositionArgs,
	authenticated_agent: HttpAgent
): Promise<Response<string | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});


	try {
		if ("liquidity" in args) {

			let decrease_liquidity_result = (await dex_actor.decrease_liquidity(
				args as DecreaseLiquidityArgs
			)) as DecreaseLiquidityResult;
			if ("Err" in decrease_liquidity_result) {
				return {
					message: `${decrease_liquidity_result.Err}`,
					result: undefined,
					success: false,
				};


			} else {
				return {
					result: "",
					success: true,
					message: "success"
				}
			}
		}
		else {

			let burn_result= (await dex_actor.burn(
				args as BurnPositionArgs
			)) as BurnLiquidityResult;
			if ("Err" in burn_result) {
				return {
					message: `${burn_result.Err}`,
					result: undefined,
					success: false,
				};


			} else {
				return {
					result: "",
					success: true,
					message: "success"
				}
			}



		}

	} catch (error) {
		return {
			message: `Failed to call appic dex canister: ${error}`,
			result: undefined,
			success: false,
		};
	}
}



