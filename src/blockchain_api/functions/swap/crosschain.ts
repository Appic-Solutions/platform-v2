import { Principal } from '@dfinity/principal';
import { HttpAgent, Agent, Actor } from '@dfinity/agent';
import { idlFactory as IcrcIdlFactory } from '@/blockchain_api/did/ledger/icrc.did';
import {
	Account,
	ApproveArgs,
	Result_2 as ApprvalResult,
	Allowance,
	AllowanceArgs,
} from '@/blockchain_api/did/ledger/icrc_types';
import { appic_dex } from '@/canister_ids.json';
import { Response } from '@/blockchain_api/types/response';
import { Result_3 as CrossChainSwapResult, CrosschainSwapArgs } from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { BigNumber } from 'bignumber.js';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { createPublicClient, createWalletClient, custom, http, WalletClient } from 'viem';
import { NATIVE_TOKEN_ADDRESS } from '../icp/get_bridge_options';
import { check_allowance } from '../evm/check_allowance';
import { encode_approval_function_data, encode_execute_swap_function_data } from '@/blockchain_api/abi/abi_encoder';
import { padHex } from 'viem';
import type { Address, Hex } from 'viem';
import { principal_to_bytes32 } from '../icp/utils/principal_to_hex';
import { idlFactory as AppicMinterIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import {
	Result as LogScrapingResult,
} from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';


// in case the swap is usdc already and there is no swap needed
const UNLIMITED_DEADLINE = 2388441600;



// step 1
// for swapping first we need to approve the token in spending
export async function cross_chain_approve_token_in(
	quote: CrossChainQuote,
	authenticated_agent: Agent | undefined, // HttpAgent , Agent
	unauthenticated_agent: HttpAgent,
): Promise<Response<string>> {
	// evm approval
	if (quote.tokenIn.chain_type == "EVM") {
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

				let estimated_gas = await public_client.estimateGas({
					account: account as `0x${string}`,
					to: quote.tokenIn.contractAddress as `0x${string}`,
					data: encoded_function_data as `0x${string}`,
					type: "eip1559"
				});

				console.log("estimated_gas:", estimated_gas);



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
	else {
		// Icp approval
		// approval tx
		const token_in_actor = Actor.createActor(IcrcIdlFactory, {
			agent: authenticated_agent,
			canisterId: Principal.fromText(quote.tokenIn.canisterId!),
		});



		const token_in_actor_unauthenticated = Actor.createActor(IcrcIdlFactory, {
			agent: unauthenticated_agent,
			canisterId: Principal.fromText(quote.tokenIn.canisterId!),
		});

		try {
			const sender_principal = await authenticated_agent!.getPrincipal();

			// Check the allowances
			const token_in_allowance = (await token_in_actor_unauthenticated.icrc2_allowance({
				account: {
					owner: sender_principal,
					subaccount: [],
				},
				spender: { owner: Principal.fromText(appic_dex), subaccount: [] },
			} as AllowanceArgs)) as Allowance;

			// Check if  appic dex alread has enough allowance
			//
			// token0
			if (
				BigNumber(token_in_allowance.allowance.toString()).isLessThan(BigNumber(quote.approvalAmount))
			) {
				// In case of Native withdrawal
				const token_in_approval_result = (await token_in_actor.icrc2_approve({
					amount: BigInt(new BigNumber(quote.approvalAmount).toString()),
					created_at_time: [],
					expected_allowance: [],
					expires_at: [],
					fee: [],
					from_subaccount: [],
					memo: [],
					spender: { owner: Principal.fromText(appic_dex), subaccount: [] } as Account,
				} as ApproveArgs)) as ApprvalResult;

				if ('Err' in token_in_approval_result) {
					console.log(token_in_approval_result.Err);
					return {
						result: "",
						success: false,
						message: `Failed to approve allowance:${token_in_approval_result.Err}`,
					};
				}
			}

			return {
				success: true,
				result: "",
				message: '',
			};
		} catch (error) {
			console.log(error);
			return {
				success: false,
				result: "",
				message: `Failed to approve token spendings, please try again later. ${error}`,
			};
		}

	}
}

// step 2 execute the swap
// return tx hash or swapTxId
export async function cross_chain_swap(
	quote: CrossChainQuote,
	authenticated_agent: Agent | undefined,
	unauthenticated_agent: HttpAgent,
	evm_address: string | undefined,
	principal_id: Principal | undefined
): Promise<Response<string>> {

	console.log(quote);
	console.log(evm_address, principal_id);
	let step1 = quote.steps[0].quote;

	console.log(step1);

	try {

		if (quote.tokenIn.chain_type == "EVM") {
			// starts from EVM


			let wallet_client = await create_wallet_client(quote.tokenIn.chainId);

			const [account] = await wallet_client.getAddresses();


			let recipient = typeof (evm_address) == "undefined" ? principal_to_bytes32(principal_id?.toText()!) : convertAddressToBytes32(evm_address as Address);

			let encoded_swap_function_data = encode_execute_swap_function_data(
				step1.qswapData?.commands.map(command => BigInt(command)) || [],
				step1.qswapData?.commandData || [],
				quote.tokenIn.contractAddress as Address,
				BigInt(step1.amountIn),
				BigInt(step1.minAmountOut),
				BigInt(step1.qswapData?.deadline || UNLIMITED_DEADLINE),
				quote.encodedData,
				recipient,
				true
			);

			let value = quote.tokenIn.contractAddress == NATIVE_TOKEN_ADDRESS ? BigInt(step1.amountIn) : BigInt(0);


			const public_client = createPublicClient({
				transport: http(quote.rpcURl),
				chain: quote.viemChain,
			});

			let estimated_gas = await public_client.estimateGas({
				account: account as `0x${string}`,
				to: quote.swapContractAddress as `0x${string}`,
				data: encoded_swap_function_data as `0x${string}`,
				value,
				type: "eip1559"
			});

			console.log("estimated_gas:", estimated_gas);


			let prepared_transaction = await wallet_client.prepareTransactionRequest({
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

			setTimeout(() => { }, 1_000);

			const nonce = await public_client.getTransactionCount({
				address: account,
				blockTag: "latest"
			});

			if (nonce != prepared_transaction.nonce) {
				prepared_transaction.nonce = nonce;
			}

			const hash = await wallet_client.sendTransaction({
				account: account,
				...prepared_transaction,
			});


			const tx_status = await public_client.waitForTransactionReceipt({
				hash,
				confirmations: 1,
			});

			if (tx_status.status == 'success') {
				// request log scrapping from the minter

				// Create an actor for the Appic minter
				const appic_minter_actor = Actor.createActor(AppicMinterIdlFactory, {
					canisterId: Principal.fromText(quote.minter_id!),
					agent: unauthenticated_agent,
				});

				// cause block numbers update every 3 seconds
				await new Promise(resolve => setTimeout(resolve, 3000));

				const log_scraping_request_result =
					(await appic_minter_actor.request_scraping_logs()) as LogScrapingResult;
				if ('Err' in log_scraping_request_result) {
					if ('CalledTooManyTimes' in log_scraping_request_result.Err) {
						setTimeout(async () => {
							await appic_minter_actor.request_scraping_logs();
						}, 5000);
					} else {
						setTimeout(async () => {
							await appic_minter_actor.request_scraping_logs();
						}, 5000)
					}
				}

				console.log(log_scraping_request_result);

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

		} else {
			// starts from ICP

			const dex_actor = Actor.createActor(idlFactory, {
				agent: authenticated_agent,
				canisterId: appic_dex,
			});

			let swap_result = (await dex_actor.cross_chain_swap({ encoded_swap_data: quote.encodedData, recipient: convertAddressToBytes32(evm_address as Address) } as CrosschainSwapArgs)) as CrossChainSwapResult;
			if ('Err' in swap_result) {
				console.log(swap_result.Err);
				return {
					message: `${swap_result.Err}`,
					result: "",
					success: false,
				};
			}
			return {
				message: '',
				result: `${swap_result.Ok}`,
				success: true,
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






/// step 3 check swap status should be called every 5 seconds
export async function check_swap_status(tx_id: string): Promise<Response<string>> {
	return {
		success: true,
		message: "",
		result: ""
	}
}




export const convertAddressToBytes32 = (address: Address): Hex => {
	return padHex(address, { size: 32 });
};



export const create_wallet_client = async (
	chain_id: number
): Promise<WalletClient<any>> => {
	const ethereum = (window as any).ethereum;

	if (!ethereum) {
		throw new Error('MetaMask is not installed or ethereum object is not available');
	}
	try {
		const walletClient = createWalletClient({
			transport: custom(ethereum!),
		});

		//await walletClient.addChain({ chain: bridge_option.viem_chain });

		await walletClient.switchChain({ id: chain_id });
		const addresses = await walletClient.requestAddresses();
		console.log(addresses);

		return walletClient;
	} catch (error) {
		console.log(error);

		throw error;
	}
};

