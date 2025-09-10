import axios from 'axios';
import { IcpToken } from '../types/tokens';
import { BigNumber } from 'bignumber.js';
import { Response } from '../types/response';

// Define interfaces based on the API response structure
interface ICPRoute {
  sell_token: string;
  buy_token: string;
  fee: string;
  pool_address: string;
  protocol: string;
}

export interface ICPQuoteData {
  protocol: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  routeString: string;
  route: ICPRoute[];
  score: number;
  minAmountOut: string;
  slippage: string;
  estimatedTime: number;
  alternativeRoutes: any[]; // Can be further typed if more details are available
}

interface ICPQuoteResponse {
  success: boolean;
  data: ICPQuoteData;
}

export interface IcpQuote {
  protocol: string;
  tokenIn: IcpToken;
  tokenOut: IcpToken;
  amountInRaw: string;
  amountOutRaw: string;
  amountIn: string;
  approvalAmount: string;
  amountOut: string;
  amountOutUSD: string;
  routeString: string;
  route: ICPRoute[];
  score: number;
  minAmountOutRaw: string;
  minAmountOut: string;
  minAmountOutUSD: string;
  slippage: string;
  estimatedTime: string;
  usdValueIn: string; // USD value of input amount
  usdDifference: string; // Difference between USD out and USD in
  tokenInPriceInTokenOut: string; // Price of tokenIn in terms of tokenOut (how many tokenOut per 1 tokenIn)
  tokenOutPriceInTokenIn: string; // Price of tokenOut in terms of tokenIn (how many tokenIn per 1 tokenOut)
  transfer_approval_fees_usd: string;
}

/**
 * Fetches the ICP quote using the provided API endpoint and transforms it with calculated details.
 * @param tokenIn Input token details
 * @param tokenOut Output token details
 * @param amount Amount to swap (as decimal string)
 * @returns Promise resolving to the transformed quote response
 */
export async function fetchICPQuote(
  tokenIn: IcpToken,
  tokenOut: IcpToken,
  amount: string,
): Promise<Response<IcpQuote | undefined>> {
  const bn10 = BigNumber(10);
  const feeIn = tokenIn.fee || '0';
  const feeOut = tokenOut.fee || '0';
  const feeInDec = BigNumber(feeIn).dividedBy(BigNumber(10).pow(tokenIn.decimals));
  const feeOutDec = BigNumber(feeOut).dividedBy(BigNumber(10).pow(tokenOut.decimals));

  const transfer_approval_fees_usd = feeInDec
    .multipliedBy(2)
    .multipliedBy(tokenIn.usdPrice)
    .plus(feeOutDec.multipliedBy(tokenOut.usdPrice))
    .toFixed(2);

  const approvalAmount = BigNumber(amount)
    .multipliedBy(bn10.pow(tokenIn.decimals))
    .minus(feeIn)
    .toFixed();

  const amountIn = BigNumber(amount)
    .multipliedBy(bn10.pow(tokenIn.decimals))
    .minus(BigNumber(feeIn).multipliedBy(2))
    .toFixed();

  try {
    const response = await axios.get<ICPQuoteResponse>(
      'https://quoter.appicdao.com/api/icp/quote',
      {
        params: {
          tokenIn: tokenIn.canisterId,
          tokenOut: tokenOut.canisterId,
          amountIn,
        },
      },
    );

    if (response.data.success == true) {
      const data = response.data.data;

      // Adjust amountOut and minAmountOut for output fee
      data.amountOut = BigNumber(data.amountOut).minus(feeOut).toString();
      data.minAmountOut = BigNumber(data.minAmountOut).minus(feeOut).toString();

      // Calculate decimal-adjusted amounts
      const amountInDec = BigNumber(data.amountIn).div(bn10.pow(tokenIn.decimals));
      const amountOutDec = BigNumber(data.amountOut).div(bn10.pow(tokenOut.decimals));
      const minAmountOutDec = BigNumber(data.minAmountOut).div(bn10.pow(tokenOut.decimals));

      // Transform routeString with decimals and symbols
      data.routeString = `${tokenIn.symbol} \u2192 ${tokenOut.symbol}`;

      // Calculate prices
      const tokenInPriceInTokenOut = amountOutDec.div(amountInDec).toFixed(6);
      const tokenOutPriceInTokenIn = amountInDec.div(amountOutDec).toFixed(6);

      console.log(tokenInPriceInTokenOut, tokenOutPriceInTokenIn);

      // Calculate USD values
      const usdValueIn = amountInDec.multipliedBy(tokenIn.usdPrice || '0').toFixed(2);
      const usdValueOut = amountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
      const usdValueMinOut = minAmountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
      const usdDifference = BigNumber(usdValueOut).minus(usdValueIn).toFixed(2);

      // Map to IcpQuote with additional calculated fields
      const quote: IcpQuote = {
        protocol: data.protocol,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountInRaw: data.amountIn,
        amountOutRaw: data.amountOut,
        amountIn: amountInDec.toFixed(),
        approvalAmount: approvalAmount,
        amountOut: amountOutDec.toFixed(),
        amountOutUSD: usdValueOut,
        routeString: data.routeString,
        route: data.route,
        score: data.score,
        minAmountOutRaw: data.minAmountOut,
        minAmountOut: minAmountOutDec.toFixed(),
        minAmountOutUSD: usdValueMinOut,
        slippage: data.slippage,
        estimatedTime: '3 to 5 seconds',
        usdValueIn,
        usdDifference,
        tokenInPriceInTokenOut,
        tokenOutPriceInTokenIn,
        transfer_approval_fees_usd,
      };

      return { result: quote, message: '', success: true };
    } else {
      return {
        success: false,
        message: `${response.data.data}`,
        result: undefined,
      };
    }
  } catch (error) {
    console.error('Error fetching ICP quote:', error);
    return {
      success: false,
      message: `${error}`,
      result: undefined,
    };
  }
}
