import axios from 'axios';
import { Response } from '../types/response';
import { EvmToken } from '../types/tokens';
import { QswapData, Route } from "./quote_types";
import BigNumber from 'bignumber.js';
import { NativeTokenFees } from './cross-chain';
import { Chain as ViemChain } from 'viem/chains';
import { chains } from '../lists/chains';
import { estimate_approval_fee, estimate_gas_fee, get_gas_price, NATIVE_TOKEN_ADDRESS } from '../functions/icp/get_bridge_options';



interface SameChainQuoteData {
	bestRoute: {
		protocol: string;
		chain: string;
		tokenIn: string;
		tokenOut: string;
		amountIn: string;
		amountOut: string;
		executionPrice: string;
		route: Route[];
		path: string[];
		score: number;
		gasLimit: string;
		gasLimitUnit: string;
		maxGasFee: string;
		maxGasFeeUnit: string;
		minAmountOut: string;
		slippage: string;
		estimatedTime: string;
		isICP: boolean;
		qswapData: QswapData;
		gasPriceUSD: string;
	};
	alternativeRoutes: [];
	encodedData: string;
	summary: {
		totalRoutes: number;
		evmRoutes: number;
		icpRoutes: number;
		bestChain: string;
		searchTime: string;
	};
}

interface SameChainQuoteResponse {
	success: boolean;
	data: SameChainQuoteData;
}

export interface SameChainQuote {
	protocol: string;
	tokenIn: EvmToken;
	tokenOut: EvmToken;
	amountInRaw: string;
	amountOutRaw: string;
	amountIn: string;
	approvalAmount: string;
	amountOut: string;
	amountOutUSD: string;
	routeString: string;
	qswapData:QswapData;

	// native token fees
	nativeTokenFees: NativeTokenFees;

	// rpc data in
	viemChain: ViemChain | undefined,
	rpcURl: string | undefined,
	swapContractAddress: string | undefined;



	route: Route[];
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
}

