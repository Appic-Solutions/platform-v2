import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CreatePoolArgs, Result_2 as CreatePoolResult, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Principal } from "@dfinity/principal";
import { Response } from "@/blockchain_api/types/response";

export interface CreatePool {
  token_a: IcpToken;
  token_b: IcpToken;
  fee: string;
  token_a_decimals: number;
  token_b_decimals: number;
  a_to_b: boolean;
  initial_price: string;
}

// Helper function to calculate sqrt_price_x96
function calculateSqrtPriceX96(
  initial_price: string,
  token_a_decimals: number,
  token_b_decimals: number,
  a_to_b: boolean,
  token_a_canisterId: string,
  token_b_canisterId: string
): bigint {
  // Parse the initial price as a number
  const price = parseFloat(initial_price);
  if (isNaN(price) || price <= 0) {
    throw new Error("Invalid initial price");
  }

  // Determine token0 and token1 based on canister ID (address) comparison
  const token_a_principal = Principal.fromText(token_a_canisterId);
  const token_b_principal = Principal.fromText(token_b_canisterId);
  const token0_is_a = token_a_principal < token_b_principal;
  const token0_decimals = token0_is_a ? token_a_decimals : token_b_decimals;
  const token1_decimals = token0_is_a ? token_b_decimals : token_a_decimals;

  // Adjust price for decimals and direction
  let adjusted_price = price;
  if (a_to_b) {
    // Price is token A per token B
    if (token0_is_a) {
      // token A is token0, price is token1/token0
      adjusted_price = price * Math.pow(10, token1_decimals - token0_decimals);
    } else {
      // token B is token0, price is token1/token0, so invert
      adjusted_price = (1 / price) * Math.pow(10, token1_decimals - token0_decimals);
    }
  } else {
    // Price is token B per token A
    if (token0_is_a) {
      // token A is token0, price is token0/token1, so invert
      adjusted_price = (1 / price) * Math.pow(10, token0_decimals - token1_decimals);
    } else {
      // token B is token0, price is token0/token1
      adjusted_price = price * Math.pow(10, token0_decimals - token1_decimals);
    }
  }

  // Calculate sqrt_price_x96 = sqrt(adjusted_price) * 2^96
  const sqrt_price = Math.sqrt(adjusted_price);
  const Q96 = BigInt(2) ** BigInt(96); // 2^96
  const sqrt_price_x96 = BigInt(Math.floor(sqrt_price * Number(Q96)));

  return sqrt_price_x96;
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
    token_a: Principal.fromText(create_pool_args.token_a.canisterId),
    token_b: Principal.fromText(create_pool_args.token_b.canisterId),
    fee: BigInt(create_pool_args.fee),
    sqrt_price_x96: calculateSqrtPriceX96(
      create_pool_args.initial_price,
      create_pool_args.token_a_decimals,
      create_pool_args.token_b_decimals,
      create_pool_args.a_to_b,
      create_pool_args.token_a.canisterId,
      create_pool_args.token_b.canisterId
    ),
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
