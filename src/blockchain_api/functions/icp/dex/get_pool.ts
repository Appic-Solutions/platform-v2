import { Actor, Agent } from "@dfinity/agent";
import { idlFactory } from "../../../did/appic/appic_dex/appic_dex.did";
import { CandidPoolState, CandidPoolId } from "../../../did/appic/appic_dex/appic_dex_types";
import { appic_dex } from "../../../../canister_ids.json";
import { Response } from "@/blockchain_api/types/response";

export interface Pool {
	pool_id: CandidPoolId,
  sqrt_price_x96 : string,
  pool_reserves0 : string,
  pool_reserves1 :string,
  fee_protocol : string,
  token0_transfer_fee : string,
  swap_volume1_all_time : string,
  fee_growth_global_1_x128 : string,
  tick : string,
  liquidity : string,
  generated_swap_fee0 : string,
  generated_swap_fee1 : string,
  swap_volume0_all_time : string,
  fee_growth_global_0_x128 : string,
  max_liquidity_per_tick : string,
  token1_transfer_fee : string,
  tick_spacing : string,
}

export async function get_all_pools(
  unAuthenticated_agent: Agent,
): Promise<Response<Pool[]>> {
  const dex_actor = Actor.createActor(idlFactory, {
    agent: unAuthenticated_agent,
    canisterId: appic_dex,
  });

  try {
    let pools = await dex_actor.get_pools() as [CandidPoolId, CandidPoolState][];

    let transformed_pools = pools.map(([poolId, poolState]) => {
      return {
        pool_id: poolId,
        sqrt_price_x96: poolState.sqrt_price_x96.toString(),
        pool_reserves0: poolState.pool_reserves0.toString(),
        pool_reserves1: poolState.pool_reserves1.toString(),
        fee_protocol: poolState.fee_protocol.toString(),
        token0_transfer_fee: poolState.token0_transfer_fee.toString(),
        swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
        fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
        tick: poolState.tick.toString(),
        liquidity: poolState.liquidity.toString(),
        generated_swap_fee0: poolState.generated_swap_fee0.toString(),
        generated_swap_fee1: poolState.generated_swap_fee1.toString(),
        swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
        fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
        max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
        token1_transfer_fee: poolState.token1_transfer_fee.toString(),
        tick_spacing: poolState.tick_spacing.toString(),
      } as Pool;
    });

    return { success: true, result: transformed_pools, message: "" };
  } catch (error) {
    return {
      success: false,
      result: [],
      message: String(error)
    };
  }
}



export async function get_pool_by_id(
  pool_id: CandidPoolId,
  unAuthenticated_agent: Agent
): Promise<Pool | undefined> {
  const dex_actor = Actor.createActor(idlFactory, {
    agent: unAuthenticated_agent,
    canisterId: appic_dex,
  });

  try {
    const result = await dex_actor.get_pool(pool_id) as CandidPoolState[];

    if (result.length === 0) {
      return undefined;
    }

    const poolState = result[0];

    return {
      pool_id: pool_id,
      sqrt_price_x96: poolState.sqrt_price_x96.toString(),
      pool_reserves0: poolState.pool_reserves0.toString(),
      pool_reserves1: poolState.pool_reserves1.toString(),
      fee_protocol: poolState.fee_protocol.toString(),
      token0_transfer_fee: poolState.token0_transfer_fee.toString(),
      swap_volume1_all_time: poolState.swap_volume1_all_time.toString(),
      fee_growth_global_1_x128: poolState.fee_growth_global_1_x128.toString(),
      tick: poolState.tick.toString(),
      liquidity: poolState.liquidity.toString(),
      generated_swap_fee0: poolState.generated_swap_fee0.toString(),
      generated_swap_fee1: poolState.generated_swap_fee1.toString(),
      swap_volume0_all_time: poolState.swap_volume0_all_time.toString(),
      fee_growth_global_0_x128: poolState.fee_growth_global_0_x128.toString(),
      max_liquidity_per_tick: poolState.max_liquidity_per_tick.toString(),
      token1_transfer_fee: poolState.token1_transfer_fee.toString(),
      tick_spacing: poolState.tick_spacing.toString(),
    };
  } catch (error) {
    console.error("Error fetching pool:", error);
    return undefined;
  }
}


