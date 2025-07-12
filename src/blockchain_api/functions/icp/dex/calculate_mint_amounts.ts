import BigNumber from 'bignumber.js';
import {
  maxLiquidityForAmount0Precise,
  maxLiquidityForAmount1,
} from './utils/max_liquidity_amount';
import { SqrtPriceMath } from './utils/sqrt_price-math';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { calculate_price } from './utils/price';
import { TickMath } from './utils/tick_math';

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

export interface CalculateMintAmountsArgs {
  selected_amount: string;
  is_amount_zero: boolean;
  is_token0_selected: boolean;
  token0: IcpToken;
  token1: IcpToken;
  sqrt_price_x96: string; // sqrt_price_x96 from the pool state, get from calculate_price function
  min_price: string; // min price from ui
  max_price: string; // max price from ui
  tick_spacing: number; // tick spacing from getTickSpacing function
}

export function calculate_mint_amounts({
  selected_amount, // amount that users input in the UI
  is_amount_zero, // token0 or token1
  is_token0_selected,
  token0,
  token1,
  sqrt_price_x96, // sqrt_price_x96 from the pool state
  min_price,
  max_price,
  tick_spacing,
}: CalculateMintAmountsArgs): MintAmounts {
  let liquidity: BigNumber;
  let amount0: BigNumber;
  let amount1: BigNumber;

  let sqrtRatioAX96 = BigNumber(
    calculate_price({ token0, token1, price: min_price, is_token0_selected }).sqrt_price_x96,
  );
  let sqrtRatioBX96 = BigNumber(
    calculate_price({ token0, token1, price: max_price, is_token0_selected }).sqrt_price_x96,
  );

  let currentsqrtRatioX96 = BigNumber(sqrt_price_x96);

  let amount = BigNumber(selected_amount);

  // Ensure sqrtRatioAX96 is the lower price and sqrtRatioBX96 is the upper price
  const sqrtPriceX96_lower = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioAX96 : sqrtRatioBX96;
  const sqrtPriceX96_higher = sqrtRatioAX96.lt(sqrtRatioBX96) ? sqrtRatioBX96 : sqrtRatioAX96;

  // Get raw ticks (placeholder functions)
  const tick_lower_raw = TickMath.getTickAtSqrtRatio(sqrtPriceX96_lower);
  const tick_upper_raw = TickMath.getTickAtSqrtRatio(sqrtPriceX96_higher);

  // Align ticks with tick_spacing
  const tick_lower_aligned = Math.floor(tick_lower_raw / tick_spacing) * tick_spacing;
  const tick_upper_aligned = Math.ceil(tick_upper_raw / tick_spacing) * tick_spacing;

  const sqrtPriceLower = TickMath.getSqrtRatioAtTick(tick_lower_aligned);
  const sqrtPriceUpper = TickMath.getSqrtRatioAtTick(tick_upper_aligned);

  if (is_amount_zero) {
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
      amount1 = SqrtPriceMath.getAmount1Delta(sqrtPriceLower, currentsqrtRatioX96, liquidity, true);
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
      amount0 = SqrtPriceMath.getAmount0Delta(currentsqrtRatioX96, sqrtPriceUpper, liquidity, true);
      amount1 = amount;
    } else {
      // Current price is below the range: only token0 is needed, so token1 alone can't mint
      amount0 = new BigNumber(0);
      amount1 = new BigNumber(0);
    }
  }

  // Format amounts with decimals
  const formattedAmount0 = formatUnits(amount0, token0.decimals);
  const formattedAmount1 = formatUnits(amount1, token1.decimals);

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
