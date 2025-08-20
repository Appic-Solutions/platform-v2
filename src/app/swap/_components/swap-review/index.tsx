import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import SwapTransactionStepper from './transaction-stepper';
import { useEffect, useState } from 'react';
import { useSwapActions, useSwapStore } from '../../_store';
import SwapReview from './swap-review';
import { TxStep } from '../../_api/types';
import { depositStepsDetails } from '@/lib/constants/bridge';
import { icpSwapStepsDetails } from '@/lib/constants/swap';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import { approve_token_in, swap } from '@/blockchain_api/functions/icp/dex/tx/swap';
import { useQueryClient } from '@tanstack/react-query';
import { fetchIcpBalances } from '@/lib/helpers/wallet';

export const StepperContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<TxStep[]>();
  const { tokenIn, txStep, swapQuote, actions } = useSwapStore();
  const { authenticatedAgent, unAuthenticatedAgent, icpIdentity } = useSharedStore();
  const { setIcpBalance } = useSharedStoreActions();
  const {
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setToWalletAddress,
    setWithdrawalId,
  } = useSwapActions();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (tokenIn?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
    }
    if (tokenIn?.chain_type === 'ICP') {
      setSteps(icpSwapStepsDetails);
    }
  }, [tokenIn]);

  const resetTxState = () => {
    setTxStep({
      count: 1,
      status: 'pending',
    });
    setTxErrorMessage(undefined);
  };

  const onCloseModal = () => {
    if (txStep.count === 2) {
      if (txStep.status === 'successful') {
        setIsOpen(false);
        setActiveStep(1);
        setAmount('');
        setToWalletAddress('');
        setWithdrawalId(undefined);
        resetTxState();
      } else if (txStep.status === 'failed') {
        setIsOpen(false);
        resetTxState();
      }
    }
  };

  const swapHandler = async () => {
    if (swapQuote && swapQuote.quote && unAuthenticatedAgent && icpIdentity) {
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
      fetchIcpBalances({
        unAuthenticatedAgent,
        principal: icpIdentity,
        top_tokens: false,
      }).then((res) => {
        setIcpBalance(res);
      });
    }
  };

  const onOpenModal = () => {
    setIsOpen(true);
    swapHandler();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SwapReview onOpenModal={onOpenModal} />
      <DialogTitle />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          {steps && <SwapTransactionStepper onCloseModal={onCloseModal} steps={steps} />}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