export async function fetchSameChainQuote({
	amount,
	tokenIn,
	tokenOut,
	nativeToken
}: {
	tokenIn: EvmToken;
	tokenOut: EvmToken;
	amount: string;
	nativeToken: EvmToken
}): Promise<Response<SameChainQuote | undefined>> {
	if (!tokenIn || !tokenOut) {
		return {
			success: false,
			message: 'Invalid tokenIn or tokenOut: tokens are undefined',
			result: undefined,
		};
	}
	const tokenInAddress = tokenIn.contractAddress?.toLowerCase();
	const tokenOutAddress = tokenOut.contractAddress?.toLowerCase();

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

	const chainId = Number(tokenIn.chainId);

	try {
		const response = await axios.get<SameChainQuoteResponse>(
			'https://quoter.appicdao.com/api/quote',
			{
				params: {
					tokenIn: tokenInAddress,
					tokenOut: tokenOutAddress,
					amountIn: amountInRawForApi,
					chainId,
					includeICP: false,
					preferICP: false,
				},
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			},
		);

		if (response.data.success === true) {
			const data = response.data.data;
			const bestRoute = data.bestRoute;

			// Adjust amountOut and minAmountOut for output fee
			let adjustedAmountOut = new BigNumber(bestRoute.amountOut).minus(new BigNumber(feeOut));
			let adjustedMinAmountOut = new BigNumber(bestRoute.minAmountOut).minus(new BigNumber(feeOut));
			adjustedAmountOut = adjustedAmountOut.lt(0) ? new BigNumber(0) : adjustedAmountOut;
			adjustedMinAmountOut = adjustedMinAmountOut.lt(0) ? new BigNumber(0) : adjustedMinAmountOut;

			// Calculate decimal-adjusted amounts
			const amountInDec = new BigNumber(bestRoute.amountIn).div(bn10.pow(decimalsIn));
			const amountOutDec = adjustedAmountOut.div(bn10.pow(decimalsOut));
			const minAmountOutDec = adjustedMinAmountOut.div(bn10.pow(decimalsOut));

			const routeString = `${tokenIn.symbol} \u2192 ${tokenOut.symbol}`;

			const tokenInPriceInTokenOut = amountOutDec.isZero()
				? '0'
				: amountOutDec.div(amountInDec).toFixed(6);
			const tokenOutPriceInTokenIn = amountOutDec.isZero()
				? '0'
				: amountInDec.div(amountOutDec).toFixed(6);

			let nativeTokenFees: NativeTokenFees;

			let chainConfig = chains.find(chain => chain.chainId == chainId)!;
			let viemChain = chainConfig.viem_config!;
			let rpcURl = chainConfig.rpc_url;

			let { max_fee_per_gas, max_priority_fee_per_gas } = await get_gas_price(viemChain, chainConfig.rpc_url);
			let gas_limit = BigNumber(data.bestRoute.gasLimit!).toFixed();
			let { approval_gas, total_approval_fee } = estimate_approval_fee(max_fee_per_gas, tokenIn.contractAddress.toLowerCase() == NATIVE_TOKEN_ADDRESS.toLowerCase());
			let { total_gas_fee } = estimate_gas_fee(max_fee_per_gas, gas_limit);

			let total_native_token_fee = BigNumber(total_approval_fee).plus(total_gas_fee).toFixed();
			let human_readable_native_token_fee = BigNumber(total_native_token_fee).div(BigNumber(10).pow(18)).toFixed();

			nativeTokenFees = {
				approvalFeeInNativeToken: total_approval_fee,
				approvalGasLimit: approval_gas,

				networkFeeInNativeToken: total_gas_fee,
				swapGasLimit: gas_limit,

				totalNativeTokenfee: total_native_token_fee,
				humanReadableTotalNativeFee: human_readable_native_token_fee,
				totalNativeFeeUSD: BigNumber(nativeToken?.usdPrice!).multipliedBy(human_readable_native_token_fee).toFixed(),

				maxPriorityFeePerGas: max_priority_fee_per_gas,
				maxFeePerGas: max_fee_per_gas,

			} as NativeTokenFees;


			const usdValueIn = amountInDec.multipliedBy(tokenIn.usdPrice || '0').toFixed(2);
			const usdValueOut = amountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
			const usdValueMinOut = minAmountOutDec.multipliedBy(tokenOut.usdPrice || '0').toFixed(2);
			const usdDifference = new BigNumber(usdValueOut).minus(usdValueIn).toFixed(2);
			const gasFeesUSD = new BigNumber(nativeTokenFees.totalNativeFeeUSD || '0').toFixed(2);
			const totalFeesUSD = new BigNumber(transfer_approval_fees_usd).plus(gasFeesUSD).toFixed(2);

			const quote: SameChainQuote = {
				protocol: bestRoute.protocol,
				tokenIn,
				tokenOut,
				amountInRaw: bestRoute.amountIn,
				amountOutRaw: adjustedAmountOut.toString(),
				amountIn: amountInDec.toFixed(),
				approvalAmount,
				amountOut: amountOutDec.toFixed(),
				amountOutUSD: usdValueOut,
				routeString,
				qswapData:bestRoute.qswapData,

				nativeTokenFees,
				viemChain,
				rpcURl,
				swapContractAddress: chainConfig?.swap_contract_address,


				route: bestRoute.route,
				score: bestRoute.score,
				minAmountOutRaw: adjustedMinAmountOut.toString(),
				minAmountOut: minAmountOutDec.toFixed(),
				minAmountOutUSD: usdValueMinOut,
				slippage: bestRoute.slippage,
				estimatedTime: `${Number(bestRoute.estimatedTime) / 1000}s`,
				usdValueIn,
				usdDifference,
				tokenInPriceInTokenOut,
				tokenOutPriceInTokenIn,
				transfer_approval_fees_usd: totalFeesUSD,
				gasFeesUSD,
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
		console.error('Error fetching same-chain quote:', error.message, error.response?.data);
		return {
			success: false,
			message: `Request failed: ${error.message}`,
			result: undefined,
		};
	}
}
