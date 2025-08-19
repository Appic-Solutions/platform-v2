import { NewTwinMetadata } from '@/blockchain_api/functions/icp/new_twin_token';
import { getChainName } from '@/lib/utils';
import { ModalStepDataReturn } from '../_types';

export const Step2Data = (newTwinMeta: NewTwinMetadata | undefined) => [
  {
    title: 'Original Token Name:',
    value: newTwinMeta?.base_token.name,
  },
  {
    title: 'Original Token Symbol:',
    value: newTwinMeta?.base_token.symbol,
  },
  {
    title: 'Original Blockchain:',
    value: getChainName(newTwinMeta?.base_chain.chainId),
  },
  {
    title: 'Twin Token Name:',
    value: newTwinMeta?.twin_token.name,
  },
  {
    title: 'Twin Token Symbol:',
    value: newTwinMeta?.twin_token.symbol,
  },
  {
    title: 'Twin Token Blockchain:',
    value: `${getChainName(newTwinMeta?.twin_chain.chainId)}`,
  },
  {
    title: 'Twin Token Creation Fee:',
    value: `${newTwinMeta?.human_readable_creation_fee} ${newTwinMeta?.creation_fee_token}`,
  },
  Number(newTwinMeta?.twin_token?.human_readable_transfer_fee) > 0 && {
    title: 'Twin Token Transfer Fee:',
    value: `${newTwinMeta?.twin_token.human_readable_transfer_fee} ${newTwinMeta?.twin_token.symbol}`,
  },
];

export const ModalStepData = new Map<number, ModalStepDataReturn>([
  [
    1,
    {
      title: 'Step 1',
      pending: 'Please approve the transaction',
      successful: 'Approved successfully',
      failed: 'Failed to approve transaction',
    },
  ],
  [
    2,
    {
      title: 'Step 2',
      pending: 'Sending transaction request to the network',
      successful: 'Sent Successfully',
      failed: 'Failed to send transaction',
    },
  ],
  [
    3,
    {
      title: 'Step 3',
      pending: 'Waiting for new twin token verification',
      successful: 'Verified successfully',
      failed: 'Failed to create new twin token',
    },
  ],
]);
