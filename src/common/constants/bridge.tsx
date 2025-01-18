import { TxStep } from '@/app/bridge/_api/types';

export const withdrawalStepsDetails: TxStep[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please approve the transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Approved successfully',
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
        description: 'Sending transaction request to the network',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Sent Successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send transaction',
      },
    },
  },
  {
    title: 'Step 3',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending request to minter',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Sent successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to notify minter',
      },
    },
  },
  {
    title: 'Step 4',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Transaction submitted, waiting for minter verification',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to mint',
      },
    },
  },
];

export const depositStepsDetails: TxStep[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Preparing bridge transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Successfully prepared bridge transaction',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to prepare bridge transaction',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please approve the transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Approved successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to approve transaction',
      },
    },
  },
  {
    title: 'Step 3',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending transaction request to the network',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Sent Successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send transaction',
      },
    },
  },
  {
    title: 'Step 4',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending request to minter',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Sent successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to notify minter',
      },
    },
  },
  {
    title: 'Step 5',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Transaction submitted, waiting for minter verification',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to mint',
      },
    },
  },
];
