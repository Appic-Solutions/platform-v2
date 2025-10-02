import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import SwapTransactionStepper from './transaction-stepper';
import { useEffect, useState } from 'react';
import { useSwapActions, useSwapStore } from '../../_store';
import SwapReview from './swap-review';
import { TxStep } from '../../_api/types';
import { depositStepsDetails } from '@/lib/constants/bridge';
import { icpSwapStepsDetails } from '@/lib/constants/swap';
import { useSwapReviewLogic } from './use-swap-review-logic';
import { useSharedStore } from '@/store/store';

export const StepperContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<TxStep[]>();
  const { tokenIn, tokenOut, txStep, toWalletAddress } = useSwapStore();
  const { crosschainSwapExe, icpSwapExe, sameChainSWapExe } = useSwapReviewLogic();
  const {
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setToWalletAddress,
    setWithdrawalId,
  } = useSwapActions();
  const { evmAddress, icpIdentity } = useSharedStore();

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
    if (txStep.status === 'successful') {
      setIsOpen(false);
      setActiveStep(1);
      setAmount('');
      setToWalletAddress('');
      setWithdrawalId(undefined);
      resetTxState();
    } else if (txStep.status === 'failed') {
      resetTxState();
      setIsOpen(false);
    }
  };

  const swapHandler = async () => {
    if (tokenIn?.chain_type === 'ICP' && tokenOut?.chain_type === 'ICP') {
      console.log('icp swap started');
      icpSwapExe();
    } else if (tokenIn?.chainId === tokenOut?.chainId) {
      console.log('same chain swap started');
      sameChainSWapExe();
    } else {
      console.log('crosschain swap started');
      crosschainSwapExe();
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
