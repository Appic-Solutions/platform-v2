import { HttpAgent, Actor } from "@dfinity/agent";
import { appic_dex } from "../../../../canister_ids.json";
import { Position } from './get_positions';
import { IncreaseLiquidityArgs, IncreaseLiquidityError, Result_5 as IncreaseLiquidityResult } from "../../../did/appic/appic_dex/appic_dex_types";
import { idlFactory } from "@/blockchain_api/did/appic/appic_dex/appic_dex.did";
import { Response } from "@/blockchain_api/types/response";

export interface AddLiquidityArgs {
	position: Position,
	amount0_max: string,
	amount1_max: string,
}




export function generate_increase_liquidty_args({ position, amount0_max, amount1_max }: AddLiquidityArgs): IncreaseLiquidityArgs {
	let pool = position.key.pool;
	let tick_lower = position.key.tick_lower;
	let tick_upper = position.key.tick_upper;

	return { pool, tick_upper, tick_lower, amount1_max: BigInt(amount1_max), amount0_max: BigInt(amount0_max) } as IncreaseLiquidityArgs;

}

export async function remove_liquidity(
	args: IncreaseLiquidityArgs,
	authenticated_agent: HttpAgent
): Promise<Response<string | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});


	try {

		let increase_liquidity_result = (await dex_actor.increase_liquidity(
			args as IncreaseLiquidityArgs
		)) as IncreaseLiquidityResult;
		if ("Err" in increase_liquidity_result) {
			return {
				message: `${increase_liquidity_result.Err}`,
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


	} catch (error) {
		return {
			message: `Failed to call appic dex canister: ${error}`,
			result: undefined,
			success: false,
		};
	}
}



