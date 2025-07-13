export function mostSignificantBit(x: bigint): number {
    // Validate that x is greater than zero
    if (x <= 0n) {
        throw new Error('ZERO');
    }
    // Validate that x is less than or equal to MaxUint256 (2^256 - 1)
    if (x > (1n << 256n) - 1n) {
        throw new Error('MAX');
    }

    // Precompute powers of 2 as [power, 2^power] pairs
    const POWERS_OF_2: [number, bigint][] = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, bigint] => [
        pow,
        1n << BigInt(pow)
    ]);

    let msb: number = 0;
    for (const [power, min] of POWERS_OF_2) {
        // If x is greater than or equal to the current power of 2
        if (x >= min) {
            // Shift x right by power bits and update msb
            x >>= BigInt(power);
            msb += power;
        }
    }
    return msb;
}
