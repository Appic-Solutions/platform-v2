import { Response } from '@/blockchain_api/types/response';

import { BigNumber } from 'bignumber.js';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { createPublicClient, createWalletClient, custom, http, WalletClient } from 'viem';
import { NATIVE_TOKEN_ADDRESS } from '../icp/get_bridge_options';
import { check_allowance } from '../evm/check_allowance';
import { encode_approval_function_data, encode_execute_swap_function_data } from '@/blockchain_api/abi/abi_encoder';
import type { Address } from 'viem';
import { SameChainQuote } from '@/blockchain_api/quoter/same-chain';
import { convertAddressToBytes32, create_wallet_client } from './crosschain';


// step 1
// for swapping first we need to approve the token in spending
export async function same_chain_approve_token_in(
	quote: SameChainQuote,
): Promise<Response<string>> {
	// evm approval
	let wallet_client = await create_wallet_client(quote.tokenIn.chainId);

	if (quote.tokenIn.contractAddress?.toLowerCase() == NATIVE_TOKEN_ADDRESS) {
		return {
			result: "",
			success: true,
			message: '',
		};
	} else {
		try {
			const [account] = await wallet_client.getAddresses();

			// Check if there is enough allowance
			const allowance = await check_allowance(
				quote.tokenIn.contractAddress as `0x${string}`,
				account as `0x${string}`,
				quote.swapContractAddress as `0x${string}`,
				quote.viemChain!,
				quote.rpcURl!,
			);


			if (new BigNumber(allowance).isGreaterThanOrEqualTo(quote.approvalAmount)) {
				console.log(allowance, "allowance passed");

				return {
					result: "",
					success: true,
					message: '',
				};
			}

			const encoded_function_data = encode_approval_function_data(
				quote.swapContractAddress as `0x${string}`,
				quote.approvalAmount,
			);

			const public_client = createPublicClient({
				transport: http(quote.rpcURl),
				chain: quote.viemChain,
			});

			const prepared_transaction = await wallet_client.prepareTransactionRequest({
				chain: quote.viemChain,
				account: account as `0x${string}`,
				to: quote.tokenIn.contractAddress as `0x${string}`,
				data: encoded_function_data as `0x${string}`,
				maxFeePerGas: BigInt(quote.nativeTokenFees?.maxFeePerGas!),
				maxPriorityFeePerGas: BigInt(quote.nativeTokenFees?.maxPriorityFeePerGas!),
				gas: BigInt(quote.nativeTokenFees?.approvalGasLimit!),
				type: 'eip1559',
			});

			const hash = await wallet_client.sendTransaction({
				account: account,
				...prepared_transaction,
			});


			const tx_status = await public_client.waitForTransactionReceipt({
				hash,
				confirmations: 1,
			});

			if (tx_status.status == 'success') {
				return {
					result: hash,
					message: '',
					success: true,
				};
			} else {
				return {
					result: hash,
					message: '',
					success: false,
				};
			}
		} catch (error) {
			console.log(error);

			return {
				result: "",
				message: `Failed to get erc20 approval ${error}`,
				success: false,
			};
		}
	}


}

// step 2 execute the swap
// return tx hash or swapTxId
export async function same_chain_swap(
	quote: SameChainQuote,
	evm_address: string,
): Promise<Response<string>> {



	try {



		let wallet_client = await create_wallet_client(quote.tokenIn.chainId);

		const [account] = await wallet_client.getAddresses();


		let recipient = convertAddressToBytes32(evm_address as Address);

		let encoded_swap_function_data = encode_execute_swap_function_data(
			quote.qswapData?.commands!.map(command => BigInt(command))!,
			quote.qswapData?.commandData!,
			quote.tokenIn.contractAddress as Address,
			BigInt(quote.amountInRaw),
			BigInt(quote.minAmountOutRaw),
			BigInt(quote.qswapData?.deadline!),
			"0x",
			recipient,
			false
		);

		const public_client = createPublicClient({
			transport: http(quote.rpcURl),
			chain: quote.viemChain,
		});

		console.log(quote.viemChain);


		let value = quote.tokenIn.contractAddress == NATIVE_TOKEN_ADDRESS ? BigInt(quote.amountInRaw) : BigInt(0);

		const prepared_transaction = await wallet_client.prepareTransactionRequest({
			chain: quote.viemChain,
			account: account as `0x${string}`,
			to: quote.swapContractAddress as `0x${string}`,
			data: encoded_swap_function_data as `0x${string}`,
			maxFeePerGas: BigInt(quote.nativeTokenFees?.maxFeePerGas!),
			maxPriorityFeePerGas: BigInt(quote.nativeTokenFees?.maxPriorityFeePerGas!),
			gas: BigInt(quote.nativeTokenFees?.swapGasLimit!),
			type: 'eip1559',
			value
		});

		const hash = await wallet_client.sendTransaction({
			account: account,
			...prepared_transaction,
		});


		const tx_status = await public_client.waitForTransactionReceipt({
			hash,
			confirmations: 1,
		});

		if (tx_status.status == 'success') {
			return {
				result: hash,
				message: '',
				success: true,
			};
		} else {
			return {
				result: "Failed to send tx to the network",
				message: '',
				success: false,
			};
		}

	} catch (error) {
		console.log(error);
		return {
			message: `Failed to send swap transaction: ${error}`,
			result: "",
			success: false,
		};
	}

}







