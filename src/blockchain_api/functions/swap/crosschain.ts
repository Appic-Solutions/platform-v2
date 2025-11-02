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
import {
	Result_3 as CrossChainSwapResult,
	CrosschainSwapArgs,
	CrosschainSwapStatus,
} from '@/blockchain_api/did/appic/appic_dex/appic_dex_types';
import { idlFactory } from '@/blockchain_api/did/appic/appic_dex/appic_dex.did';
import { BigNumber } from 'bignumber.js';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	parseEventLogs,
	WalletClient,
} from 'viem';
import { NATIVE_TOKEN_ADDRESS } from '../icp/get_bridge_options';
import { check_allowance } from '../evm/check_allowance';
import {
	encode_approval_function_data,
	encode_execute_swap_function_data,
} from '@/blockchain_api/abi/abi_encoder';
import { padHex } from 'viem';
import type { Address, Hex } from 'viem';
import { principal_to_bytes32 } from '../icp/utils/principal_to_hex';
import { idlFactory as AppicMinterIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import { Result as LogScrapingResult } from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';
import swap_contract_abi from '../../abi/swap_contract.json';
import { TxStatusType } from '@/components/common/ui/toast/types';
import { Connector, getAccount, switchChain } from '@wagmi/core';
import { wagmiAdapter } from '@/lib/configs/wagmi';
import { chains } from '@/blockchain_api/lists/chains';

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
	if (quote.tokenIn.chain_type == 'EVM') {
		let wallet_client = await create_wallet_client(quote.tokenIn.chainId);

		if (quote.tokenIn.contractAddress?.toLowerCase() == NATIVE_TOKEN_ADDRESS) {
			return {
				result: '',
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
					quote.from_swapContractAddress as `0x${string}`,
					quote.from_viemChain!,
					quote.from_rpcURl!,
				);

				if (new BigNumber(allowance).isGreaterThanOrEqualTo(quote.approvalAmount)) {
					console.log(allowance, 'allowance passed');

					return {
						result: '',
						success: true,
						message: '',
					};
				}

				const encoded_function_data = encode_approval_function_data(
					quote.from_swapContractAddress as `0x${string}`,
					quote.approvalAmount,
				);

				const public_client = createPublicClient({
					transport: http(quote.from_rpcURl),
					chain: quote.from_viemChain,
				});

				let estimated_gas = await public_client.estimateGas({
					account: account as `0x${string}`,
					to: quote.tokenIn.contractAddress as `0x${string}`,
					data: encoded_function_data as `0x${string}`,
					type: 'eip1559',
				});

				console.log('estimated_gas:', estimated_gas);

				const prepared_transaction = await wallet_client.prepareTransactionRequest({
					chain: quote.from_viemChain,
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
					result: '',
					message: `Failed to get erc20 approval ${error}`,
					success: false,
				};
			}
		}
	} else {
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
				BigNumber(token_in_allowance.allowance.toString()).isLessThan(
					BigNumber(quote.approvalAmount),
				)
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
						result: '',
						success: false,
						message: `Failed to approve allowance:${token_in_approval_result.Err}`,
					};
				}
			}

			return {
				success: true,
				result: '',
				message: '',
			};
		} catch (error) {
			console.log(error);
			return {
				success: false,
				result: '',
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
	evm_address: string | undefined,
	principal_id: Principal | undefined,
): Promise<Response<string>> {
	console.log(quote);
	console.log(evm_address, principal_id);
	let step1 = quote.steps[0].quote;

	console.log(step1);

	try {
		if (quote.tokenIn.chain_type == 'EVM') {
			// starts from EVM

			let wallet_client = await create_wallet_client(quote.tokenIn.chainId);

			const [account] = await wallet_client.getAddresses();

			let recipient =
				typeof evm_address == 'undefined'
					? principal_to_bytes32(principal_id?.toText()!)
					: convertAddressToBytes32(evm_address as Address);

			let encoded_swap_function_data = encode_execute_swap_function_data(
				step1.qswapData?.commands.map((command) => BigInt(command)) || [],
				step1.qswapData?.commandData || [],
				quote.tokenIn.contractAddress as Address,
				BigInt(step1.amountIn),
				BigInt(step1.minAmountOut),
				BigInt(step1.qswapData?.deadline || UNLIMITED_DEADLINE),
				quote.encodedData,
				recipient,
				true,
			);

			let value =
				quote.tokenIn.contractAddress == NATIVE_TOKEN_ADDRESS ? BigInt(step1.amountIn) : BigInt(0);

			const public_client = createPublicClient({
				transport: http(quote.from_rpcURl),
				chain: quote.from_viemChain,
			});

			let estimated_gas = await public_client.estimateGas({
				account: account as `0x${string}`,
				to: quote.from_swapContractAddress as `0x${string}`,
				data: encoded_swap_function_data as `0x${string}`,
				value,
				type: 'eip1559',
			});

			console.log('estimated_gas:', estimated_gas);

			let prepared_transaction = await wallet_client.prepareTransactionRequest({
				chain: quote.from_viemChain,
				account: account as `0x${string}`,
				to: quote.from_swapContractAddress as `0x${string}`,
				data: encoded_swap_function_data as `0x${string}`,
				maxFeePerGas: BigInt(quote.nativeTokenFees?.maxFeePerGas!),
				maxPriorityFeePerGas: BigInt(quote.nativeTokenFees?.maxPriorityFeePerGas!),
				gas: BigInt(quote.nativeTokenFees?.swapGasLimit!),
				type: 'eip1559',
				value,
			});

			// waiting for the nonce to be upgraded
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const nonce = await public_client.getTransactionCount({
				address: account,
				blockTag: 'latest',
			});

			if (nonce != prepared_transaction.nonce) {
				prepared_transaction.nonce = nonce;
			}

			const hash = await wallet_client.sendTransaction({
				account: account,
				...prepared_transaction,
			});

			let fromChain = quote.from_viemChain?.id;


			const tx_status = await public_client.waitForTransactionReceipt({
				hash,
				confirmations: 1,
			});

			if (tx_status.status == 'success') {
				// request log scrapping from the minter

				// Create an actor for the Appic minter
				// const appic_minter_actor = Actor.createActor(AppicMinterIdlFactory, {
				// 	canisterId: Principal.fromText(quote.from_minter_id!),
				// 	agent: unauthenticated_agent,
				// });

				// cause block numbers update every 3 seconds
				// await new Promise((resolve) => setTimeout(resolve, 3000));

				// const log_scraping_request_result =
				// 	(await appic_minter_actor.request_scraping_logs()) as LogScrapingResult;
				// if ('Err' in log_scraping_request_result) {
				// 	if ('CalledTooManyTimes' in log_scraping_request_result.Err) {
				// 		setTimeout(async () => {
				// 			await appic_minter_actor.request_scraping_logs();
				// 		}, 5000);
				// 	} else {
				// 		setTimeout(async () => {
				// 			await appic_minter_actor.request_scraping_logs();
				// 		}, 5000);
				// 	}
				// }
				//
				// console.log(log_scraping_request_result);

				return {
					result: hash,
					message: '',
					success: true,
				};
			} else {
				return {
					result: 'Failed to send tx to the network',
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

			let swap_result = (await dex_actor.cross_chain_swap({
				encoded_swap_data: quote.encodedData,
				recipient: convertAddressToBytes32(evm_address as Address),
			} as CrosschainSwapArgs)) as CrossChainSwapResult;
			if ('Err' in swap_result) {
				console.log(swap_result.Err);
				return {
					message: `${swap_result.Err}`,
					result: '',
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
			result: '',
			success: false,
		};
	}
}

export interface SwapStatus {
	title: 'Swapped' | 'Swapping' | 'Swap failed';
	caption: string;
	status: TxStatusType;
	amount_in: string;
	amount_out: string;
}

/// step 3 check swap status should be called every 5 seconds
export async function check_swap_status(
	quote: CrossChainQuote,
	hash_or_tx_id: string,
	unauthenticated_agent: HttpAgent,
): Promise<Response<SwapStatus>> {
	try {
		const fromIsEvm = quote.tokenIn.chain_type === 'EVM';
		const toIsEvm = quote.tokenOut.chain_type === 'EVM';
		const tokenInSymbol = quote.tokenIn.symbol || 'TOKEN_IN';
		const tokenOutSymbol = quote.tokenOut.symbol || 'TOKEN_OUT';

		let swapTxId: string | undefined;
		let currentStatus: any;
		let minterRpcUrl: string | undefined;
		let minterViemChain: any;
		let minterChainId: number = fromIsEvm
			? Number(quote.tokenIn.chainId)
			: Number(quote.tokenOut.chainId);
		let publicClient: any;

		if (fromIsEvm) {
			minterRpcUrl = quote.from_rpcURl;
			minterViemChain = quote.from_viemChain;
			const fromMinterActor = Actor.createActor(AppicMinterIdlFactory, {
				agent: unauthenticated_agent,
				canisterId: Principal.fromText(quote.from_minter_id!),
			});

			const statusOpt = (await fromMinterActor.retrieve_swap_status_by_hash(hash_or_tx_id)) as
				| []
				| [SwapStatus];
			if (!statusOpt || statusOpt.length === 0) {
				return { success: true, message: '', result: pendingResponse(quote) };
			}
			currentStatus = statusOpt[0];
		} else {
			minterRpcUrl = quote.to_rpcURl;
			minterViemChain = quote.to_viemChain;
			swapTxId = hash_or_tx_id;
		}

		// Handle minter status if fromIsEvm (for EVM start)
		if (fromIsEvm && currentStatus) {
			publicClient = createPublicClient({ transport: http(minterRpcUrl), chain: minterViemChain });
			const usdcDecimals = minterChainId === 56 ? 18 : 6;

			if (
				'PendingSwap' in currentStatus ||
				'AcceptedSwap' in currentStatus ||
				'SwapTxCreated' in currentStatus ||
				'PendingRefundSwap' in currentStatus ||
				'RefundSwapTxCreated' in currentStatus ||
				'PendingFailedSwap' in currentStatus ||
				'QuarantinedSwap' in currentStatus
			) {
				return { success: true, message: '', result: pendingResponse(quote) };
			} else if ('SwapTxSent' in currentStatus) {
				const hash = currentStatus.SwapTxSent.transaction_hash;
				const rawAmountOut = await getEventAmountOut(publicClient, hash);
				if (rawAmountOut === null)
					return { success: true, message: '', result: pendingResponse(quote) };
				return {
					success: true,
					message: '',
					result: successResponse(quote, rawAmountOut, quote.tokenOut.decimals),
				};
			} else if ('RefundSwapTxSent' in currentStatus) {
				const hash = currentStatus.RefundSwapTxSent.transaction_hash;
				const rawAmountOut = await getEventAmountOut(publicClient, hash);
				if (rawAmountOut === null)
					return { success: true, message: '', result: pendingResponse(quote) };
				return {
					success: true,
					message: '',
					result: refundResponse(quote, rawAmountOut, 'USDC', usdcDecimals),
				};
			} else if ('SwapTxFinalized' in currentStatus) {
				const finalized = currentStatus.SwapTxFinalized;
				if ('PendingReimbursement' in finalized)
					return { success: true, message: '', result: pendingResponse(quote) };
				const hash = ('Success' in finalized ? finalized.Success : finalized.Reimbursed)
					.transaction_hash;
				const rawAmountOut = await getEventAmountOut(publicClient, hash);
				if (rawAmountOut === null)
					return { success: true, message: '', result: pendingResponse(quote) };
				if ('Success' in finalized) {
					return {
						success: true,
						message: '',
						result: successResponse(quote, rawAmountOut, quote.tokenOut.decimals),
					};
				} else {
					const rawRefund = rawAmountOut || finalized.Reimbursed.reimbursed_amount.toString();
					return {
						success: true,
						message: '',
						result: refundResponse(quote, rawRefund, 'USDC', usdcDecimals),
					};
				}
			} else if ('RefundSwapTxFinalized' in currentStatus) {
				const finalized = currentStatus.RefundSwapTxFinalized;
				if ('PendingReimbursement' in finalized)
					return { success: true, message: '', result: pendingResponse(quote) };
				const hash = ('Success' in finalized ? finalized.Success : finalized.Reimbursed)
					.transaction_hash;
				const rawAmountOut = await getEventAmountOut(publicClient, hash);
				const rawRefund =
					rawAmountOut ||
					('Reimbursed' in finalized ? finalized.Reimbursed.reimbursed_amount.toString() : '0');
				return {
					success: true,
					message: '',
					result: refundResponse(quote, rawRefund, 'USDC', usdcDecimals),
				};
			} else if ('MintedToAppicDex' in currentStatus) {
				swapTxId = currentStatus.MintedToAppicDex;
			} else if ('NotifiedAppicDex' in currentStatus) {
				swapTxId = currentStatus.NotifiedAppicDex;
			} else {
				return { success: true, message: '', result: pendingResponse(quote) };
			}
		}

		// Handle dex status
		if (swapTxId) {
			const dexActor = Actor.createActor(idlFactory, {
				agent: unauthenticated_agent,
				canisterId: Principal.fromText(appic_dex),
			});
			const dexStatusOpt = (await dexActor.get_crosschain_swap_status(swapTxId)) as
				| []
				| [CrosschainSwapStatus];
			if (!dexStatusOpt || dexStatusOpt.length === 0) {
				return { success: true, message: '', result: pendingResponse(quote) };
			}
			const dexStatus = dexStatusOpt[0];

			if ('Pending' in dexStatus) {
				return { success: true, message: '', result: pendingResponse(quote) };
			} else if ('Refunded' in dexStatus) {
				if (!fromIsEvm) {
					// ICP origin, refund on ICP
					const refundAmount = quote.amountIn;
					const refundToken = tokenInSymbol;
					return {
						success: true,
						message: '',
						result: refundResponseFormatted(quote, refundAmount, refundToken),
					};
				} else {
					// EVM origin, refund to minter, treat as pending
					return { success: true, message: '', result: pendingResponse(quote) };
				}
			} else if ('Successful' in dexStatus) {
				const rawAmountOut = dexStatus.Successful.toString();
				if (!toIsEvm) {
					return {
						success: true,
						message: '',
						result: successResponse(quote, rawAmountOut, quote.tokenOut.decimals),
					};
				} else {
					// Proceed to to minter
					minterRpcUrl = quote.to_rpcURl;
					minterViemChain = quote.to_viemChain;
					minterChainId = Number(quote.tokenOut.chainId);
					publicClient = createPublicClient({
						transport: http(minterRpcUrl),
						chain: minterViemChain,
					});
					const usdcDecimals = minterChainId === 56 ? 18 : 6;

					const toMinterActor = Actor.createActor(AppicMinterIdlFactory, {
						agent: unauthenticated_agent,
						canisterId: Principal.fromText(quote.to_minter_id!),
					});
					const toStatusOpt = (await toMinterActor.retrieve_swap_status_by_swap_tx_id(swapTxId)) as
						| []
						| [SwapStatus];
					if (!toStatusOpt || toStatusOpt.length === 0) {
						return { success: true, message: '', result: pendingResponse(quote) };
					}
					currentStatus = toStatusOpt[0];

					if (
						'PendingSwap' in currentStatus ||
						'AcceptedSwap' in currentStatus ||
						'SwapTxCreated' in currentStatus ||
						'PendingRefundSwap' in currentStatus ||
						'RefundSwapTxCreated' in currentStatus ||
						'PendingFailedSwap' in currentStatus ||
						'QuarantinedSwap' in currentStatus
					) {
						return { success: true, message: '', result: pendingResponse(quote) };
					} else if ('SwapTxSent' in currentStatus) {
						const hash = currentStatus.SwapTxSent.transaction_hash;
						const rawAmountOutTo = await getEventAmountOut(publicClient, hash);
						if (rawAmountOutTo === null)
							return { success: true, message: '', result: pendingResponse(quote) };
						return {
							success: true,
							message: '',
							result: successResponse(quote, rawAmountOutTo, quote.tokenOut.decimals),
						};
					} else if ('RefundSwapTxSent' in currentStatus) {
						const hash = currentStatus.RefundSwapTxSent.transaction_hash;
						const rawAmountOutTo = await getEventAmountOut(publicClient, hash);
						if (rawAmountOutTo === null)
							return { success: true, message: '', result: pendingResponse(quote) };
						return {
							success: true,
							message: '',
							result: refundResponse(quote, rawAmountOutTo, 'USDC', usdcDecimals),
						};
					} else if ('SwapTxFinalized' in currentStatus) {
						const finalized = currentStatus.SwapTxFinalized;
						if ('PendingReimbursement' in finalized)
							return { success: true, message: '', result: pendingResponse(quote) };
						const hash = ('Success' in finalized ? finalized.Success : finalized.Reimbursed)
							.transaction_hash;
						const rawAmountOutTo = await getEventAmountOut(publicClient, hash);
						if (rawAmountOutTo === null)
							return { success: true, message: '', result: pendingResponse(quote) };
						if ('Success' in finalized) {
							return {
								success: true,
								message: '',
								result: successResponse(quote, rawAmountOutTo, quote.tokenOut.decimals),
							};
						} else {
							const rawRefund = rawAmountOutTo || finalized.Reimbursed.reimbursed_amount.toString();
							return {
								success: true,
								message: '',
								result: refundResponse(quote, rawRefund, 'USDC', usdcDecimals),
							};
						}
					} else if ('RefundSwapTxFinalized' in currentStatus) {
						const finalized = currentStatus.RefundSwapTxFinalized;
						if ('PendingReimbursement' in finalized)
							return { success: true, message: '', result: pendingResponse(quote) };
						const hash = ('Success' in finalized ? finalized.Success : finalized.Reimbursed)
							.transaction_hash;
						const rawAmountOutTo = await getEventAmountOut(publicClient, hash);
						const rawRefund =
							rawAmountOutTo ||
							('Reimbursed' in finalized ? finalized.Reimbursed.reimbursed_amount.toString() : '0');
						return {
							success: true,
							message: '',
							result: refundResponse(quote, rawRefund, 'USDC', usdcDecimals),
						};
					} else if ('MintedToAppicDex' in currentStatus || 'NotifiedAppicDex' in currentStatus) {
						// Unlikely, but if here, perhaps success
						return {
							success: true,
							message: '',
							result: successResponse(quote, quote.amountOutRaw || '0', quote.tokenOut.decimals),
						};
					} else {
						return { success: true, message: '', result: pendingResponse(quote) };
					}
				}
			}
		}

		return { success: true, message: '', result: pendingResponse(quote) };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: `Failed to check swap status: ${error}`,
			result: failedResponse(quote, 'Error checking status'),
		};
	}
}

// Format amount with decimals using BigNumber
export function formatAmount(raw: string, decimals: number): string {
	if (!raw) return '0';
	return new BigNumber(raw).div(new BigNumber(10).pow(decimals)).toFixed(6);
}


// Helper responses
function pendingResponse(quote: CrossChainQuote): SwapStatus {
	return {
		status: 'pending',
		amount_in: quote.amountIn,
		amount_out: quote.amountOut,
		caption: 'Swap in progress...',
		title: 'Swapping',
	};
}

function successResponse(
	quote: CrossChainQuote,
	rawAmountOut: string,
	tokenOutDecimals: number,
): SwapStatus {
	const formattedAmountOut = formatAmount(rawAmountOut, tokenOutDecimals);
	const tokenInSymbol = quote.tokenIn.symbol || 'TOKEN_IN';
	const tokenOutSymbol = quote.tokenOut.symbol || 'TOKEN_OUT';
	return {
		status: 'successful',
		amount_in: quote.amountIn,
		amount_out: formattedAmountOut,
		caption: `Swapped ${quote.amountIn} ${tokenInSymbol} to ${formattedAmountOut} ${tokenOutSymbol}`,
		title: 'Swapped',
	};
}

function refundResponse(
	quote: CrossChainQuote,
	rawRefundAmount: string,
	refundToken: string,
	refundDecimals: number,
): SwapStatus {
	const formattedRefund = formatAmount(rawRefundAmount, refundDecimals);
	return {
		status: 'failed',
		amount_in: quote.amountIn,
		amount_out: '0',
		caption: `Refunded with ${formattedRefund} ${refundToken}`,
		title: 'Swap failed',
	};
}

function refundResponseFormatted(
	quote: CrossChainQuote,
	formattedRefundAmount: string,
	refundToken: string,
): SwapStatus {
	return {
		status: 'failed',
		amount_in: quote.amountIn,
		amount_out: '0',
		caption: `Refunded with ${formattedRefundAmount} ${refundToken}`,
		title: 'Swapping',
	};
}

function failedResponse(quote: CrossChainQuote, reason: string): SwapStatus {
	return {
		status: 'failed',
		amount_in: quote.amountIn,
		amount_out: '0',
		caption: `Swap failed: ${reason}`,
		title: 'Swapped',
	};
}

// ABI for SwapExecuted event
// ABI for SwapExecuted event
const swapExecutedAbi = [
	{
		anonymous: false,
		inputs: [
			{ indexed: false, name: 'user', type: 'address' },
			{ indexed: true, name: 'recipient', type: 'bytes32' },
			{ indexed: true, name: 'tokenIn', type: 'address' },
			{ indexed: true, name: 'tokenOut', type: 'address' },
			{ indexed: false, name: 'amountIn', type: 'uint256' },
			{ indexed: false, name: 'amountOut', type: 'uint256' },
			{ indexed: false, name: 'bridgeToMinter', type: 'bool' },
			{ indexed: false, name: 'encodedData', type: 'bytes' },
		],
		name: 'SwapExecuted',
		type: 'event',
	},
] as const;

// Helper to get amountOut from event
export async function getEventAmountOut(
	publicClient: any,
	hash: string,
): Promise<string | null> {
	let txHash = hash.startsWith('0x') ? (hash as `0x${string}`) : (`0x${hash}` as `0x${string}`);
	const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
	console.log(receipt);
	const logs = parseEventLogs({ abi: swapExecutedAbi, logs: receipt.logs });
	const filtered = logs.filter((log: any) => log.eventName === 'SwapExecuted');
	if (filtered.length === 0) return null;
	return filtered[0].args.amountOut.toString();
}

export const convertAddressToBytes32 = (address: Address): Hex => {
	return padHex(address, { size: 32 });
};

export const create_wallet_client = async (chain_id: number): Promise<WalletClient<any>> => {

	await switchToChain(chain_id);

	const account = getAccount(wagmiAdapter.wagmiConfig);
	const connector = account.connector as Connector | undefined;
	const provider = (await connector?.getProvider?.() ?? connector?.transport) as any;

	console.log("wagmi provider:", provider);

	const ethereum = (window as any).ethereum;

	if (!ethereum) {
		throw new Error('MetaMask is not installed or ethereum object is not available');
	}
	try {
		const walletClient = createWalletClient({
			transport: custom(provider),
			account: account.address
		});

		//await walletClient.addChain({ chain: bridge_option.viem_chain });

		// await walletClient.switchChain({ id: chain_id });
		// const addresses = await walletClient.requestAddresses();
		// console.log(addresses);

		return walletClient;
	} catch (error) {
		console.log(error);

		throw error;
	}
};


export async function switchToChain(chainId: number): Promise<void> {
	try {
		await switchChain(wagmiAdapter.wagmiConfig, { chainId });
	} catch (err: any) {
		throw "Chain not found";
	}
}
