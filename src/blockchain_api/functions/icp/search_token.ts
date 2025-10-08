import { MetadataValue } from '@/blockchain_api/did/ledger/icrc_types';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import { Response } from '@/blockchain_api/types/response';



// Service function to fetch metadata and create IcpToken
export async function createIcpTokenFromCanister(canisterId: string, unAuthenticated_agent: HttpAgent): Promise<Response<IcpToken | null>> {
	try {
		const tokenActor = Actor.createActor(IcrcIdlFactory, {
			agent: unAuthenticated_agent,
			canisterId: Principal.fromText(canisterId),
		});

		// Fetch metadata
		const metadata: Array<[string, MetadataValue]> = await tokenActor.icrc1_metadata() as Array<[string, MetadataValue]>;

		// Parse metadata into a map for easy access
		const metadataMap: Map<string, MetadataValue> = new Map(metadata);

		// Extract required fields
		const nameValue = metadataMap.get('icrc1:name');
		const symbolValue = metadataMap.get('icrc1:symbol');
		const logoValue = metadataMap.get('icrc1:logo');
		const decimalsValue = metadataMap.get('icrc1:decimals');
		const feeValue = metadataMap.get('icrc1:fee');

		// Validate required fields
		if (
			!nameValue ||
			!('Text' in nameValue) ||
			!symbolValue ||
			!('Text' in symbolValue) ||
			!logoValue ||
			!('Text' in logoValue) ||
			!decimalsValue ||
			!('Nat' in decimalsValue) ||
			!feeValue ||
			!('Nat' in feeValue)
		) {
			console.error('Missing or invalid metadata fields');
			return { result: null, message: "Failed to find token with canister id", success: false };
		}

		// Construct IcpToken
		const token: IcpToken = {
			name: nameValue.Text,
			symbol: symbolValue.Text,
			logo: logoValue.Text, // Assuming it's a data URL like "data:image/png;base64,..."
			usdPrice: '0', // Placeholder; fetch from oracle or set as needed
			decimals: Number(decimalsValue.Nat),
			chainId: 0, // ICP chainId is 0
			chain_type: 'ICP',
			canisterId,
			fee: feeValue.Nat.toString(),
			tokenType: 'ICRC1', // Assuming ICRC1; adjust if needed
			rank: undefined, // As per the type
			operator: 'Dfinity', // Assuming for ICP tokens,
			listed_on_appic_dex:false,
		};

		return { result: token, message: "", success: true };
	} catch (error) {
		console.error('Error fetching token metadata:', error);
		return { result: null, message: "Failed to find token with canister id", success: false };
	}
}





// export async function()
