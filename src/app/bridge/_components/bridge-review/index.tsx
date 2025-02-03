import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/common/components/ui/dialog';
import BridgeTransactionStepper from './TransactionStepper';
import { useEffect, useState } from 'react';
import { useBridgeStore } from '../../_store';
import BridgeReview from './BridgeReview';
import { TxStep } from '../../_api/types';
import { depositStepsDetails, withdrawalStepsDetails } from '@/common/constants/bridge';

export const StepperContainer = () => {
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  // all steps of transaction details like title, logo and status
  const [steps, setSteps] = useState<TxStep[]>();
  // bridge store
  const { fromToken, txStep } = useBridgeStore();

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
      <BridgeReview onOpenModal={() => setIsOpen(true)} />
      <DialogTitle></DialogTitle>
      <DialogOverlay
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="h-[350] w-fit min-w-80"
        >
          {steps && (
            <BridgeTransactionStepper onCloseModal={() => setIsOpen(false)} steps={steps} currentStep={txStep} />
          )}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
