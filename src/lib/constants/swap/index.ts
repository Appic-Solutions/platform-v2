import { TxStep } from '@/app/swap/_api/types';

export const icpSwapStepsDetails: TxStep[] = [
  {
    title: 'transaction approval',
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
    title: 'sending the swap transaction',
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
