import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import BridgeTransactionStepper from './TransactionStepper';
import { useEffect, useState } from 'react';
import { useSwapStore } from '../../_store';
import SwapReview from './SwapReview';
import { TxStep } from '../../_api/types';
import { depositStepsDetails, withdrawalStepsDetails } from '@/lib/constants/bridge';

export const StepperContainer = () => {
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  // all steps of transaction details like title, logo and status
  const [steps, setSteps] = useState<TxStep[]>();
  // bridge store
  const { fromToken } = useSwapStore();

  useEffect(() => {
    if (fromToken?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
    }
    if (fromToken?.chain_type === 'ICP') {
      setSteps(withdrawalStepsDetails);
    }
  }, [fromToken]);

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
