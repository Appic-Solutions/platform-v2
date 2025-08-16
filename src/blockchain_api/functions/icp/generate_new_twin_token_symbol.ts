import { chains } from '@/blockchain_api/lists/chains';
import { get_evm_token_price } from '../evm/get_tokens_price';
import BigNumber from 'bignumber.js';
import { CandidEvmToken } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';

export const generate_twin_token_symbol = async (evm_symbol: string, chain_id: number) => {
	const chain = chains.find((chain) => chain.chainId == chain_id)!;
	return `ic${evm_symbol.toUpperCase()}.${chain.twin_handle!}`;
};

export const generate_twin_token_transfer_fee = async (
	evm_token: CandidEvmToken,
): Promise<string> => {
	try {
		const price = new BigNumber(evm_token.usd_price[0] || "0");

		// Target fee in USD
		const targetFeeInUSD = new BigNumber(0.01);

		// Calculate the exact raw token amount
		const multiplier = new BigNumber(10).pow(evm_token.decimals);
		const exactRawFee = targetFeeInUSD.dividedBy(price).multipliedBy(multiplier);

		// Find the smallest "1 followed by zeros" greater than or equal to exactRawFee
		const exponent = Math.floor(Math.log10(exactRawFee.toNumber()));
		let closestFee = new BigNumber(10).pow(exponent); // Closest "1 followed by zeros"

		// Adjust if closestFee is smaller than exactRawFee
		if (closestFee.isLessThan(exactRawFee)) {
			closestFee = closestFee.multipliedBy(10); // Move to the next power of 10
		}

		return closestFee.toFixed();
	} catch (error) {
		throw 'Failed to get usd price' + error;
	}
};
