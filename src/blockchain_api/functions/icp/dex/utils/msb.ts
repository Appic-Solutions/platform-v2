import BigNumber from 'bignumber.js';


export const ZERO: BigNumber = new BigNumber(0);

// Custom assertion function to replace tiny-invariant
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

// Constants
const TWO: BigNumber = new BigNumber(2);
const MAX_UINT256: BigNumber = new BigNumber('2').pow(256).minus(1);
const POWERS_OF_2: [number, BigNumber][] = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, BigNumber] => [
  pow,
  TWO.pow(pow),
]);

/**
 * Returns the index of the most significant bit of the number,
 * where the least significant bit is at index 0 and the most significant bit is at index 255
 * @param x The value for which to compute the most significant bit, must be greater than 0
 * @returns The index of the most significant bit
 */
export function mostSignificantBit(x: BigNumber): number {
  assert(x.gt(ZERO), 'ZERO');
  assert(x.lte(MAX_UINT256), 'MAX');

  let msb: number = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (x.gte(min)) {
      x = x.shiftedBy(-power);
      msb += power;
    }
  }
  return msb;
}
