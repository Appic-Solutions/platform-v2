import { useSwapStore } from '../../_store';
import { useSharedStore } from '@/store/store';
import { IcpQuote } from '@/blockchain_api/quoter/icp';
import {
  approve_token_in as icpApproveTokenIn,
  swap as icpSwap,
} from '@/blockchain_api/functions/icp/dex/tx/swap';
import { useQueryClient } from '@tanstack/react-query';
import {
  approve_token_in as crossChainApproveTokenIn,
  swap as crosschainSwap,
} from '@/blockchain_api/functions/swap/crosschain';
import { CrossChainQuote } from '@/blockchain_api/quoter/cross-chain';
import { Principal } from '@dfinity/principal';

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
    if (authenticatedAgent && unAuthenticatedAgent) {
      // step1
      const approveRes = await crossChainApproveTokenIn(
        swapQuote as CrossChainQuote,
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
      let swapRes;
      if (swapQuote?.tokenIn.chain_type === 'EVM') {
        // evm to icp
        swapRes = await crosschainSwap(
          swapQuote as CrossChainQuote,
          authenticatedAgent,
          undefined,
          toWalletAddress ? Principal.fromText(toWalletAddress) : icpIdentity,
        );
      } else {
        // icp to evm
        swapRes = await crosschainSwap(
          swapQuote as CrossChainQuote,
          authenticatedAgent,
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

  const sameChainSWapExe = () => {};

  return {
    crosschainSwapExe,
    icpSwapExe,
    sameChainSWapExe,
  };
};
