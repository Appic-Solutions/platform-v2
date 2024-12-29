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

// WITHDRAWAL TX
// STEP 1
interface TokenApprovalRequest {
  bridge_option: BridgeOption;
  authenticated_agent: Agent;
}
// STEP 2
interface SubmitWithdrawRequest {
  bridge_option: BridgeOption;
  recipient: string;
  authenticated_agent: Agent;
}
// STEP 3
interface NotifyAppicHelperWithdrawalRequest {
  bridge_option: BridgeOption;
  withdrawal_id: string;
  recipient: string; // Destination EVM Address
  user_wallet_principal: string; //from ICP Principal Address
  authenticated_agent: Agent;
}
// STEP 4
interface CheckWithdrawalStatusRequest {
  bridge_option: BridgeOption;
  withdrawal_id: string;
  authenticated_agent: Agent;
}

// DEPOSIT TX
// STEP 1
type CreateWalletClientRequest = BridgeOption;
// STEP 2
interface DepositTokenWithApprovalRequest {
  // TODO - define type of the wallet client
  wallet_client: WalletClient<any>;
  bridge_option: BridgeOption;
}
// STEP 3
interface DepositTokenRequest {
  // TODO - define type of the wallet client
  wallet_client: WalletClient<any>;
  bridge_option: BridgeOption;
  recipient: Principal;
}
// STEP 4
interface NotifyAppicHelperDepositRequest {
  bridge_option: BridgeOption;
  tx_hash: string;
  user_wallet_address: string;
  recipient_principal: string;
  unauthenticated_agent: HttpAgent | Agent;
}
// STEP 5
interface CheckDepositStatusRequest {
  bridge_option: BridgeOption;
  tx_hash: string;
  authenticated_agent: Agent | HttpAgent;
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
};
