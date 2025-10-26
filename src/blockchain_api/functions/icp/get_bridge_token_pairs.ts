import axios from 'axios';
import { Response } from '@/blockchain_api/types/response';
import BigNumber from 'bignumber.js';
import { EvmToken, IcpToken, Operator } from '../../types/tokens';
import { get_evm_token_price } from '../evm/get_tokens_price';
import {
	IcpTokenType,
} from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { HttpAgent } from '@dfinity/agent';

// Define the API response types
export interface ApiTokenPair {
	evmToken: ApiEvmToken;
	icpToken: ApiIcpToken;
	operator: ApiOperator;
}
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
export interface ApiIcpToken {
	ledgerId: string;
	name: string;
	decimals: number;
	symbol: string;
	usdPrice: string;
	logo: string;
	fee: string;
	tokenType: IcpTokenType;
	rank?: number;
	listedOnAppicDex?: boolean;
}
export enum ApiOperator {
	DfinityCkEthMinter = 'DfinityCkEthMinter',
	AppicMinter = 'AppicMinter',
}

export const get_bridge_pairs = async (unAuthenticatedAgent: HttpAgent): Promise<Response<Array<EvmToken | IcpToken>>> => {
	try {
		const response = await axios.get<{ data: ApiTokenPair[] }>('https://api.appicdao.com/bridge-pairs');
		const bridge_pairs = response.data.data;
		const transformed_bridge_pairs = await parseBridgePairs(bridge_pairs);
		return {
			result: transformed_bridge_pairs,
			message: '',
			success: true,
		};
		// error handling
	} catch (error) {
		return {
			result: [],
			success: false,
			message: `error fetching bridge pairs ${error}`,
		};
	}
};

export const get_bridge_pairs_for_token = (
	bridge_tokens: (EvmToken | IcpToken)[],
	token_id: string,
	base_chain_id: number,
	selected_chain_id: number,
): (EvmToken | IcpToken)[] => {
	// Find the base token by matching `token_id` with `canisterId` or `contractAddress`
	const base_token = bridge_tokens.find(
		(token) =>
			token.chainId == base_chain_id &&
			(token.canisterId === token_id || token.contractAddress === token_id),
	);
	if (!base_token?.bridgePairs) {
		return []; // Early exit if no base token or bridge pairs exist
	}
	// Filter bridge pairs for the specified chain_id
	const pairs = base_token.bridgePairs.filter((pair) => pair.chain_id === selected_chain_id);
	// Map over pairs and gather matching tokens efficiently
	const filtered_token_pairs = pairs.flatMap((pair) =>
		bridge_tokens.filter(
			(token) =>
				token.chainId == selected_chain_id &&
				(token.canisterId === pair.contract_or_canister_id ||
					token.contractAddress === pair.contract_or_canister_id),
		),
	);
	return filtered_token_pairs;
};

export function parseOperator(operator: ApiOperator): Operator {
	if (operator === ApiOperator.AppicMinter) {
		return 'Appic';
	} else if (operator === ApiOperator.DfinityCkEthMinter) {
		return 'Dfinity';
	}
	throw new Error('Unknown operator');
}

async function parseBridgePairs(response: ApiTokenPair[]): Promise<Array<EvmToken | IcpToken>> {
	try {

		const tokensMap = new Map<string, EvmToken | IcpToken>();
		// Collect all price fetch promises
		const pricePromises = response.map(async (pair) => {
			const { evmToken, icpToken } = pair;
			const parsed_chain_id: number = Number(evmToken.chainId);
			if (evmToken.isWrappedIcrc) {
				return {
					pair,
					usdPrice: { result: icpToken.usdPrice, success: true, message: "" }
				}
			} else {
				let usdPriceResponse = evmToken.usdPrice ?
					{ result: evmToken.usdPrice, message: "", success: true } :
					await get_evm_token_price(evmToken.erc20ContractAddress, parsed_chain_id);
				return {
					pair,
					usdPrice: usdPriceResponse
				}
			}
		});
		// Execute all price fetches in parallel
		const priceResults = await Promise.all(pricePromises);
		// Process pairs with their fetched prices
		for (const { pair, usdPrice } of priceResults) {
			const { operator, evmToken, icpToken } = pair;
			console.log(evmToken, icpToken);
			const parsedOperator = parseOperator(operator);
			const evmKey = `${evmToken.erc20ContractAddress}-${evmToken.chainId}`;
			console.log(evmKey);
			const icpKey = icpToken.ledgerId;
			const parsed_chain_id: number = Number(evmToken.chainId);
			try {
				const final_usd_price = usdPrice.result === "0" ? icpToken.usdPrice : usdPrice.result;
				// Parse EVM token
				if (!tokensMap.has(evmKey)) {
					tokensMap.set(evmKey, {
						name: evmToken.name,
						symbol: evmToken.symbol,
						logo: evmToken.logo,
						decimals: evmToken.decimals,
						chainId: parsed_chain_id,
						contractAddress: evmToken.erc20ContractAddress,
						chain_type: 'EVM',
						operator: parsedOperator,
						bridgePairs: [],
						is_wrapped_icrc: evmToken.isWrappedIcrc,
						usdPrice: final_usd_price,
					});
				}
				// Parse ICP token
				if (!tokensMap.has(icpKey)) {
					tokensMap.set(icpKey, {
						name: icpToken.name,
						symbol: icpToken.symbol,
						logo: icpToken.logo,
						decimals: icpToken.decimals,
						chainId: 0,
						canisterId: icpToken.ledgerId,
						fee: new BigNumber(icpToken.fee).toString(),
						tokenType: "ICRC2",
						chain_type: 'ICP',
						operator: parsedOperator,
						bridgePairs: [],
						usdPrice: final_usd_price,
						rank: 1,
						listed_on_appic_dex: icpToken.listedOnAppicDex ?? false
					});
				}
				// Add bridge pair information
				const evmTokenObj = tokensMap.get(evmKey) as EvmToken;
				const icpTokenObj = tokensMap.get(icpKey) as IcpToken;
				evmTokenObj.bridgePairs!.push({
					contract_or_canister_id: icpTokenObj.canisterId!,
					chain_id: icpTokenObj.chainId,
				});
				icpTokenObj.bridgePairs!.push({
					contract_or_canister_id: evmTokenObj.contractAddress,
					chain_id: evmTokenObj.chainId,
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
		// Return unique tokens as an array
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
		console.log("Failed to transform bridge pairs:", error);
		throw "";
	}

}


