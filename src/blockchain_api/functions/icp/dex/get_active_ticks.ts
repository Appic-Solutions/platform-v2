import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../did/appic/appic_dex/appic_dex.did';
import { CandidTickInfo, CandidPoolId } from '../../../did/appic/appic_dex/appic_dex_types';
import { appic_dex } from '../../../../canister_ids.json';
import { Response } from '@/blockchain_api/types/response';
import { TickMath } from './utils/tick_math';
import BigNumber from 'bignumber.js';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { getTickSpacing } from './constants';

export interface ActiveTickArgs {
  pool_id: CandidPoolId;
  token0: IcpToken;
  token1: IcpToken;
  is_token0_selected: boolean;
}

export interface ActiveTick {
  tick: number;
  sqrtx96_price: string;
  price: string;
  liquidity_gross: string;
}

export async function get_active_liquidity(
  args: ActiveTickArgs,
  unauthenticated_agent: HttpAgent,
): Promise<Response<ActiveTick[]>> {
  const dex_actor = Actor.createActor(idlFactory, {
    agent: unauthenticated_agent,
    canisterId: appic_dex,
  });

  let tick_spacing = getTickSpacing(Number(args.pool_id.fee))!;

  let min_tick = BigNumber(TickMath.MIN_TICK)
    .dividedToIntegerBy(tick_spacing)
    .multipliedBy(tick_spacing)
    .toNumber();
  let max_tick = BigNumber(TickMath.MAX_TICK)
    .dividedToIntegerBy(tick_spacing)
    .multipliedBy(tick_spacing)
    .toNumber();

  console.log(min_tick, max_tick);

  try {
    let ticks = (await dex_actor.get_active_ticks(args.pool_id)) as CandidTickInfo[];

    let active_ticks = transforom_active_ticks(args, ticks, min_tick, max_tick);

    return { success: true, result: active_ticks, message: '' };
  } catch (error) {
    return {
      success: false,
      result: [],
      message: String(error),
    };
  }
}

export function transforom_active_ticks(
  args: ActiveTickArgs,
  ticks: CandidTickInfo[],
  min_tick: number,
  max_tick: number,
): ActiveTick[] {
  const { token0, token1, is_token0_selected } = args;

  // Map fetched ticks to tick index -> liquidity_gross
  let tick_map = new Map<number, CandidTickInfo>();
  for (let tick of ticks) {
    tick_map.set(Number(tick.tick), tick);
  }

  // Include min and max ticks if not present
  let all_tick_indices = new Set<number>([...Array.from(tick_map.keys()), min_tick, max_tick]);
  let sorted_tick_indices = Array.from(all_tick_indices).sort((a, b) => a - b);

  let active_ticks: ActiveTick[] = [];

  for (let tick_index of sorted_tick_indices) {
    // Compute sqrt price at tick
    let sqrtx96_price = TickMath.getSqrtRatioAtTick(tick_index);
    console.log(`Tick: ${tick_index}, Sqrt Price: ${sqrtx96_price}`);
    let sqrtx96_price_str = sqrtx96_price.toString();

    // Calculate price: (sqrt_price_x96 / 2^96)^2 gives token1/token0 in smallest units
    const Q96 = new BigNumber(2).pow(96);
    let P = new BigNumber(sqrtx96_price.toString()).div(Q96).pow(2);

    // Adjust for decimals to get price in standard units (token1 per token0)
    const decimal_adjustment = new BigNumber(10).pow(token0.decimals - token1.decimals);
    let P_adjusted = P.times(decimal_adjustment);

    // Determine price based on is_token0_selected
    let price_bn: BigNumber;
    if (is_token0_selected) {
      // Price of token0 in terms of token1 (token1 per token0)
      price_bn = P_adjusted;
    } else {
      // Price of token1 in terms of token0 (token0 per token1)
      price_bn = new BigNumber(1).div(P_adjusted);
    }
    let price_str = price_bn.toFixed(18);

    // Get liquidity_gross, default to "0" for min/max ticks if not in tick_map
    let liquidity_gross_str = tick_map.has(tick_index)
      ? tick_map.get(tick_index)!.liquidity_gross.toString()
      : '0';

    active_ticks.push({
      tick: tick_index,
      sqrtx96_price: sqrtx96_price_str,
      price: price_str,
      liquidity_gross: liquidity_gross_str,
    });
  }

  return active_ticks;
}
