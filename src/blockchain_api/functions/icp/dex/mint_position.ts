import { IcpToken } from "@/blockchain_api/types/tokens";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { MintPositionArgs, Result_6 as MintPositionResult, CandidPoolId} from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";
import BigNumber from 'bignumber.js';
import { TickMath } from "./utils/tick_math";

interface GenerateMintPositionArgsParams {
  price_lower: number;
  price_higher: number;
  token_0: string;
  token_1: string;
  amount0_max: string;
  amount1_max: string;
  direction: boolean;
  decimals0: number;
  decimals1: number;
  tick_spacing: number;
  pool_id: CandidPoolId;
}


async function mint_position(
  mint_position_args:GenerateMintPositionArgsParams,
  authenticated_agent: HttpAgent
): Promise<Response<string | undefined>> {
  const dex_actor = Actor.createActor(idlFactory, {
    agent: authenticated_agent,
    canisterId: appic_dex,
  });

  const generated_args: MintPositionArgs= generateMintPositionArgs(mint_position_args);

  try {
    let  mint_position_result= (await dex_actor.mint_position(
     generated_args
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

function generateMintPositionArgs({
  price_lower,
  price_higher,
  amount0_max,
  amount1_max,
  direction,
  decimals0,
  decimals1,
  tick_spacing,
  pool_id
}: GenerateMintPositionArgsParams): MintPositionArgs {
  // Input validation
  if (direction && price_lower >= price_higher) {
    throw new Error('price_lower must be less than price_higher when direction is true');
  }
  if (!direction && price_lower <= price_higher) {
    throw new Error('price_lower must be greater than price_higher when direction is false');
  }
  if (tick_spacing <= 0) {
    throw new Error('tick_spacing must be positive');
  }

  // Convert prices to token1 per token0 ratio
  let price_token1_per_token0_lower: number, price_token1_per_token0_higher: number;
  if (direction) {
    price_token1_per_token0_lower = price_lower;
    price_token1_per_token0_higher = price_higher;
  } else {
    price_token1_per_token0_lower = 1 / price_higher;
    price_token1_per_token0_higher = 1 / price_lower;
  }

  // Adjust for decimals
  const decimalAdjustment = 10 ** (decimals1 - decimals0);
  const price_small_lower = price_token1_per_token0_lower * decimalAdjustment;
  const price_small_higher = price_token1_per_token0_higher * decimalAdjustment;

  // Convert to sqrtPriceX96
  const TWO_POW_96 = BigNumber(2).pow(96);
  const sqrtPriceX96_lower = BigNumber(Math.floor(Math.sqrt(price_small_lower) * 1e18))
    .multipliedBy(TWO_POW_96)
    .div(BigNumber(10).pow(18));
  const sqrtPriceX96_higher = BigNumber(Math.floor(Math.sqrt(price_small_higher) * 1e18))
    .multipliedBy(TWO_POW_96)
    .div(BigNumber(10).pow(18));

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



