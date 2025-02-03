import { DepositTxStatus, TxHash, WithdrawalTxStatus } from '@/blockchain_api/functions/icp/bridge_transactions';
import { Response } from '@/blockchain_api/types/response';
import { WalletClient } from 'viem';

// WITHDRAWAL TX
// STEP 1
type TokenApprovalResponse = Response<string>;
// STEP 2
type SubmitWithdrawResponse = Response<string>;
// STEP 3
type NotifyAppicHelperWithdrawalResponse = Response<string>;
// STEP 4
type CheckWithdrawalStatusResponse = Response<WithdrawalTxStatus>;

// DEPOSIT TX
// STEP 1 //TODO - Define the response type
// NOTE: This API do not return response in type Response,
// it just returns a WalletClient object
type CreateWalletClientResponse = Promise<WalletClient<any>>;
// STEP 2
type DepositTokenWithApprovalResponse = Response<boolean | TxHash>;
// STEP 3
// NOTE: This API do not return response in type Response,
// it just returns a TxHash
type DepositTokenResponse = Response<TxHash>;
// STEP 4
type NotifyAppicHelperDepositResponse = Response<string>;
// STEP 5
type CheckDepositStatusResponse = Response<DepositTxStatus>;

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
