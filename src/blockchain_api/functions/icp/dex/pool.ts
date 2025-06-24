import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CreatePoolArgs, Result_2 as CreatePoolResult, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Principal } from "@dfinity/principal";
import { Response } from "@/blockchain_api/types/response";

export interface CreatePool {
	token_a: IcpToken,
	token_b: IcpToken,
	fee: string,
	initial_sqrt_price: string,
}



async function create_pool(create_pool_args: CreatePool, authenticated_agent: HttpAgent): Promise<Response<CandidPoolId | undefined>> {
	const dex_actor = Actor.createActor(idlFactory, { agent: authenticated_agent, canisterId: appic_dex });

	const transformed_args: CreatePoolArgs = {
		token_a: Principal.fromText(create_pool_args.token_a.canisterId),
		token_b: Principal.fromText(create_pool_args.token_b.canisterId),
		fee: BigInt(create_pool_args.fee),
		sqrt_price_x96: BigInt(create_pool_args.initial_sqrt_price)
	}

	try {
		let create_pool_result = await dex_actor.create_pool(transformed_args) as CreatePoolResult;
		if ("Err" in create_pool_result) {
			return {
				message: `${create_pool_result.Err}`,
				result: undefined,
				success: false,
			}
		}
		return {
			message: "",
			result: create_pool_result.Ok,
			success: true
		}
	} catch (error) {
		return {
			message: `failed to call appic dex canister`,
			result: undefined,
			success: false,
		}

	}
}


