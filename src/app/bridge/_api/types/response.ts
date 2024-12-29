import { DepositTxStatus, TxHash, WithdrawalTxStatus } from '@/blockchain_api/functions/icp/bridge_transactions';
import { WalletClient } from 'viem';

// WITHDRAWAL TX
// STEP 1
type TokenApprovalResponse = string;
// STEP 2
type SubmitWithdrawResponse = string;
// STEP 3
type NotifyAppicHelperWithdrawalResponse = string;
// STEP 4
type CheckWithdrawalStatusResponse = WithdrawalTxStatus;

// DEPOSIT TX
// STEP 1 //TODO - Define the response type
// NOTE: This API do not return response in type Response,
// it just returns a WalletClient object
type CreateWalletClientResponse = Promise<WalletClient<any>>;
// STEP 2
type DepositTokenWithApprovalResponse = boolean | TxHash;
// STEP 3
// NOTE: This API do not return response in type Response,
// it just returns a TxHash
type DepositTokenResponse = TxHash;
// STEP 4
type NotifyAppicHelperDepositResponse = string;
// STEP 5
type CheckDepositStatusResponse = DepositTxStatus;

export type {
  TokenApprovalResponse,
  SubmitWithdrawResponse,
  NotifyAppicHelperWithdrawalResponse,
  CheckWithdrawalStatusResponse,
  CreateWalletClientResponse,
  DepositTokenWithApprovalResponse,
  DepositTokenResponse,
  NotifyAppicHelperDepositResponse,
  CheckDepositStatusResponse,
};
