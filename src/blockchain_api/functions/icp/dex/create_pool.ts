import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CreatePoolArgs, Result_2 as CreatePoolResult, CandidPoolId, MintPositionArgs } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Principal } from "@dfinity/principal";
import { Response } from "@/blockchain_api/types/response";
import { calculate_price } from "./utils/price";
import { mint_position } from "./mint_position";

export interface CreatePool {
	token_0: IcpToken,
	token_1: IcpToken,
	initial_price: string,
	is_token0_selcted: boolean,
	fee_tier: string,
}


async function create_pool(
	create_pool_args: CreatePool,
	authenticated_agent: HttpAgent
): Promise<Response<CandidPoolId | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});

	const transformed_args: CreatePoolArgs = {
		token_a: Principal.fromText(create_pool_args.token_0.canisterId),
		token_b: Principal.fromText(create_pool_args.token_1.canisterId),
		fee: BigInt(create_pool_args.fee_tier),
		sqrt_price_x96: BigInt(calculate_price(create_pool_args.token_0, create_pool_args.token_1, create_pool_args.initial_price, create_pool_args.is_token0_selcted).sqrt_price_x96)

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
	const dex_actor = Actor.createActor(idlFactory, {
		agent: authenticated_agent,
		canisterId: appic_dex,
	});



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




