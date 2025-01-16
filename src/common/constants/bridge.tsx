import { TxStep } from '@/app/bridge/_api/types';

export const withdrawalStepsDetails: TxStep[] = [
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
        description: 'Failed to approve transaction',
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
        description: 'Failed to send transaction',
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
        description: 'Failed to notify minter',
      },
    },
  },
  {
    logo: '',
    title: 'Step 4',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Transaction submitted, waiting for minter verification',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to mint',
      },
    },
  },
];

export const depositStepsDetails: TxStep[] = [
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
        description: 'Failed to prepare bridge transaction',
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
        description: 'Failed to approve transaction',
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
        description: 'Failed to send transaction',
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
        description: 'Failed to notify minter',
      },
    },
  },
  {
    logo: '',
    title: 'Step 5',
    statuses: {
      pending: {
        statusTitle: 'pending',
        description: 'Transaction submitted, waiting for minter verification',
      },
      successful: {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      failed: {
        statusTitle: 'failed',
        description: 'Failed to mint',
      },
    },
  },
];
