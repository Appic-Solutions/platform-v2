import axios from 'axios';
import { Response } from '@/blockchain_api/types/response';
import { EvmToken } from '../../types/tokens';
import { get_evm_token_price } from '../evm/get_tokens_price';

// Define the API response token interface
export interface ApiEvmToken {
	chainId: string;
	erc20ContractAddress: string;
	name: string;
	decimals: number;
	symbol: string;
	logo: string;
	isWrappedIcrc: boolean;
	cmcId?: number;
	usdPrice?: string;
	volumeUsd24h?: string;
}

export const get_top_evm_tokens = async (): Promise<Response<EvmToken[]>> => {
	try {
		const response = await axios.get<{ data: { [chainId: string]: ApiEvmToken[] } }>('https://api.appicdao.com/tokens/evm/top-100');
		const topEvmTokensPerChain = response.data.data;
		const allTokens = Object.values(topEvmTokensPerChain).flat();
		const transformedTokens = await parseTopTokens(allTokens);
		return {
			result: transformedTokens,
			message: '',
			success: true,
		};
	} catch (error) {
		return {
			result: [],
			success: false,
			message: `Error fetching top 100 EVM tokens: ${error}`,
		};
	}
};

async function parseTopTokens(response: ApiEvmToken[]): Promise<EvmToken[]> {
	try {

		const tokensMap = new Map<string, EvmToken>();
		// Collect all price fetch promises
		const pricePromises = response.map(async (evmToken: ApiEvmToken) => {
			const parsedChainId: number = parseInt(evmToken.chainId, 10);
			const usdPrice =
				evmToken.usdPrice !== undefined && evmToken.usdPrice !== null
					? { result: evmToken.usdPrice, message: '', success: true }
					: await get_evm_token_price(evmToken.erc20ContractAddress, parsedChainId);
			return {
				evmToken,
				chainId: parsedChainId,
				usdPrice,
			};
		});
		// Execute all price fetches in parallel
		const priceResults = await Promise.all(pricePromises);
		// Process tokens with their fetched prices
		for (const { evmToken, chainId, usdPrice } of priceResults) {
			const evmKey = `${evmToken.erc20ContractAddress}-${evmToken.chainId}`;
			// Default operator to 'Appic' since no bridge pair or operator is provided
			const operator = 'Appic';
			try {
				const finalUsdPrice = usdPrice.result;
				// Parse EVM token
				if (!tokensMap.has(evmKey)) {
					tokensMap.set(evmKey, {
						name: evmToken.name,
						symbol: evmToken.symbol,
						logo: evmToken.logo,
						decimals: evmToken.decimals,
						chainId,
						contractAddress: evmToken.erc20ContractAddress,
						chain_type: 'EVM',
						operator,
						bridgePairs: [],
						is_wrapped_icrc: evmToken.isWrappedIcrc,
						usdPrice: finalUsdPrice,
					});
				}
			} catch (error) {
				console.error(`Error processing token ${evmKey}: ${error}`);
				continue;
			}
		}
		return Array.from(tokensMap.values()).sort((a, b) => {
			if (a.operator === 'Appic' && b.operator !== 'Appic') {
				return -1;
			}
			if (a.operator !== 'Appic' && b.operator === 'Appic') {
				return 1;
			}
			return 0;
		});

	} catch (error) {
		console.log(error);
		throw error;
	}

}
