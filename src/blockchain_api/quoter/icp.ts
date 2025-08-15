import axios from 'axios';
import { IcpToken } from '../types/tokens';
import { BigNumber } from 'bignumber.js';

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

/**
 * Fetches the ICP quote using the provided API endpoint.
 * @param tokenIn Input token principal or mapped address
 * @param tokenOut Output token principal or mapped address
 * @param amountIn Amount to swap in smallest token unit (as string)
 * @returns Promise resolving to the full quote response
 */
export async function fetchICPQuote(
  tokenIn: IcpToken,
  tokenOut: IcpToken,
  amount: string,
): Promise<ICPQuoteResponse> {
  let amountIn = BigNumber(amount)
    .multipliedBy(BigNumber(10).pow(tokenIn.decimals))
    .minus(tokenIn.fee!)
    .toString();
  try {
    let response = await axios.get<ICPQuoteResponse>('https://quoter.appicdao.com/api/icp/quote', {
      params: {
        tokenIn: tokenIn.canisterId,
        tokenOut: tokenOut.canisterId,
        amountIn,
      },
    });
    response.data.data.amountOut = BigNumber(response.data.data.amountOut)
      .minus(tokenOut.fee!)
      .toString();
    response.data.data.minAmountOut = BigNumber(response.data.data.minAmountOut)
      .minus(tokenOut.fee!)
      .toString();

    return response.data;
  } catch (error) {
    console.error('Error fetching ICP quote:', error);
    throw error;
  }
}
