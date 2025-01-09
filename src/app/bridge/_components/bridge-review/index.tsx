import { Dialog, DialogContent, DialogTitle } from '@/common/components/ui/dialog';
import BridgeTransactionStepper from './TransactionStepper';
import { useEffect, useState } from 'react';
import { useBridgeStore } from '../../_store';
import BridgeReview from './BridgeReview';
import { TxStep } from '../../_api/types';

const withdrawalStepsDetails: TxStep[] = [
  {
    logo: '',
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Please approve the transaction',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Approved successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to approve transaction + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Sending transaction request to the network',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Sent Successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to send transaction + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 3',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Sending request to minter',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Sent successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to notify minter + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 4',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Waiting for destination chain',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to mint + reason',
      },
    },
  },
];

const depositStepsDetails: TxStep[] = [
  {
    logo: '',
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Preparing bridge transaction',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Successfully prepared bridge transaction',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to prepare bridge transaction + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Please approve the transaction',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Approved successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to approve transaction + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 3',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Sending transaction request to the network',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Sent Successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to send transaction + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 4',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Sending request to minter',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Sent successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to notify minter + reason',
      },
    },
  },
  {
    logo: '',
    title: 'Step 5',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Waiting for destination chain',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to mint + reason',
      },
    },
  },
];

export const StepperContainer = () => {
  const [steps, setSteps] = useState<TxStep[]>();
  const { fromToken, txStep, txStatus } = useBridgeStore();
  const [status, setStatus] = useState<'failed' | 'successful' | 'pending'>();

  useEffect(() => {
    if (fromToken?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
    }
    if (fromToken?.chain_type === 'ICP') {
      setSteps(withdrawalStepsDetails);
    }
  }, [fromToken]);

  useEffect(() => {
    if (fromToken?.chain_type === 'EVM') {
      setSteps(depositStepsDetails);
      if (txStatus === 'Minted') {
        setStatus('successful');
      } else if (txStatus === 'Invalid' || txStatus === 'Quarantined') {
        setStatus('failed');
      } else {
        setStatus('pending');
      }
    }

    if (fromToken?.chain_type === 'ICP') {
      if (txStatus === 'Successful') {
        setStatus('successful');
      } else if (txStatus === 'QuarantinedReimbursement' || txStatus === 'Reimbursed') {
        setStatus('failed');
      } else {
        setStatus('pending');
      }
    }
  }, [txStatus, fromToken]);

  return (
    <Dialog>
      <BridgeReview />
      <DialogTitle></DialogTitle>
      <DialogContent className="h-[350] w-fit min-w-80">
        {steps && <BridgeTransactionStepper steps={steps} currentStep={txStep} status={status} />}
      </DialogContent>
    </Dialog>
  );
};
