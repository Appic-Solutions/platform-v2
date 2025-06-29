import BigNumber from 'bignumber.js';
import {maxLiquidityForAmount0Precise,maxLiquidityForAmount1} from "./utils/max_liquidity_amount"
import {SqrtPriceMath} from "./utils/sqrt_price-math"

// External functions assumed to be available:
// get_liquidity_for_amount0(sqrt_price_a: BigNumber, sqrt_price_b: BigNumber, amount0: BigNumber): BigNumber
// get_liquidity_for_amount1(sqrt_price_a: BigNumber, sqrt_price_b: BigNumber, amount1: BigNumber): BigNumber
// getAmount0delta(sqrt_price_a: BigNumber, sqrt_price_b: BigNumber, liquidity: BigNumber): BigNumber
// getAmount1delta(sqrt_price_a: BigNumber, sqrt_price_b: BigNumber, liquidity: BigNumber): BigNumber

interface TokenAmount {
  raw: BigNumber;
  formatted: string;
}

interface MintAmounts {
  token0: TokenAmount;
  token1: TokenAmount;
}

// Helper function to format BigNumber with decimals
function formatUnits(amount: BigNumber, decimals: number): string {
  const scale = new BigNumber(10).pow(decimals);
  return amount.dividedBy(scale).toFixed();
}

export function calculate_mint_amounts(
  amount: BigNumber,
  is_token0_selected: boolean,
  token0_decimals: number,
  token1_decimals: number,
  currentsqrtRatioX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  sqrtRatioAX96: BigNumber
): MintAmounts {
  let liquidity: BigNumber;
  let amount0: BigNumber;
  let amount1: BigNumber;

  // Ensure sqrtRatioAX96 is the lower price and sqrtRatioBX96 is the upper price
  const sqrtPriceLower = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioAX96 : sqrtRatioBX96;
  const sqrtPriceUpper = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioBX96 : sqrtRatioAX96;

  if (is_token0_selected) {
    // User specifies token0 amount
    if (currentsqrtRatioX96.lte(sqrtPriceLower)) {
      // Current price is below the range: only token0 is needed
      liquidity = maxLiquidityForAmount0Precise(sqrtPriceLower, sqrtPriceUpper, amount);
      amount0 = amount;
      amount1 = new BigNumber(0);
    } else if (currentsqrtRatioX96.lt(sqrtPriceUpper)) {
      // Current price is within the range: both tokens are needed
      liquidity = maxLiquidityForAmount0Precise(currentsqrtRatioX96, sqrtPriceUpper, amount);
      amount0 = amount;
      amount1 = SqrtPriceMath.getAmount1Delta(sqrtPriceLower, currentsqrtRatioX96, liquidity,true);
    } else {
      // Current price is above the range: only token1 is needed, so token0 alone can't mint
      amount0 = new BigNumber(0);
      amount1 = new BigNumber(0);
    }
  } else {
    // User specifies token1 amount
    if (currentsqrtRatioX96.gte(sqrtPriceUpper)) {
      // Current price is above the range: only token1 is needed
      liquidity = maxLiquidityForAmount1(sqrtPriceLower, sqrtPriceUpper, amount);
      amount0 = new BigNumber(0);
      amount1 = amount;
    } else if (currentsqrtRatioX96.gt(sqrtPriceLower)) {
      // Current price is within the range: both tokens are needed
      liquidity = maxLiquidityForAmount1(sqrtPriceLower, currentsqrtRatioX96, amount);
      amount0 = SqrtPriceMath.getAmount0Delta(currentsqrtRatioX96, sqrtPriceUpper, liquidity,true);
      amount1 = amount;
    } else {
      // Current price is below the range: only token0 is needed, so token1 alone can't mint
      amount0 = new BigNumber(0);
      amount1 = new BigNumber(0);
    }
  }

  // Format amounts with decimals
  const formattedAmount0 = formatUnits(amount0, token0_decimals);
  const formattedAmount1 = formatUnits(amount1, token1_decimals);

  return {
    token0: {
      raw: amount0,
      formatted: formattedAmount0,
    },
    token1: {
      raw: amount1,
      formatted: formattedAmount1,
    },
  };
}
