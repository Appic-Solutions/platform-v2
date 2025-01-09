import { TxStep } from '@/app/bridge/_components/bridge-review/StepperModal';

export const withdrawalStepsDetails: TxStep[] = [
  {
    logo: '',
    title: 'Step 1',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Please approve the transaction',
      },
      {
        statusTitle: 'successful',
        description: 'Approved successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to approve transaction + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 2',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Sending transaction request to the network',
      },
      {
        statusTitle: 'successful',
        description: 'Sent Successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to send transaction + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 3',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Sending request to minter',
      },
      {
        statusTitle: 'successful',
        description: 'Sent successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to notify minter + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 4',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Waiting for destination chain',
      },
      {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to mint + reason',
      },
    ],
  },
];

export const depositStepsDetails: TxStep[] = [
  {
    logo: '',
    title: 'Step 1',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Preparing bridge transaction',
      },
      {
        statusTitle: 'successful',
        description: 'Successfully prepared bridge transaction',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to prepare bridge transaction + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 2',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Please approve the transaction',
      },
      {
        statusTitle: 'successful',
        description: 'Approved successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to approve transaction + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 3',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Sending transaction request to the network',
      },
      {
        statusTitle: 'successful',
        description: 'Sent Successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to send transaction + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 4',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Sending request to minter',
      },
      {
        statusTitle: 'successful',
        description: 'Sent successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to notify minter + reason',
      },
    ],
  },
  {
    logo: '',
    title: 'Step 5',
    statuses: [
      {
        statusTitle: 'pending',
        description: 'Waiting for destination chain',
      },
      {
        statusTitle: 'successful',
        description: 'Minted successfully',
      },
      {
        statusTitle: 'failed',
        description: 'Failed to mint + reason',
      },
    ],
  },
];
