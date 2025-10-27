import axios from 'axios';
import { Response } from '@/blockchain_api/types/response';
// Appic helper types and did
import {
	IcpTokenType,
} from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import BigNumber from 'bignumber.js';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { ChainType } from '@/blockchain_api/types/chains';
import { HttpAgent } from '@dfinity/agent';

// Define the API response token interface
export interface ApiIcpToken {
	ledgerId: string;
	name: string;
	decimals: number;
	symbol: string;
	usdPrice: string;
	logo: string;
	fee: string; // Assuming Erc20TokenAmount is a string representation
	tokenType: IcpTokenType;
	rank?: number | null;
	listedOnAppicDex?: boolean | null;
}

// The flow is as follow
// 1: The validated tokens are fetched from the REST API (Appic helper makes sure that the token canister exists and validates their wasm module)
// 2: The response is transformed into icp token interface
// Step 1
// Get valid appic tokens
export const get_icp_tokens = async (unAuthenticatedAgent:HttpAgent): Promise<Response<IcpToken[]>> => {
	try {
		const response = await axios.get<{ data: ApiIcpToken[] }>('https://api.appicdao.com/tokens/icp');
		const validated_icp_tokens = response.data.data;
		return {
			result: transform_icp_tokens(validated_icp_tokens),
			success: true,
			message: '',
		};
		// Error handling
	} catch (error) {
		return {
			result: [],
			message: `Error fetching icp token list, ${error}`,
			success: false,
		};
	}
};
// Step 2.1 Helper function
// transform response into icp response
export const transform_icp_tokens = (icp_tokens: ApiIcpToken[]): IcpToken[] => {
	console.log("activated transform function");
	let mapped_tokens = icp_tokens
		// .filter((token) => token.rank !== undefined && token.rank <= 30) // Match by canisterId/address
		.map((token) => {
			return {
				name: token.name,
				symbol: token.symbol,
				logo: token.logo,
				usdPrice: token.usdPrice,
				decimals: token.decimals,
				chainId: 0, // Chain ID for ICP
				chain_type: "ICP" as ChainType, // Chain type is ICP
				canisterId: token.ledgerId,
				fee: new BigNumber(token.fee).toString(),
				tokenType: 'ICRC2',
				balance: undefined, // Optional, can be added later
				balanceRawInteger: undefined,
				usdBalance: undefined, // Optional, can be added later
				rank: token.rank ? token.rank : undefined,
				listed_on_appic_dex: token.listedOnAppicDex ?? false
			};
		});

	console.log("Mapped tokens", mapped_tokens);
	return mapped_tokens;
};

