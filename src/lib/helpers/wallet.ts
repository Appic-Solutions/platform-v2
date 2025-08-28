import { HttpAgent } from '@dfinity/agent';
import { getStorageItem } from './localstorage';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';
import { Principal } from '@dfinity/principal';

export const fetchIcpBalances = async ({
	unAuthenticatedAgent,
	principal,
	top_tokens,
}: {
	unAuthenticatedAgent: HttpAgent | null;
	principal: Principal | null;
	top_tokens: boolean;
}) => {
	try {
		if (unAuthenticatedAgent && principal) {
			const all_tokens = getStorageItem('icpTokens');
			const icp_balance = await get_icp_wallet_tokens_balances(
				principal.toString(),
				JSON.parse(all_tokens || '[]'),
				top_tokens,
				unAuthenticatedAgent,
			).then((res) => res.result);
			console.log(icp_balance);
			return icp_balance;
		}
	} catch (error) {
		console.log('Get ICP Balance Error => ', error);
	}
};

export const fetchEvmBalances = async ({ evmAddress }: { evmAddress: string | undefined }) => {
	try {
		if (evmAddress) {
			const bridge_pairs = getStorageItem('bridge-pairs');
			const evm_balance = await get_evm_wallet_tokens_balances(
				evmAddress,
				JSON.parse(bridge_pairs || '[]'),
			).then((res) => res.result);
			return evm_balance;
		}
	} catch (error) {
		console.log('Get EVM Balance Error => ', error);
	}
};
