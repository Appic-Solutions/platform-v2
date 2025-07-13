import { mostSignificantBit } from "./msb";

export abstract class TickMath {
	/**
	 * Cannot be constructed.
	 */
	private constructor() { }

	/**
	 * The minimum tick that can be used on any pool.
	 */
	public static readonly MIN_TICK: number = -887272;
	/**
	 * The maximum tick that can be used on any pool.
	 */
	public static readonly MAX_TICK: number = 887272;

	/**
	 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
	 */
	public static readonly MIN_SQRT_RATIO: bigint = 4295128739n;
	/**
	 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
	 */
	public static readonly MAX_SQRT_RATIO: bigint = 1461446703485210103287273052203988822378723970342n;

	private static readonly Q32: bigint = 1n << 32n;
	private static readonly TWO_POW_128: bigint = 1n << 128n;

	/**
	 * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
	 * @param tick The tick for which to compute the sqrt ratio
	 * @returns The sqrt ratio as a BigInt
	 */
	public static getSqrtRatioAtTick(tick: number): bigint {
		if (tick < TickMath.MIN_TICK || tick > TickMath.MAX_TICK || !Number.isInteger(tick)) {
			throw new Error('Invalid tick');
		}
		const absTick: number = tick < 0 ? -tick : tick;
		let ratio: bigint = (absTick & 1) !== 0
			? 0xfffcb933bd6fad37aa2d162d1a594001n
			: 0x100000000000000000000000000000000n;

		if ((absTick & 0x2) !== 0) ratio = TickMath.mulShift(ratio, 0xfff97272373d413259a46990580e213an);
		if ((absTick & 0x4) !== 0) ratio = TickMath.mulShift(ratio, 0xfff2e50f5f656932ef12357cf3c7fdccn);
		if ((absTick & 0x8) !== 0) ratio = TickMath.mulShift(ratio, 0xffe5caca7e10e4e61c3624eaa0941cd0n);
		if ((absTick & 0x10) !== 0) ratio = TickMath.mulShift(ratio, 0xffcb9843d60f6159c9db58835c926644n);
		if ((absTick & 0x20) !== 0) ratio = TickMath.mulShift(ratio, 0xff973b41fa98c081472e6896dfb254c0n);
		if ((absTick & 0x40) !== 0) ratio = TickMath.mulShift(ratio, 0xff2ea16466c96a3843ec78b326b52861n);
		if ((absTick & 0x80) !== 0) ratio = TickMath.mulShift(ratio, 0xfe5dee046a99a2a811c461f1969c3053n);
		if ((absTick & 0x100) !== 0) ratio = TickMath.mulShift(ratio, 0xfcbe86c7900a88aedcffc83b479aa3a4n);
		if ((absTick & 0x200) !== 0) ratio = TickMath.mulShift(ratio, 0xf987a7253ac413176f2b074cf7815e54n);
		if ((absTick & 0x400) !== 0) ratio = TickMath.mulShift(ratio, 0xf3392b0822b70005940c7a398e4b70f3n);
		if ((absTick & 0x800) !== 0) ratio = TickMath.mulShift(ratio, 0xe7159475a2c29b7443b29c7fa6e889d9n);
		if ((absTick & 0x1000) !== 0) ratio = TickMath.mulShift(ratio, 0xd097f3bdfd2022b8845ad8f792aa5825n);
		if ((absTick & 0x2000) !== 0) ratio = TickMath.mulShift(ratio, 0xa9f746462d870fdf8a65dc1f90e061e5n);
		if ((absTick & 0x4000) !== 0) ratio = TickMath.mulShift(ratio, 0x70d869a156d2a1b890bb3df62baf32f7n);
		if ((absTick & 0x8000) !== 0) ratio = TickMath.mulShift(ratio, 0x31be135f97d08fd981231505542fcfa6n);
		if ((absTick & 0x10000) !== 0) ratio = TickMath.mulShift(ratio, 0x9aa508b5b7a84e1c677de54f3e99bc9n);
		if ((absTick & 0x20000) !== 0) ratio = TickMath.mulShift(ratio, 0x5d6af8dedb81196699c329225ee604n);
		if ((absTick & 0x40000) !== 0) ratio = TickMath.mulShift(ratio, 0x2216e584f5fa1ea926041bedfe98n);
		if ((absTick & 0x80000) !== 0) ratio = TickMath.mulShift(ratio, 0x48a170391f7dc42444e8fa2n);

		if (tick > 0) {
			const maxUint256 = (1n << 256n) - 1n;
			ratio = maxUint256 / ratio;
		}

		return (ratio % TickMath.Q32) > 0n ? (ratio / TickMath.Q32) + 1n : ratio / TickMath.Q32;
	}

	/**
	 * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
	 * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
	 * @param sqrtRatioX96 The sqrt ratio as a Q64.96 for which to compute the tick
	 * @returns The corresponding tick
	 */
	public static getTickAtSqrtRatio(sqrtRatioX96: bigint): number {
		if (sqrtRatioX96 < TickMath.MIN_SQRT_RATIO || sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) {
			throw new Error('Invalid sqrt ratio');
		}

		const sqrtRatioX128 = sqrtRatioX96 << 32n;
		const msb = mostSignificantBit(sqrtRatioX128);

		let r: bigint;
		if (msb >= 128) {
			r = sqrtRatioX128 >> BigInt(msb - 127);
		} else {
			r = sqrtRatioX128 << BigInt(127 - msb);
		}

		let log_2 = BigInt(msb - 128) << 64n;

		for (let i = 0; i < 14; i++) {
			r = (r * r) >> 127n;
			const f = r >> 128n;
			log_2 |= f << BigInt(63 - i);
			r >>= f;
		}

		const log_sqrt10001 = log_2 * 255738958999603826347141n;

		const tickLow = Number((log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n);
		const tickHigh = Number((log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n);

		return tickLow === tickHigh
			? tickLow
			: TickMath.getSqrtRatioAtTick(tickHigh) <= sqrtRatioX96
				? tickHigh
				: tickLow;
	}

	private static mulShift(val: bigint, mulBy: bigint): bigint {
		return (val * mulBy) >> 128n;
	}

}
