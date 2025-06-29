import BigNumber from 'bignumber.js';
import { mostSignificantBit } from './msb';

// Custom assertion function to replace tiny-invariant
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

// Constants
export const ZERO: BigNumber = new BigNumber(0);
export const ONE: BigNumber = new BigNumber(1);



const mulShift = (val: BigNumber, mulBy: string): BigNumber => {
  return new BigNumber(val).multipliedBy(new BigNumber(mulBy)).shiftedBy(-128);
};

const Q32: BigNumber = new BigNumber(2).pow(32);

export abstract class TickMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * The minimum tick that can be used on any pool.
   */
  public static readonly MIN_TICK: number = -887272;
  /**
   * The maximum tick that can be used on any pool.
   */
  public static readonly MAX_TICK: number = -TickMath.MIN_TICK;

  /**
   * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
   */
  public static readonly MIN_SQRT_RATIO: BigNumber = new BigNumber('4295128739');
  /**
   * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
   */
  public static readonly MAX_SQRT_RATIO: BigNumber = new BigNumber('1461446703485210103287273052203988822378723970342');

  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick The tick for which to compute the sqrt ratio
   * @returns The sqrt ratio as a BigNumber
   */
  public static getSqrtRatioAtTick(tick: number): BigNumber {
    assert(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick), 'TICK');
    const absTick: number = tick < 0 ? -tick : tick;

    let ratio: BigNumber = (absTick & 0x1) !== 0
      ? new BigNumber('0xfffcb933bd6fad37aa2d162d1a594001')
      : new BigNumber('0x100000000000000000000000000000000');

    if ((absTick & 0x2) !== 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) !== 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) !== 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) !== 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) !== 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) !== 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) !== 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) !== 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) !== 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) !== 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) !== 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) !== 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) !== 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) !== 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) !== 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) !== 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) !== 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) !== 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) !== 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');

    if (tick > 0) {
      const maxUint256: BigNumber = new BigNumber('2').pow(256).minus(1);
      ratio = maxUint256.dividedBy(ratio).integerValue(BigNumber.ROUND_DOWN);
    }

    // back to Q96
    return ratio.mod(Q32).gt(ZERO)
      ? ratio.dividedBy(Q32).integerValue(BigNumber.ROUND_DOWN).plus(ONE)
      : ratio.dividedBy(Q32).integerValue(BigNumber.ROUND_DOWN);
  }

  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 The sqrt ratio as a Q64.96 for which to compute the tick
   * @returns The corresponding tick
   */
  public static getTickAtSqrtRatio(sqrtRatioX96: BigNumber): number {
    assert(
      sqrtRatioX96.gte(TickMath.MIN_SQRT_RATIO) && sqrtRatioX96.lt(TickMath.MAX_SQRT_RATIO),
      'SQRT_RATIO'
    );

    const sqrtRatioX128: BigNumber = sqrtRatioX96.shiftedBy(32);
    const msb: number = mostSignificantBit(sqrtRatioX128);

    let r: BigNumber;
    if (new BigNumber(msb).gte(128)) {
      r = sqrtRatioX128.shiftedBy(-(msb - 127));
    } else {
      r = sqrtRatioX128.shiftedBy(127 - msb);
    }

    let log_2: BigNumber = new BigNumber(msb - 128).shiftedBy(64);

    for (let i = 0; i < 14; i++) {
      r = r.multipliedBy(r).shiftedBy(-127);
      const f: BigNumber = r.shiftedBy(-128).integerValue(BigNumber.ROUND_DOWN);
      log_2 = log_2.plus(f.shiftedBy(63 - i));
      r = r.shiftedBy(-f.toNumber());
    }

    const log_sqrt10001: BigNumber = log_2.multipliedBy('255738958999603826347141');

    const tickLow: number = new BigNumber(log_sqrt10001)
      .minus('3402992956809132418596140100660247210')
      .shiftedBy(-128)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber();

    const tickHigh: number = new BigNumber(log_sqrt10001)
      .plus('291339464771989622907027621153398088495')
      .shiftedBy(-128)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber();

    return tickLow === tickHigh
      ? tickLow
      : TickMath.getSqrtRatioAtTick(tickHigh).lte(sqrtRatioX96)
      ? tickHigh
      : tickLow;
  }
}
