import { get_bridge_options } from '@/blockchain_api/functions/icp/get_bridge_options';
import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { HttpAgent } from '@dfinity/agent';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BridgeOptionsListRequest,
  CheckDepositStatusRequest,
  CheckWithdrawalStatusRequest,
  CreateWalletClientRequest,
  DepositTokenRequest,
  DepositTokenWithApprovalRequest,
  NotifyAppicHelperDepositRequest,
  NotifyAppicHelperWithdrawalRequest,
  SubmitWithdrawRequest,
  TokenApprovalRequest,
} from './types/request';
import { getBridgePairsFromLocalStorage, setBridgePairsWithTime } from '../_logic';
import {
  approve_erc20,
  check_deposit_status,
  check_withdraw_status,
  create_wallet_client,
  icrc2_approve,
  notify_appic_helper_deposit,
  notify_appic_helper_withdrawal,
  request_deposit,
  request_withdraw,
} from '@/blockchain_api/functions/icp/bridge_transactions';

const useGetBridgePairs = (agent: HttpAgent | undefined) => {
  const refetchTime = 1000 * 60 * 10;
  const fetchBridgePairs = async () => {
    const { data, lastFetchTime } = getBridgePairsFromLocalStorage();
    const currentTime = new Date().getTime();
    const timeDiff = lastFetchTime ? currentTime - lastFetchTime : Infinity;

    if (data && timeDiff < refetchTime) {
      return data;
    } else {
      if (!agent) throw new Error('Agent is not available!');

      const response = await get_bridge_pairs(agent);
      setBridgePairsWithTime(response.result);
      return response.result;
    }
  };

  return useQuery({
    queryKey: ['bridge-pairs'],
    queryFn: fetchBridgePairs,
    refetchInterval: refetchTime,
    enabled: !!agent,
  });
};

const useGetBridgeOptions = () => {
  return useMutation({
    mutationKey: ['bridge-options'],
    mutationFn: (params: BridgeOptionsListRequest) =>
      get_bridge_options(params.from_token, params.to_token, params.amount, params.agent, params.bridge_pairs),
  });
};

// Approval
// Step 1
const useGetTokenApproval = () => {
  return useMutation({
    mutationFn: (params: TokenApprovalRequest) => icrc2_approve(params.bridge_option, params.authenticated_agent),
  });
};

// Step 2
const useGetRequestWithdraw = () => {
  return useMutation({
    mutationFn: (params: SubmitWithdrawRequest) =>
      request_withdraw(params.bridge_option, params.recipient, params.authenticated_agent),
  });
};

// Step 3
const useNotifyAppicHelperWithdrawal = () => {
  return useMutation({
    mutationFn: (params: NotifyAppicHelperWithdrawalRequest) =>
      notify_appic_helper_withdrawal(
        params.bridge_option,
        params.withdrawal_id,
        params.recipient,
        params.user_wallet_principal,
        params.authenticated_agent,
      ),
  });
};

// Step 4
const useCheckWithdrawalStatus = () => {
  return useMutation({
    mutationFn: (params: CheckWithdrawalStatusRequest) =>
      check_withdraw_status(params.withdrawal_id, params.bridge_option, params.authenticated_agent),
  });
};

// DEPOSIT
// Step 1
const useCreateWalletClient = () => {
  return useMutation({
    mutationFn: (params: CreateWalletClientRequest) => create_wallet_client(params),
  });
};

// Step 2
const useDepositTokenWithApproval = () => {
  return useMutation({
    mutationFn: (params: DepositTokenWithApprovalRequest) => approve_erc20(params.wallet_client, params.bridge_option),
  });
};

// Step 3
const useDepositToken = () => {
  return useMutation({
    mutationFn: (params: DepositTokenRequest) =>
      request_deposit(params.wallet_client, params.bridge_option, params.recipient),
  });
};

// Step 4
const useNotifyAppicHelperDeposit = () => {
  return useMutation({
    mutationFn: (params: NotifyAppicHelperDepositRequest) =>
      notify_appic_helper_deposit(
        params.bridge_option,
        params.tx_hash,
        params.user_wallet_address,
        params.recipient_principal,
        params.unauthenticated_agent,
      ),
  });
};

// Step 5
const useCheckDepositStatus = () => {
  return useMutation({
    mutationFn: (params: CheckDepositStatusRequest) =>
      check_deposit_status(params.tx_hash, params.bridge_option, params.unauthenticated_agent),
  });
};

export {
  useGetBridgePairs,
  useGetBridgeOptions,
  useGetTokenApproval,
  useGetRequestWithdraw,
  useNotifyAppicHelperWithdrawal,
  useCheckWithdrawalStatus,
  useCreateWalletClient,
  useDepositTokenWithApproval,
  useCheckDepositStatus,
  useNotifyAppicHelperDeposit,
  useDepositToken,
};
