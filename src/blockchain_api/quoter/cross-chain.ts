import axios from 'axios';
import { Response } from '../types/response';
import { EvmToken, IcpToken } from '../types/tokens';
import BigNumber from 'bignumber.js';

// Interfaces from your previous code
interface QuoteStep {
  step: number;
  chain: string;
  chainId: number | string;
  quote: {
    routeString: string;
    route: {
      protocol: string;
      fee: string;
      sell_token: string;
      buy_token: string;
      pool_address: string;
    }[];
    path: string[];
    protocol: string;
    amountIn: string;
    amountOut: string;
    executionPrice: string;
    priceImpact: string;
    gasLimit?: string;
    gasLimitUnit?: string;
    maxGasFee?: string;
    maxGasFeeUnit?: string;
    gasPriceUSD?: string;
    rawGasEstimate?: string;
    rawGasEstimateUSD?: string;
    score: number;
    minAmountOut: string;
    slippage: string;
    routeDetails: {
      hops: {
        protocol: string;
        tokenOut: string;
        fee: string;
        poolAddress: string;
      }[];
      totalHops: number;
      protocols: string[];
      fees: string[];
    };
    qswapData?: {
      commands: number[];
      commandData: string[];
      deadline: number;
    };
    wrapGasFee?: string;
    unwrapGasFee?: string;
    isWrapOperation?: boolean;
    isUnwrapOperation?: boolean;
    tokenIn?: string;
    tokenOut?: string;
    canisterFee?: string;
  };
}

interface CrossChainQuoteData {
  totalAmountIn: string;
  totalAmountOut: string;
  steps: QuoteStep[];
  summary: { chainA: string; chainB: string };
  totalMinAmountOut: string;
  totalSlippage: string;
  encodedData: string;
}

interface CrossChainQuoteResponse {
  success: boolean;
  data: CrossChainQuoteData;
}

export interface CrossChainQuote {
  protocol: string;
  tokenIn: EvmToken | IcpToken;
  tokenOut: EvmToken | IcpToken;
  amountInRaw: string;
  amountOutRaw: string;
  amountIn: string;
  approvalAmount: string;
  amountOut: string;
  amountOutUSD: string;
  routeString: string;
  route: QuoteStep['quote']['route'];
  score: number;
  minAmountOutRaw: string;
  minAmountOut: string;
  minAmountOutUSD: string;
  slippage: string;
  estimatedTime: string;
  usdValueIn: string;
  usdDifference: string;
  tokenInPriceInTokenOut: string;
  tokenOutPriceInTokenIn: string;
  transfer_approval_fees_usd: string;
  gasFeesUSD: string;
  steps: QuoteStep[];
}

