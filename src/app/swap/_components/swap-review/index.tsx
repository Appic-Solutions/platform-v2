import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import SwapTransactionStepper from './transaction-stepper';
import { useEffect, useState } from 'react';
import { TxStepType, useSwapActions, useSwapStore } from '../../_store';
import SwapReview from './swap-review';
import { TxStep } from '../../_api/types';
import {
  icpSwapStepsDetails,
  crosschainSwapStepsDetails,
  sameChainSwapStepsDetails,
} from '@/lib/constants/swap';
import { useSwapReviewLogic } from './use-swap-review-logic';
import { transactionNotification } from '@/components/common/ui/toast/notification';

export const StepperContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<TxStep[]>();
  const { tokenIn, tokenOut, txStep } = useSwapStore();
  const { crosschainSwapExe, icpSwapExe, sameChainSWapExe } = useSwapReviewLogic();

  const {
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setToWalletAddress,
    setPendingSwapTx,
  } = useSwapActions();

  useEffect(() => {
    if (tokenIn?.chain_type === 'ICP' && tokenOut?.chain_type === 'ICP') {
      setSteps(icpSwapStepsDetails);
    } else if (tokenIn?.chainId === tokenOut?.chainId) {
      setSteps(sameChainSwapStepsDetails);
    } else {
      setSteps(crosschainSwapStepsDetails);
    }
  }, [tokenIn]);

  const resetTxState = () => {
    setIsOpen(false);
    setActiveStep(1);
    setTxStep({
      count: 1,
      status: 'pending',
    });
    setAmount('');
    setToWalletAddress('');
    setTxErrorMessage(undefined);
  };

  const onCloseModal = () => {
    if (txStep.status === 'successful') {
      resetTxState();
    } else if (txStep.status === 'failed') {
      setTxStep({
        count: 1,
        status: 'pending',
      });
      setTxErrorMessage(undefined);
      setIsOpen(false);
    }
  };

  const swapHandler = async () => {
    let res: TxStepType | undefined;

    if (tokenIn?.chain_type === 'ICP' && tokenOut?.chain_type === 'ICP') {
      res = await icpSwapExe();
    } else if (tokenIn?.chainId === tokenOut?.chainId) {
      res = await sameChainSWapExe();
    } else {
      res = await crosschainSwapExe();
    }
    if (res?.status === 'successful') {
      resetTxState();
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
