import { get_bridge_options } from '@/blockchain_api/functions/icp/get_bridge_options';
import { get_bridge_pairs } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { HttpAgent } from '@dfinity/agent';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BridgeOptionsListRequest,
  CreateWalletClientRequest,
  DepositTokenRequest,
  DepositTokenWithApprovalRequest,
  NotifyAppicHelperDepositRequest,
  NotifyAppicHelperWithdrawalRequest,
  SubmitWithdrawRequest,
  TokenApprovalRequest,
} from './types/request';

import {
  approve_erc20,
  create_wallet_client,
  icrc2_approve,
  notify_appic_helper_deposit,
  notify_appic_helper_withdrawal,
  request_deposit,
  request_withdraw,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeLogic } from '../_logic';

const useGetBridgePairs = (agent: HttpAgent | undefined) => {
  const { getBridgePairsFromLocalStorage, setBridgePairsWithTime } = BridgeLogic();
  const refetchTime = 1000 * 60 * 10;
  const fetchBridgePairs = async () => {
    const { data, lastFetchTime } = getBridgePairsFromLocalStorage();
    const currentTime = new Date().getTime();
    const timeDiff = lastFetchTime ? currentTime - lastFetchTime : Infinity;

    if (data && data.length > 0 && timeDiff < refetchTime) {
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

// WITHDRAWAL TX ====================>
// Step 1: Token Approval
const useTokenApproval = () => {
  return useMutation({
    mutationFn: (params: TokenApprovalRequest) =>
      icrc2_approve(params.bridgeOption, params.authenticatedAgent, params.unAuthenticatedAgent),
    onError: (error) => {
      console.error('Token approval failed:', error);
    },
  });
};

// Step 2: Submit Withdrawal Request
const useSubmitWithdrawRequest = () => {
  return useMutation({
    mutationFn: (params: SubmitWithdrawRequest) =>
      request_withdraw(params.bridgeOption, params.recipient, params.authenticatedAgent),
    onError: (error) => {
      console.error('Withdrawal request failed:', error);
    },
  });
};

// Step 3: Notify Appic Helper
const useNotifyAppicHelper = () => {
  return useMutation({
    mutationFn: (params: NotifyAppicHelperWithdrawalRequest) =>
      notify_appic_helper_withdrawal(
        params.bridgeOption,
        params.withdrawalId,
        params.recipient,
        params.userWalletPrincipal,
        params.unAuthenticatedAgent,
      ),
    onError: (error) => {
      console.error('Notify Appic Helper failed:', error);
    },
  });
};

// DEPOSIT
// Step 1: Create Wallet Client
const useCreateWalletClient = () => {
  return useMutation({
    mutationFn: (params: CreateWalletClientRequest) => create_wallet_client(params),
    onError: (error) => {
      console.error('Create wallet client failed:', error);
    },
  });
};

// Step 2: Token Approval
const useDepositTokenWithApproval = () => {
  return useMutation({
    mutationFn: (params: DepositTokenWithApprovalRequest) => approve_erc20(params.wallet_client, params.bridgeOption),
    onError: (error) => {
      console.error('Token approval failed:', error);
    },
  });
};

// Step 3: Submit Deposit Request
const useDepositToken = () => {
  return useMutation({
    mutationFn: (params: DepositTokenRequest) =>
      request_deposit(params.wallet_client, params.bridgeOption, params.recipient),
    onError: (error) => {
      console.error('Deposit request failed:', error);
    },
  });
};

// Step 4: Notify Appic Helper
const useNotifyAppicHelperDeposit = () => {
  return useMutation({
    mutationFn: (params: NotifyAppicHelperDepositRequest) =>
      notify_appic_helper_deposit(
        params.bridgeOption,
        params.tx_hash,
        params.userWalletAddress,
        params.recipientPrincipal,
        params.unauthenticatedAgent,
      ),
    onError: (error) => {
      console.error('Notify Appic Helper failed:', error);
    },
  });
};

export {
  useGetBridgePairs,
  useGetBridgeOptions,
  useCreateWalletClient,
  useDepositTokenWithApproval,
  useNotifyAppicHelperDeposit,
  useDepositToken,
  useTokenApproval,
  useSubmitWithdrawRequest,
  useNotifyAppicHelper,
};
