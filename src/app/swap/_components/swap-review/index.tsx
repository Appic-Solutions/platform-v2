import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import BridgeTransactionStepper from './transaction-stepper';
import { useEffect, useState } from 'react';
import { useSwapStore } from '../../_store';
import SwapReview from './swap-review';
import { TxStep } from '../../_api/types';
import { depositStepsDetails, withdrawalStepsDetails } from '@/lib/constants/bridge';
import { icpSwapStepsDetails } from '@/lib/constants/swap';

export const StepperContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<TxStep[]>();
  const { tokenIn } = useSwapStore();

  useEffect(() => {
    if (tokenIn?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
    }
    if (tokenIn?.chain_type === 'ICP') {
      setSteps(icpSwapStepsDetails);
    }
  }, [tokenIn]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SwapReview onOpenModal={() => setIsOpen(true)} />
      <DialogTitle />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          {steps && (
            <BridgeTransactionStepper onCloseModal={() => setIsOpen(false)} steps={steps} />
          )}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
