import { Dialog, DialogContent, DialogTitle } from '@/common/components/ui/dialog';
import BridgeTransactionStepper from './TransactionStepper';
import { useEffect, useState } from 'react';
import { useBridgeStore } from '../../_store';
import BridgeReview from './BridgeReview';
import { TxStep } from '../../_api/types';
import { depositStepsDetails, withdrawalStepsDetails } from '@/common/constants/bridge';

export const StepperContainer = () => {
  // all steps of transaction details like title, logo and status
  const [steps, setSteps] = useState<TxStep[]>();
  // bridge store
  // txStatus is last step status of each transaction type
  const { fromToken, txStep } = useBridgeStore();

  // if transaction type is deposit, set main steps to deposit steps details
  // else if transaction type is withdrawal, set main steps to deposit steps details
  useEffect(() => {
    if (fromToken?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
    }
    if (fromToken?.chain_type === 'ICP') {
      setSteps(withdrawalStepsDetails);
    }
  }, [fromToken]);

  return (
    <Dialog>
      <BridgeReview />
      <DialogTitle></DialogTitle>
      <DialogContent className="h-[350] w-fit min-w-80">
        {steps && <BridgeTransactionStepper steps={steps} currentStep={txStep} />}
      </DialogContent>
    </Dialog>
  );
};
