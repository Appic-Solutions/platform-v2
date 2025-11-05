import { TxHash } from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { WalletClient } from 'viem';

interface BridgeOptionsListRequest {
  from_token: EvmToken | IcpToken;
  to_token: EvmToken | IcpToken;
  amount: string;
  agent: HttpAgent;
  bridge_pairs: (EvmToken | IcpToken)[];
}

// WITHDRAWAL TX ====================>
// STEP 1
interface TokenApprovalRequest {
  bridgeOption: BridgeOption;
  authenticatedAgent: Agent;
  unAuthenticatedAgent: HttpAgent;
}
// STEP 2
interface SubmitWithdrawRequest {
  bridgeOption: BridgeOption;
  recipient: string;
  authenticatedAgent: Agent;
}
// STEP 3
interface NotifyAppicHelperWithdrawalRequest {
  bridgeOption: BridgeOption;
  withdrawalId: string;
  recipient: string; // Destination EVM Address
  userWalletPrincipal: string; //from ICP Principal Address
  unAuthenticatedAgent: HttpAgent;
}
// STEP 4
interface CheckWithdrawalStatusRequest {
  bridgeOption?: BridgeOption;
  withdrawalId?: string;
  authenticatedAgent?: Agent;
}

// DEPOSIT TX
// STEP 1
type CreateWalletClientRequest = BridgeOption;
// STEP 2
interface DepositTokenWithApprovalRequest {
  wallet_client: WalletClient<any>;
  bridgeOption: BridgeOption;
}
// STEP 3
interface DepositTokenRequest {
  wallet_client: WalletClient<any>;
  bridgeOption: BridgeOption;
  recipient: Principal;
}
// STEP 4
interface NotifyAppicHelperDepositRequest {
  bridgeOption: BridgeOption;
  tx_hash: string;
  userWalletAddress: string;
  recipientPrincipal: string;
  unauthenticatedAgent: HttpAgent;
}
// STEP 5
interface CheckDepositStatusRequest {
  bridgeOption: BridgeOption;
  tx_hash: TxHash;
  unauthenticatedAgent: Agent | HttpAgent;
}

interface FullDepositRequest {
  bridgeOption: BridgeOption;
  recipient: Principal; // Destination Principal Address
  userWalletAddress: string;
  recipientPrincipal: string;
  unAuthenticatedAgent: HttpAgent;
}

interface FullWithdrawalRequest {
  bridgeOption: BridgeOption;
  authenticatedAgent: Agent;
  recipient: string; // Destination EVM Address
  userWalletPrincipal: string; //from ICP Principal Address
  unAuthenticatedAgent: HttpAgent;
}

export type {
  BridgeOptionsListRequest,
  TokenApprovalRequest,
  SubmitWithdrawRequest,
  NotifyAppicHelperWithdrawalRequest,
  CheckWithdrawalStatusRequest,
  CreateWalletClientRequest,
  DepositTokenWithApprovalRequest,
  DepositTokenRequest,
  NotifyAppicHelperDepositRequest,
  CheckDepositStatusRequest,
  FullWithdrawalRequest,
  FullDepositRequest,
};
