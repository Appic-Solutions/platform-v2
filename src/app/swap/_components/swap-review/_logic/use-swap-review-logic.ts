import { FullDepositRequest, FullWithdrawalRequest } from '@/app/swap/_api/types/request';
import { useSwapActions, useSwapStore } from '@/app/swap/_store';
import { approve_token_in, swap } from '@/blockchain_api/functions/icp/dex/tx/swap';
import { setPendingTransactionToSession } from '@/lib/helpers/session';
import { useSharedStore } from '@/store/store';
import { Principal } from '@dfinity/principal';

const useSwapReviewLogic = () => {
  const { tokenIn, amount, swapQuote, toWalletAddress, toWalletValidationError, actions } =
    useSwapStore();

  // Bridge Actions
  const {
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setToWalletAddress,
    setWithdrawalId,
  } = useSwapActions();

  // Shared Store
  const { icpIdentity, authenticatedAgent, unAuthenticatedAgent, evmAddress } = useSharedStore();

  async function executeTransaction() {
    setTxErrorMessage('');
    setWithdrawalId(undefined);
    setTxStep({ count: 1, status: 'pending' });

    if (swapQuote && swapQuote.quote && unAuthenticatedAgent) {
      if (tokenIn?.chain_type === 'ICP' && authenticatedAgent && icpIdentity) {
        // step1
        const approveRes = await approve_token_in(
          swapQuote.quote,
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
        const removeLiquidityResponse = await swap(approveRes.result, authenticatedAgent);

        if (!removeLiquidityResponse.success) {
          actions.setTxStep({
            count: 2,
            status: 'failed',
          });
          return removeLiquidityResponse.message;
        }
        actions.setTxStep({
          count: 2,
          status: 'successful',
        });
      }
    }
  }

  function resetTransaction() {
    setTxStep({
      count: 1,
      status: 'pending',
    });
    setTxErrorMessage(undefined);
    setActiveStep(1);
    setAmount('');
    setToWalletAddress('');
    setWithdrawalId(undefined);
  }

  return {
    executeTransaction,
    resetTransaction,
  };
};

export default useSwapReviewLogic;
