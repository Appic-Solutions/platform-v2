import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CreatePoolArgs, Result_2 as CreatePoolResult, CandidPoolId, MintPositionArgs } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Principal } from "@dfinity/principal";
import { Response } from "@/blockchain_api/types/response";
import { calculate_price, CalculatePriceArgs } from "./utils/price";
import { mint_position } from "./mint_position";

export interface CreatePool {
	token0: IcpToken,
	token1: IcpToken,
	initial_price: string,
	is_token0_selected: boolean,
	fee_tier: string,
}


async function create_pool(
	{ token0, token1, initial_price, fee_tier, is_token0_selected }: CreatePool,
	authenticated_agent: HttpAgent
): Promise<Response<CandidPoolId | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});

	let sqrt_price_x96 = BigInt(calculate_price({
		is_token0_selected,
		token0, token1, price: initial_price
	} as CalculatePriceArgs).sqrt_price_x96);

	const transformed_args: CreatePoolArgs = {
		token_a: Principal.fromText(token0.canisterId),
		token_b: Principal.fromText(token1.canisterId),
		fee: BigInt(fee_tier),
		sqrt_price_x96
	};

	try {
		let create_pool_result = (await dex_actor.create_pool(
			transformed_args
		)) as CreatePoolResult;
		if ("Err" in create_pool_result) {
			return {
				message: `${create_pool_result.Err}`,
				result: undefined,
				success: false,
			};
		}
		return {
			message: "",
			result: create_pool_result.Ok,
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




export async function create_pool_and_mint_position(
	create_pool_args: CreatePool,
	mint_args: MintPositionArgs,
	authenticated_agent: HttpAgent
): Promise<Response<CandidPoolId | undefined>> {


	try {
		let result = await create_pool(create_pool_args, authenticated_agent);
		if (result.success) {
			let mint_result = await mint_position(mint_args, authenticated_agent);
			if (mint_result.success) {
				return {
					result: result.result,
					message: "",
					success: true,
				}
			} else {
				return {
					result: undefined,
					message: mint_result.message,
					success: false
				}
			}

		} else {
			return {
				message: result.message,
				success: false,
				result: undefined
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




