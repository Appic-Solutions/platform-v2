import { TxStepType, useSwapStore } from '../../_store';
import { useSharedStore } from '@/store/store';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import {
  approve_token_in as icpApproveTokenIn,
  swap as icpSwap,
} from '@/blockchain_api/functions/icp/dex/tx/swap';
import { useQueryClient } from '@tanstack/react-query';
import {
  check_swap_status,
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
      const swapRes = await icpSwap(swapQuote as IcpQuote, approveRes.result, authenticatedAgent);

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
    queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
  };

  const crosschainSwapExe = async (): Promise<TxStepType | undefined> => {
    if (unAuthenticatedAgent && swapQuote && tokenIn && tokenOut) {
      // step1
      const approveRes = await crossChainApproveTokenIn(
        swapQuote as CrossChainQuote,
        authenticatedAgent,
        unAuthenticatedAgent,
      );

      if (!approveRes.success) {
        const step: TxStepType = {
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

      const isEvmToIcp =
        swapQuote.tokenIn.chain_type === 'EVM' && swapQuote.tokenOut.chain_type === 'ICP';
      const recipientEvm = toWalletAddress || evmAddress;
      const recipientIcp = toWalletAddress ? Principal.fromText(toWalletAddress) : icpIdentity;

      const swapRes = await crossChainSwap(
        swapQuote as CrossChainQuote,
        authenticatedAgent,
        unAuthenticatedAgent,
        isEvmToIcp ? undefined : recipientEvm,
        isEvmToIcp ? recipientIcp : undefined,
      );

      if (!swapRes.success) {
        const step: TxStepType = {
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

      const step: TxStepType = {
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
    queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
    queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
  };

  const sameChainSWapExe = async () => {
    // step1
    const approveRes = await sameChainApproveTokenIn(swapQuote as SameChainQuote);

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

    console.log(swapRes);

    if (swapRes.result.status === 'failed') {
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

    queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
    queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
  };

  return {
    crosschainSwapExe,
    icpSwapExe,
    sameChainSWapExe,
  };
};
