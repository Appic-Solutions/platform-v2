import { TxStep } from '@/app/swap/_api/types';

export const icpSwapStepsDetails: TxStep[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please approve the approval transaction in your wallet',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Transaction approved successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to approve transaction',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please approve the swap transaction in your wallet',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Swapped assets successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to swap transaction',
      },
    },
  },
];
