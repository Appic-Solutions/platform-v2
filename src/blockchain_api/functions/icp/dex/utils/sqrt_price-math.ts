import BigNumber from 'bignumber.js';

// Constants
const MaxUint256 = new BigNumber(2).pow(256).minus(1);
const MaxUint160 = new BigNumber(2).pow(160).minus(1);
const TWO_POW_256 = new BigNumber(2).pow(256);
const ZERO = new BigNumber(0);
const ONE = new BigNumber(1);
const Q96 = new BigNumber(2).pow(96);

// Helper functions
function multiplyIn256(x: BigNumber, y: BigNumber): BigNumber {
  return x.multipliedBy(y).modulo(TWO_POW_256);
}

function addIn256(x: BigNumber, y: BigNumber): BigNumber {
  return x.plus(y).modulo(TWO_POW_256);
}

function mulDivRoundingUp(a: BigNumber, b: BigNumber, c: BigNumber): BigNumber {
  const product = a.multipliedBy(b);
  const quotient = product.dividedToIntegerBy(c);
  const remainder = product.minus(quotient.multipliedBy(c));
  if (remainder.gt(0)) {
    return quotient.plus(1);
  } else {
    return quotient;
  }
}

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export abstract class SqrtPriceMath {
  private constructor() {}

  public static getAmount0Delta(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber, roundUp: boolean): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    const numerator1 = liquidity.multipliedBy(Q96);
    const numerator2 = sqrtRatioBX96.minus(sqrtRatioAX96);

    if (roundUp) {
      const inner = mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96);
      return mulDivRoundingUp(inner, ONE, sqrtRatioAX96);
    } else {
      return numerator1.multipliedBy(numerator2).dividedToIntegerBy(sqrtRatioBX96).dividedToIntegerBy(sqrtRatioAX96);
    }
  }

  public static getAmount1Delta(sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber, roundUp: boolean): BigNumber {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    const diff = sqrtRatioBX96.minus(sqrtRatioAX96);
    if (roundUp) {
      return mulDivRoundingUp(liquidity, diff, Q96);
    } else {
      return liquidity.multipliedBy(diff).dividedToIntegerBy(Q96);
    }
  }

  public static getNextSqrtPriceFromInput(sqrtPX96: BigNumber, liquidity: BigNumber, amountIn: BigNumber, zeroForOne: boolean): BigNumber {
    if (!sqrtPX96.gt(ZERO)) {
      throw new Error('sqrtPX96 must be greater than zero');
    }
    if (!liquidity.gt(ZERO)) {
      throw new Error('liquidity must be greater than zero');
    }

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true)
      : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  }

  public static getNextSqrtPriceFromOutput(sqrtPX96: BigNumber, liquidity: BigNumber, amountOut: BigNumber, zeroForOne: boolean): BigNumber {
    if (!sqrtPX96.gt(ZERO)) {
      throw new Error('sqrtPX96 must be greater than zero');
    }
    if (!liquidity.gt(ZERO)) {
      throw new Error('liquidity must be greater than zero');
    }

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false)
      : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  }

  private static getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96: BigNumber, liquidity: BigNumber, amount: BigNumber, add: boolean): BigNumber {
    if (amount.isZero()) return sqrtPX96;
    const numerator1 = liquidity.multipliedBy(Q96);

    if (add) {
      const product = multiplyIn256(amount, sqrtPX96);
      if (!amount.isZero() && product.dividedToIntegerBy(amount).eq(sqrtPX96)) {
        const denominator = addIn256(numerator1, product);
        if (denominator.gte(numerator1)) {
          return mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }
      const temp = numerator1.dividedToIntegerBy(sqrtPX96).plus(amount);
      return mulDivRoundingUp(numerator1, ONE, temp);
    } else {
      const product = multiplyIn256(amount, sqrtPX96);
      if (!amount.isZero()) {
        invariant(product.dividedToIntegerBy(amount).eq(sqrtPX96), 'product / amount != sqrtPX96');
      }
      invariant(numerator1.gt(product), 'numerator1 <= product');
      const denominator = numerator1.minus(product);
      return mulDivRoundingUp(numerator1, sqrtPX96, denominator);
    }
  }

  private static getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96: BigNumber, liquidity: BigNumber, amount: BigNumber, add: boolean): BigNumber {
    if (add) {
      let quotient: BigNumber;
      if (amount.lte(MaxUint160)) {
        quotient = amount.multipliedBy(Q96).dividedToIntegerBy(liquidity);
      } else {
        quotient = amount.multipliedBy(Q96).dividedToIntegerBy(liquidity);
      }
      return sqrtPX96.plus(quotient);
    } else {
      const quotient = mulDivRoundingUp(amount, Q96, liquidity);
      invariant(sqrtPX96.gt(quotient), 'sqrtPX96 <= quotient');
      return sqrtPX96.minus(quotient);
    }
  }
}
