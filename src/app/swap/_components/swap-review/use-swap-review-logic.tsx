import { useSwapStore } from '../../_store';
import { useSharedStore } from '@/store/store';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import {
	approve_token_in as icpApproveTokenIn,
	swap as icpSwap,
} from '@/blockchain_api/functions/icp/dex/tx/swap';
import { useQueryClient } from '@tanstack/react-query';
import {
	cross_chain_approve_token_in as crossChainApproveTokenIn,
	cross_chain_swap as crossChainSwap,
} from '@/blockchain_api/functions/swap/crosschain';
import {
	same_chain_approve_token_in as sameChainApproveTokenIn,
	same_chain_swap as sameChainSwap,
} from '@/blockchain_api/functions/swap/samechain';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { Principal } from '@dfinity/principal';
import { SameChainQuote } from '@/blockchain_api/quoter/same-chain';

export const useSwapReviewLogic = () => {
	const { tokenIn, swapQuote, actions, toWalletAddress } = useSwapStore();
	const { authenticatedAgent, icpIdentity, unAuthenticatedAgent, evmAddress } = useSharedStore();

	const queryClient = useQueryClient();

	const icpSwapExe = async () => {
		if (
			tokenIn?.chain_type === 'ICP' &&
			authenticatedAgent &&
			icpIdentity &&
			unAuthenticatedAgent
		) {
			// step1
			const approveRes = await icpApproveTokenIn(
				swapQuote as IcpQuote,
				authenticatedAgent,
				unAuthenticatedAgent,
			);

			if (!approveRes || !approveRes.result) {
				actions.setTxStep({
					count: 1,
					status: 'failed',
				});
				return approveRes;
			}

			actions.setTxStep({
				count: 2,
				status: 'pending',
			});

			// Step 2
			const swapRes = await icpSwap(approveRes.result, authenticatedAgent);

			if (!swapRes.success) {
				actions.setTxStep({
					count: 2,
					status: 'failed',
				});
				return swapRes.message;
			}
			actions.setTxStep({
				count: 2,
				status: 'successful',
			});
		}
		queryClient.invalidateQueries({ queryKey: ['fetch-icp-balances'] });
	};

	const crosschainSwapExe = async () => {
		if (unAuthenticatedAgent) {
			// step1
			const approveRes = await crossChainApproveTokenIn(
				swapQuote as CrossChainQuote,
				authenticatedAgent,
				unAuthenticatedAgent,
			);

			if (!approveRes.success) {
				actions.setTxStep({
					count: 1,
					status: 'failed',
				});
				return approveRes;
			}

			actions.setTxStep({
				count: 2,
				status: 'pending',
			});

			// Step 2
			let swapRes;
			if (swapQuote?.tokenIn.chain_type === 'EVM' && swapQuote?.tokenOut.chain_type == "ICP") {
				// evm to icp
				swapRes = await crossChainSwap(
					swapQuote as CrossChainQuote,
					authenticatedAgent,
					unAuthenticatedAgent,
					undefined,
					toWalletAddress ? Principal.fromText(toWalletAddress) : icpIdentity,
				);
			} else if (swapQuote?.tokenIn.chain_type === 'EVM' && swapQuote?.tokenOut.chain_type == "EVM") {
				//  evm to evm
				swapRes = await crossChainSwap(
					swapQuote as CrossChainQuote,
					authenticatedAgent,
					unAuthenticatedAgent,
					toWalletAddress ? toWalletAddress : evmAddress,
					undefined,
				);

			} else {
				// icp to evm
				swapRes = await crossChainSwap(
					swapQuote as CrossChainQuote,
					authenticatedAgent,
					unAuthenticatedAgent,
					toWalletAddress ? toWalletAddress : evmAddress,
					undefined,
				);
			}

			if (!swapRes.success) {
				actions.setTxStep({
					count: 2,
					status: 'failed',
				});
				return swapRes.message;
			}
			actions.setTxStep({
				count: 2,
				status: 'successful',
			});
		}
		queryClient.invalidateQueries({ queryKey: ['fetch-icp-balances'] });
		queryClient.invalidateQueries({ queryKey: ['fetch-evm-balances'] });
	};

	const sameChainSWapExe = async () => {
		// step1
		const approveRes = await sameChainApproveTokenIn(
			swapQuote as SameChainQuote,
		);

		if (!approveRes.success) {
			actions.setTxStep({
				count: 1,
				status: 'failed',
			});
			return approveRes;
		}

		actions.setTxStep({
			count: 2,
			status: 'pending',
		});

		// Step 2
		let swapRes;

		//  evm to evm same chain
		swapRes = await sameChainSwap(
			swapQuote as SameChainQuote,
			toWalletAddress ? toWalletAddress : evmAddress!,
		);

		if (!swapRes.success) {
			actions.setTxStep({
				count: 2,
				status: 'failed',
			});
			return swapRes.message;
		}
		actions.setTxStep({
			count: 2,
			status: 'successful',
		});


		queryClient.invalidateQueries({ queryKey: ['fetch-icp-balances'] });
		queryClient.invalidateQueries({ queryKey: ['fetch-evm-balances'] });

	};

	return {
		crosschainSwapExe,
		icpSwapExe,
		sameChainSWapExe,
	};
};
