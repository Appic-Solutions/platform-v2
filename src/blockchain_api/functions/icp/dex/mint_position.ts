//import { IcpToken } from "@/blockchain_api/types/tokens";
//import { Actor, HttpAgent } from "@dfinity/agent";
//import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
//import { MintPositionArgs, Result_6 as MintPositionResult, CandidPoolId,CandidPositionKey } from "../../../did/appic/appic_dex/appic_dex_types";
//import { appic_dex } from "../../../../canister_ids.json";
//import { Principal } from "@dfinity/principal";
//import { Response } from "@/blockchain_api/types/response";
//
//
//function get_tick_from_sqrt_
//
//async function mint_position(
//  mint_position_args: MintPositionArgs,
//  authenticated_agent: HttpAgent
//): Promise<Response<CandidPositionKey| undefined>> {
//  const dex_actor = Actor.createActor(idlFactory, {
//    agent: authenticated_agent,
//    canisterId: appic_dex,
//  });
//
//  const transformed_args: MintPositionArgs= {
//    pool_id:mint_position_args.pool_id,
//		tick_lower:BigInt(mint_position_args.tick_lower),
//		tick_upper:BigInt(mint_position_args.tick_upper),
//		amount0_max:
//
//    };
//
//  try {
//    let create_pool_result = (await dex_actor.create_pool(
//      transformed_args
//    )) as CreatePoolResult;
//    if ("Err" in create_pool_result) {
//      return {
//        message: `${create_pool_result.Err}`,
//        result: undefined,
//        success: false,
//      };
//    }
//    return {
//      message: "",
//      result: create_pool_result.Ok,
//      success: true,
//    };
//  } catch (error) {
//    return {
//      message: `Failed to call appic dex canister: ${error}`,
//      result: undefined,
//      success: false,
//    };
//  }
//}

