import { Actor, Agent } from '@dfinity/agent';
import { idlFactory } from '../../../did/appic/appic_dex/appic_dex.did';
import {
  CandidPositionKey,
  CandidPositionInfo,
} from '../../../did/appic/appic_dex/appic_dex_types';
import { appic_dex } from '../../../../canister_ids.json';
import { Response } from '@/blockchain_api/types/response';
import { Pool } from './get_pool';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { TickMath } from './utils/tick_math';
import { SqrtPriceMath } from './utils/sqrt_price-math';
import { Principal } from '@dfinity/principal';
import { arePoolsEqual } from './utils/pool_comparison';
import BigNumber from 'bignumber.js';

export interface Position {
  key: CandidPositionKey;
  fees_token0_owed: string;
  fee_growth_inside_1_last_x128: string;
  liquidity: string;
  fees_token1_owed: string;
  fee_growth_inside_0_last_x128: string;
  token0_reserves: string;
  token1_reserves: string;
  token0_reserves_raw: string;
  token1_reserves_raw: string;

  pool: Pool;

  token0_reserves_usd: string;
  token1_reserves_usd: string;
  fees_token0_owed_usd: string;
  fees_token1_owed_usd: string;
  total_reserves_usd: string;
  total_fees_owed_usd: string;
  is_in_range: boolean;

  fees_token1_owed_raw: string;
  fees_token0_owed_raw: string;
}

// Interface for arguments to getSinglePosition
export interface GetSinglePositionArgs {
  key: CandidPositionKey;
  pools: Pool[];
  icpTokens: IcpToken[];
  unAuthenticatedAgent: Agent;
}

// Interface for arguments to getPositionsByOwner
export interface GetPositionsByOwnerArgs {
  owner: Principal;
  pools: Pool[];
  icpTokens: IcpToken[];
  unAuthenticatedAgent: Agent;
}

/**
 * Fetches a single position from the DEX canister based on a position key and transforms it into a Position object.
 * @param args The arguments object containing the position key, pools, ICP tokens, and unauthenticated agent.
 * @returns A Promise resolving to a Position object.
 * @throws Error if the position is not found.
 */
export async function getSinglePosition(
  args: GetSinglePositionArgs,
): Promise<Response<Position | undefined>> {
  const { key, pools, icpTokens, unAuthenticatedAgent } = args;

  const dex_actor = Actor.createActor(idlFactory, {
    agent: unAuthenticatedAgent,
    canisterId: appic_dex,
  });

  try {
    // Fetch all positions for the owner and filter for the specific position
    const positionsData = (await dex_actor.get_positions_by_owner(key.owner)) as Array<
      [CandidPositionKey, CandidPositionInfo]
    >;
    const matchingPosition = positionsData.find(
      ([posKey]) =>
        posKey.pool === key.pool &&
        posKey.tick_lower === key.tick_lower &&
        posKey.tick_upper === key.tick_upper,
    );
    if (!matchingPosition) {
      return { success: false, message: 'Position not found', result: undefined };
      throw new Error('Position not found');
    }

    const [posKey, info] = matchingPosition;
    const positions = createPositionObjects(pools, [[posKey, info]], icpTokens);
    return { success: true, message: '', result: positions[0] };
  } catch (error) {
    return { success: false, result: undefined, message: `Failed to get position ${error}` };
  }
}

/**
 * Fetches all positions for a given principal from the DEX canister and transforms them into Position objects.
 * @param args The arguments object containing the owner principal, pools, ICP tokens, and unauthenticated agent.
 * @returns A Promise resolving to an array of Position objects (empty if no positions exist).
 */
export async function getPositionsByOwner(
  args: GetPositionsByOwnerArgs,
): Promise<Response<Position[] | undefined>> {
  const { owner, pools, icpTokens, unAuthenticatedAgent } = args;

  const dex_actor = Actor.createActor(idlFactory, {
    agent: unAuthenticatedAgent,
    canisterId: appic_dex,
  });
  try {
    const positionsData = (await dex_actor.get_positions_by_owner(owner)) as Array<
      [CandidPositionKey, CandidPositionInfo]
    >;

    console.log(positionsData);
    return {
      result: createPositionObjects(pools, positionsData, icpTokens),
      message: '',
      success: true,
    };
  } catch (error) {
    return { result: undefined, success: false, message: `Failed to get user positions ${error}` };
  }
}

