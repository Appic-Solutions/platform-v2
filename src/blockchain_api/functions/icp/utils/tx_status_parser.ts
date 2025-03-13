import { DepositStatus, RetrieveWithdrawalStatus } from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';
import { DepositTxStatus, WithdrawalTxStatus } from '../bridge_transactions';
import { EvmToIcpStatus, IcpToEvmStatus } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { RetrieveEthStatus } from '@/blockchain_api/did/dfinity_minter/dfinity_minter_types';

export const parse_icp_to_evm_tx_status = (tx_status: IcpToEvmStatus): WithdrawalTxStatus => {
  if ('Failed' in tx_status) return 'Failed';
  else if ('SignedTransaction' in tx_status) return 'SignedTransaction';
  else if ('ReplacedTransaction' in tx_status) return 'ReplacedTransaction';
  else if ('QuarantinedReimbursement' in tx_status) return 'QuarantinedReimbursement';
  else if ('PendingVerification' in tx_status) return 'PendingVerification';
  else if ('Accepted' in tx_status) return 'Accepted';
  else if ('Reimbursed' in tx_status) return 'Reimbursed';
  else if ('Successful' in tx_status) return 'Successful';
  else if ('Created' in tx_status) return 'Created';
  else return 'PendingVerification';
};

export const parse_evm_to_icp_tx_status = (tx_status: EvmToIcpStatus): DepositTxStatus => {
  if ('Invalid' in tx_status) return 'Invalid';
  else if ('PendingVerification' in tx_status) return 'PendingVerification';
  else if ('Minted' in tx_status) return 'Minted';
  else if ('Accepted' in tx_status) return 'Accepted';
  else if ('Quarantined' in tx_status) return 'Quarantined';
  else return 'PendingVerification';
};

export const parse_deposit_status_result = (tx_status: DepositStatus): DepositTxStatus => {
  if ('InvalidDeposit' in tx_status) return 'Invalid';
  else if ('Accepted' in tx_status) return 'Accepted';
  else if ('Minted' in tx_status) return 'Minted';
  else if ('Quarantined' in tx_status) return 'Quarantined';
  else return 'PendingVerification';
};

export const parse_retrieve_eth_status_result = (tx_status: RetrieveEthStatus): WithdrawalTxStatus => {
  if ('NotFound' in tx_status) return 'Failed';
  else if ('TxFinalized' in tx_status) return 'Successful';
  else if ('TxSent' in tx_status) return 'SignedTransaction';
  else if ('TxCreated' in tx_status) return 'Created';
  else if ('Pending' in tx_status) return 'Accepted';
  else return 'PendingVerification';
};

export const parse_retrieve_withdrawal_status_result = (tx_status: RetrieveWithdrawalStatus): WithdrawalTxStatus => {
  if ('NotFound' in tx_status) return 'Failed';
  else if ('TxFinalized' in tx_status) return 'Successful';
  else if ('TxSent' in tx_status) return 'SignedTransaction';
  else if ('TxCreated' in tx_status) return 'Created';
  else if ('Pending' in tx_status) return 'Accepted';
  else return 'PendingVerification';
};
