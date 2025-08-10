import { RemoveLiquidityPercent } from '@/app/positions/_components/position-details/remove-liquidity/step-one';
import { CreatePositionStepDetail } from '@/app/positions/types';

export const allowedInputCharacters = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
];

export const createPositionStepsDetails: CreatePositionStepDetail[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please Approve the transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Approved Successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to approve spending',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending mint transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Transaction Successful',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send the transaction',
      },
    },
  },
];

export const addLiquidityStepsDetails: CreatePositionStepDetail[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Please Approve the transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Approved Successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to approve spending',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending add liquidity transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Transaction Successful',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send the transaction',
      },
    },
  },
];

export const collectFeesStepsDetails: CreatePositionStepDetail[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending add liquidity transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Approved Successfully',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to approve spending',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending add liquidity transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Transaction Successful',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send the transaction',
      },
    },
  },
];

export const removeLiquidityStepsDetails: CreatePositionStepDetail[] = [
  {
    title: 'Step 1',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Preparing transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Successful',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to prepare spending',
      },
    },
  },
  {
    title: 'Step 2',
    statuses: {
      pending: {
        statusTitle: 'Pending',
        description: 'Sending remove liquidity transaction',
      },
      successful: {
        statusTitle: 'Successful',
        description: 'Transaction Successful',
      },
      failed: {
        statusTitle: 'Failed',
        description: 'Failed to send the transaction',
      },
    },
  },
];

export const removeLiquidityPercents: RemoveLiquidityPercent[] = [
  { label: '25%', value: '25' },
  { label: '50%', value: '50' },
  { label: '75%', value: '75' },
  { label: 'max', value: '100' },
] as const;