// Main function to create list of Position objects
export function createPositionObjects(
  pools: Pool[],
  positions: Array<[CandidPositionKey, CandidPositionInfo]>,
  icpTokens: IcpToken[],
): Position[] {
  return positions.map(([positionKey, positionInfo]) => {
    // Find the pool
    const pool = pools.find((p) => arePoolsEqual(p.pool_id, positionKey.pool));
    if (!pool) throw new Error('Pool not found');

    // Find token0 and token1 from icpTokens
    const token0 = icpTokens.find((t) => t.canisterId === pool.pool_id.token0.toText());
    const token1 = icpTokens.find((t) => t.canisterId === pool.pool_id.token1.toText());
    if (!token0 || !token1) throw new Error('Token not found');

    const decimals0 = token0.decimals;
    const decimals1 = token1.decimals;

    // Get USD prices, prefer pool prices if available
    const token0_usd_price = pool.token0_usd_price
      ? new BigNumber(pool.token0_usd_price)
      : new BigNumber(token0.usdPrice);
    const token1_usd_price = pool.token1_usd_price
      ? new BigNumber(pool.token1_usd_price)
      : new BigNumber(token1.usdPrice);

    // Calculate sqrt ratios using BigNumber
    const sqrtRatioCurrentX96 = new BigNumber(pool.sqrt_price_x96);
    const sqrtRatioLowerX96 = BigNumber(
      TickMath.getSqrtRatioAtTick(Number(positionKey.tick_lower)).toString(),
    );
    const sqrtRatioUpperX96 = BigNumber(
      TickMath.getSqrtRatioAtTick(Number(positionKey.tick_upper)).toString(),
    );

    const liquidity = new BigNumber(positionInfo.liquidity);

    // Calculate reserves using provided functions
    let amount0: BigNumber;
    let amount1: BigNumber;
    let is_in_range: boolean;
    if (sqrtRatioCurrentX96.lte(sqrtRatioLowerX96)) {
      // Below range: all in token0
      amount0 = SqrtPriceMath.getAmount0Delta(
        sqrtRatioLowerX96,
        sqrtRatioUpperX96,
        liquidity,
        false,
      );
      amount1 = new BigNumber(0);
      is_in_range = false;
    } else if (sqrtRatioCurrentX96.lt(sqrtRatioUpperX96)) {
      // In range: both tokens
      amount0 = SqrtPriceMath.getAmount0Delta(
        sqrtRatioCurrentX96,
        sqrtRatioUpperX96,
        liquidity,
        false,
      );
      amount1 = SqrtPriceMath.getAmount1Delta(
        sqrtRatioLowerX96,
        sqrtRatioCurrentX96,
        liquidity,
        false,
      );
      is_in_range = true;
    } else {
      // Above range: all in token1
      amount0 = new BigNumber(0);
      amount1 = SqrtPriceMath.getAmount1Delta(
        sqrtRatioLowerX96,
        sqrtRatioUpperX96,
        liquidity,
        false,
      );
      is_in_range = false;
    }

    // Convert reserves to decimal strings
    const token0Reserves = amount0.dividedBy(new BigNumber(10).pow(decimals0));
    const token1Reserves = amount1.dividedBy(new BigNumber(10).pow(decimals1));

    // Handle fees
    const feesToken0Owed = new BigNumber(positionInfo.fees_token0_owed).dividedBy(
      new BigNumber(10).pow(decimals0),
    );
    const feesToken1Owed = new BigNumber(positionInfo.fees_token1_owed).dividedBy(
      new BigNumber(10).pow(decimals1),
    );

    // Calculate USD values
    const token0ReservesUsd = token0Reserves.multipliedBy(token0_usd_price).toFixed(2);
    const token1ReservesUsd = token1Reserves.multipliedBy(token1_usd_price).toFixed(2);
    const feesToken0OwedUsd = feesToken0Owed.multipliedBy(token0_usd_price).toFixed(2);
    const feesToken1OwedUsd = feesToken1Owed.multipliedBy(token1_usd_price).toFixed(2);
    const totalReservesUsd = new BigNumber(token0ReservesUsd).plus(token1ReservesUsd).toFixed(2);
    const totalFeesOwedUsd = new BigNumber(feesToken0OwedUsd).plus(feesToken1OwedUsd).toFixed(2);

    // Construct the Position object
    return {
      key: positionKey,
      fees_token0_owed: feesToken0Owed.toString(),
      fee_growth_inside_1_last_x128: positionInfo.fee_growth_inside_1_last_x128.toString(),
      liquidity: positionInfo.liquidity.toString(),
      fees_token1_owed: feesToken1Owed.toString(),
      fee_growth_inside_0_last_x128: positionInfo.fee_growth_inside_0_last_x128.toString(),
      token0_reserves: token0Reserves.toString(),
      token1_reserves: token1Reserves.toString(),
      token0_reserves_usd: token0ReservesUsd,
      token1_reserves_usd: token1ReservesUsd,
      token0_reserves_raw: amount0.toString(),
      token1_reserves_raw: amount1.toString(),
      fees_token0_owed_usd: feesToken0OwedUsd,
      fees_token1_owed_usd: feesToken1OwedUsd,
      total_reserves_usd: totalReservesUsd,
      total_fees_owed_usd: totalFeesOwedUsd,
      is_in_range,

      fees_token1_owed_raw: positionInfo.fees_token1_owed.toString(),
      fees_token0_owed_raw: positionInfo.fees_token0_owed.toString(),
      pool,
    };
  });
}
