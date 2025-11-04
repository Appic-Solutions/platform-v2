import { TxStepType, useSwapStore } from '../../_store';
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
import { queryKeys } from '@/lib/constants/query-keys';
import { SwapStatusCachedQuery } from '../../_types';
import { transactionNotification } from '@/components/common/ui/toast/notification';

export const isCrossChainQuote = (quote: any): quote is CrossChainQuote => {
	return (
		quote &&
		'steps' in quote &&
		Array.isArray(quote.steps) &&
		quote.steps.length > 0 &&
		('from_viemChain' in quote || 'from_minter_id' in quote)
	);
};

export const useSwapReviewLogic = () => {
	const { tokenIn, tokenOut, swapQuote, actions, toWalletAddress } = useSwapStore();
	const { authenticatedAgent, icpIdentity, unAuthenticatedAgent, evmAddress } = useSharedStore();

	const queryClient = useQueryClient();

	// we just call the transaction notification in samechain and icp swap here.
	// because there is no need to have a query call every 5s
	// and for crosschain that we should call a query every 5s, we call the transaction notification
	// in the header.tsx component inside the query for handling update state of the notification
	const icpSwapExe = async (): Promise<TxStepType | undefined> => {
		let step: TxStepType;
		if (
			tokenIn?.chain_type === 'ICP' &&
			authenticatedAgent &&
			icpIdentity &&
			unAuthenticatedAgent
		) {
			console.log("to wallet address", toWalletAddress);
			// step1
			const approveRes = await icpApproveTokenIn(
				swapQuote as IcpQuote,
				authenticatedAgent,
				unAuthenticatedAgent,
				toWalletAddress != "" ? Principal.fromText(toWalletAddress) : undefined,
			);

			if (!approveRes || !approveRes.result) {
				step = {
					count: 1,
					status: 'failed',
				};
				actions.setTxStep(step);
				return step;
			}

			actions.setTxStep({
				count: 2,
				status: 'pending',
			});

			// Step 2
			const swapRes = await icpSwap(swapQuote as IcpQuote, approveRes.result, authenticatedAgent);

			if (!swapRes.success || !swapRes.result) {
				step = {
					count: 2,
					status: 'failed',
				};
				actions.setTxStep(step);
				return step;
			}

			step = {
				count: 2,
				status: 'successful',
			};

			actions.setTxStep(step);

			transactionNotification({
				caption: swapRes.result.caption,
				isSameChain: true,
				status: swapRes.result.status,
				title: swapRes.result.title,
				tokenIn: tokenIn!,
				tokenOut: tokenOut!,
			});
			return step;
		}
	};

	const crosschainSwapExe = async (): Promise<TxStepType | undefined> => {
		let step: TxStepType;
		if (unAuthenticatedAgent && swapQuote && tokenIn && tokenOut) {
			// step1
			const approveRes = await crossChainApproveTokenIn(
				swapQuote as CrossChainQuote,
				authenticatedAgent,
				unAuthenticatedAgent,
			);

			if (!approveRes.success) {
				step = {
					count: 1,
					status: 'failed',
				};
				actions.setTxStep(step);
				return step;
			}

			actions.setTxStep({
				count: 2,
				status: 'pending',
			});

			const recipientEvm =
				swapQuote.tokenOut.chain_type === 'ICP' ? undefined : toWalletAddress || evmAddress;

			const recipientIcp =
				swapQuote.tokenOut.chain_type === 'ICP'
					? toWalletAddress == "" ? icpIdentity : Principal.fromText(toWalletAddress)
					: undefined;

			const swapRes = await crossChainSwap(
				swapQuote as CrossChainQuote,
				authenticatedAgent,
				recipientEvm,
				recipientIcp,
			);

			if (!swapRes.success) {
				step = {
					count: 2,
					status: 'failed',
				};
				actions.setTxStep(step);
				return step;
			}

			if (swapRes.success) {
				actions.setPendingSwapTx({
					id: swapRes.result,
					status: 'pending',
				});
			}

			step = {
				count: 2,
				status: swapRes.success ? 'successful' : 'failed',
			};

			actions.setTxStep(step);

			const cacheData: SwapStatusCachedQuery = {
				id: swapRes.result,
				status: 'pending',
				timestamp: Date.now(),
			};

			queryClient.setQueryData([queryKeys.swapStatus, swapRes.result], cacheData);

			return step;
		}
	};

	const sameChainSWapExe = async (): Promise<TxStepType | undefined> => {
		let step: TxStepType;
		// step1
		const approveRes = await sameChainApproveTokenIn(swapQuote as SameChainQuote);
		if (!approveRes.success) {
			step = {
				count: 1,
				status: 'failed',
			};
			actions.setTxStep(step);
			return step;
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

		if (swapRes.result.status === 'failed') {
			step = {
				count: 2,
				status: 'failed',
			};
			actions.setTxStep(step);
			return step;
		}

		step = {
			count: 2,
			status: !swapRes.success ? 'failed' : 'successful',
		};

		actions.setTxStep(step);

		transactionNotification({
			caption: swapRes.result.caption,
			isSameChain: true,
			status: swapRes.result.status,
			title: swapRes.result.title,
			tokenIn: tokenIn!,
			tokenOut: tokenOut!,
		});

		return step;
	};

	return {
		crosschainSwapExe,
		icpSwapExe,
		sameChainSWapExe,
	};
};