export async function fetchCrossChainQuote({
  amount,
  tokenIn,
  tokenOut,
}: {
  tokenIn: IcpToken | EvmToken;
  tokenOut: IcpToken | EvmToken;
  amount: string;
}): Promise<Response<CrossChainQuote | undefined>> {
  // Validate inputs
  const tokenA =
    tokenIn.chain_type === 'EVM' ? tokenIn.contractAddress?.toLowerCase() : tokenIn.canisterId;
  const tokenB =
    tokenOut.chain_type === 'EVM' ? tokenOut.contractAddress?.toLowerCase() : tokenOut.canisterId;
  if (!tokenA || !tokenB) {
    return {
      success: false,
      message: 'Invalid tokenIn or tokenOut: missing contractAddress or canisterId',
      result: undefined,
    };
  }

  const bn10 = new BigNumber(10);
  const feeIn = tokenIn.fee || '0';
  const feeOut = tokenOut.fee || '0';
  const decimalsIn = tokenIn.decimals || 18;
  const decimalsOut = tokenOut.decimals || 18;

  const feeInDec = new BigNumber(feeIn).dividedBy(bn10.pow(decimalsIn));
  const feeOutDec = new BigNumber(feeOut).dividedBy(bn10.pow(decimalsOut));

  const transfer_approval_fees_usd = feeInDec
    .multipliedBy(2)
    .multipliedBy(tokenIn.usdPrice || '0')
    .plus(feeOutDec.multipliedBy(tokenOut.usdPrice || '0'))
    .toFixed(2);

  const approvalAmount = new BigNumber(amount)
    .multipliedBy(bn10.pow(decimalsIn))
    .minus(new BigNumber(feeIn))
    .toFixed(0);

  const amountInRawForApi = new BigNumber(amount).multipliedBy(bn10.pow(decimalsIn)).toFixed(0);
  const chainA = tokenIn.chainId === 0 ? 'icp' : tokenIn.chainId;
  const chainB = tokenOut.chainId === 0 ? 'icp' : tokenOut.chainId;

  try {
    const response = await axios.get<CrossChainQuoteResponse>(
      'https://quoter.appicdao.com/api/quote/cross-chain',
      {
        params: {
          tokenA,
          chainA,
          tokenB,
          chainB,
          amount: amountInRawForApi,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    );

    if (response.data.success === true) {
      const data = response.data.data;

      // Adjust totalAmountOut and totalMinAmountOut for output fee
      let adjustedTotalAmountOut = new BigNumber(data.totalAmountOut).minus(new BigNumber(feeOut));
      let adjustedTotalMinAmountOut = new BigNumber(data.totalMinAmountOut).minus(
        new BigNumber(feeOut),
      );
      adjustedTotalAmountOut = adjustedTotalAmountOut.lt(0)
        ? new BigNumber(0)
        : adjustedTotalAmountOut;
      adjustedTotalMinAmountOut = adjustedTotalMinAmountOut.lt(0)
        ? new BigNumber(0)
        : adjustedTotalMinAmountOut;

      // Calculate decimal-adjusted amounts
      const amountInDec = new BigNumber(data.totalAmountIn).div(bn10.pow(decimalsIn));
      const amountOutDec = adjustedTotalAmountOut.div(bn10.pow(decimalsOut));
      const minAmountOutDec = adjustedTotalMinAmountOut.div(bn10.pow(decimalsOut));

      // Transform routeString by joining steps
      const routeString = `${tokenIn.symbol} \u2192 ${tokenOut.symbol}`;

      // Calculate prices
      const tokenInPriceInTokenOut = amountOutDec.isZero()
        ? '0'
        : amountOutDec.div(amountInDec).toFixed(6);
      const tokenOutPriceInTokenIn = amountOutDec.isZero()
        ? '0'
        : amountInDec.div(amountOutDec).toFixed(6);

      // Calculate USD values
      const usdValueIn = amountInDec.multipliedBy(tokenIn.usdPrice || '0').toFixed(2);
      const usdValueOut = amountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
      const usdValueMinOut = minAmountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
      const usdDifference = new BigNumber(usdValueOut).minus(usdValueIn).toFixed(2);

      // Calculate average score from steps
      let totalScore = 0;
      data.steps.forEach((step) => {
        if (step.quote.score) totalScore += step.quote.score;
      });
      const averageScore = data.steps.length > 0 ? totalScore / data.steps.length : 0;

      // Flatten routes from all steps
      const overallRoute = data.steps.flatMap((step) => step.quote.route);

      // Calculate total gas fees in USD from steps
      let totalGasUSD = new BigNumber(0);
      data.steps.forEach((step) => {
        if (step.quote.rawGasEstimateUSD) {
          totalGasUSD = totalGasUSD.plus(step.quote.rawGasEstimateUSD);
        }
        if (step.quote.canisterFee) {
          totalGasUSD = totalGasUSD.plus(step.quote.canisterFee);
        }
      });
      const gasFeesUSD = totalGasUSD.toFixed(2);

      // Combine token fees and gas fees for total fees
      const totalFeesUSD = new BigNumber(transfer_approval_fees_usd).plus(totalGasUSD).toFixed(2);

      // Map to CrossChainQuote
      const quote: CrossChainQuote = {
        protocol: 'Appic',
        tokenIn,
        tokenOut,
        amountInRaw: data.totalAmountIn,
        amountOutRaw: adjustedTotalAmountOut.toString(),
        amountIn: amountInDec.toFixed(),
        approvalAmount,
        amountOut: amountOutDec.toFixed(),
        amountOutUSD: usdValueOut,
        routeString,
        route: overallRoute,
        score: averageScore,
        minAmountOutRaw: adjustedTotalMinAmountOut.toString(),
        minAmountOut: minAmountOutDec.toFixed(),
        minAmountOutUSD: usdValueMinOut,
        slippage: data.totalSlippage,
        estimatedTime: '30s to 2m',
        usdValueIn,
        usdDifference,
        tokenInPriceInTokenOut,
        tokenOutPriceInTokenIn,
        transfer_approval_fees_usd: totalFeesUSD,
        gasFeesUSD,
        steps: data.steps,
      };

      return { result: quote, message: '', success: true };
    } else {
      return {
        success: false,
        message: `API error: ${JSON.stringify(response.data.data)}`,
        result: undefined,
      };
    }
  } catch (error: any) {
    console.error('Error fetching crosschain quote:', error.message, error.response?.data);
    return {
      success: false,
      message: `Request failed: ${error.message}`,
      result: undefined,
    };
  }
}
