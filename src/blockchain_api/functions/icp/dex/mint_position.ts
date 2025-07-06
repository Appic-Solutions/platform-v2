import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { MintPositionArgs, Result_6 as MintPositionResult, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";
import BigNumber from 'bignumber.js';
import { TickMath } from "./utils/tick_math";
import { is_native_token } from "../../evm/utils/erc20_helpers";
import { calculate_price } from "./utils/price";

interface GenerateMintPositionArgsParams {
	min_price: string;
	max_price: string;
	token0: IcpToken;
	token1: IcpToken;
	amount0_max: string;
	amount1_max: string;
	is_token0_selected: boolean,
	tick_spacing: number;
	pool_id: CandidPoolId;
}


export async function mint_position(
	mint_position_args: MintPositionArgs,
	authenticated_agent: HttpAgent
): Promise<Response<string | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});


	try {
		let mint_position_result = (await dex_actor.mint_position(
			mint_position_args
		)) as MintPositionResult;
		if ("Err" in mint_position_result) {
			return {
				message: `${mint_position_result.Err}`,
				result: undefined,
				success: false,
			};
		}
		return {
			message: "",
			result: mint_position_result.Ok.toString(),
			success: true,
		};
	} catch (error) {
		return {
			message: `Failed to call appic dex canister: ${error}`,
			result: undefined,
			success: false,
		};
	}
}

export  function generate_mint_position_args({
	min_price,
	max_price,
	amount0_max,
	amount1_max,
	tick_spacing,
	is_token0_selected,
	pool_id,
	token0,
	token1
}: GenerateMintPositionArgsParams): MintPositionArgs {


	let sqrtRatioAX96 = BigNumber(calculate_price({token0, token1, price: min_price, is_token0_selected}).sqrt_price_x96);
	let sqrtRatioBX96 = BigNumber(calculate_price({token0, token1, price: max_price, is_token0_selected}).sqrt_price_x96);


	// Ensure sqrtRatioAX96 is the lower price and sqrtRatioBX96 is the upper price
	const sqrtPriceX96_lower = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioAX96 : sqrtRatioBX96;
	const sqrtPriceX96_higher = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioBX96 : sqrtRatioAX96;


	// Get raw ticks (placeholder functions)
	const tick_lower_raw = TickMath.getTickAtSqrtRatio(sqrtPriceX96_lower);
	const tick_upper_raw = TickMath.getTickAtSqrtRatio(sqrtPriceX96_higher);

	// Align ticks with tick_spacing
	const tick_lower_aligned = Math.floor(tick_lower_raw / tick_spacing) * tick_spacing;
	const tick_upper_aligned = Math.ceil(tick_upper_raw / tick_spacing) * tick_spacing;

	// Tick range check
	const MIN_TICK = -887272;
	const MAX_TICK = 887272;

	if (tick_lower_aligned < MIN_TICK || tick_upper_aligned > MAX_TICK) {
		throw new Error('Tick out of range');
	}

	// Return MintPositionArgs
	return {
		amount1_max: BigInt(amount1_max),
		pool: pool_id,
		from_subaccount: [],
		amount0_max: BigInt(amount0_max),
		tick_lower: BigInt(tick_lower_aligned),
		tick_upper: BigInt(tick_upper_aligned),
	};
}



