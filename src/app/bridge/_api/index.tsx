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
import { BridgeLogic } from '../_logic';
import { useBridgeActions } from '../_store';
// import { Principal } from '@dfinity/principal';
// import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
// import { get_transaction_history } from '@/blockchain_api/functions/icp/get_bridge_history';

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
    mutationFn: (params: TokenApprovalRequest) => icrc2_approve(params.bridgeOption, params.authenticatedAgent),
    onError: (error) => {
      console.error('Token approval failed:', error);
    },
    onSuccess: (data) => {
      console.log('Token approval successful:', data);
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
    onSuccess: (data) => {
      console.log('Withdrawal request successful:', data);
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
        params.authenticatedAgent,
      ),
    onError: (error) => {
      console.error('Notify Appic Helper failed:', error);
    },
    onSuccess: (data) => {
      console.log('Notify Appic Helper successful:', data);
    },
  });
};

// Step 4: Check Withdrawal Status
const useCheckWithdrawalStatus = ({ authenticatedAgent, bridgeOption, withdrawalId }: CheckWithdrawalStatusRequest) => {
  const { setTxStatus } = useBridgeActions();
  return useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: () => {
      if (authenticatedAgent && bridgeOption && withdrawalId) {
        check_withdraw_status(withdrawalId, bridgeOption, authenticatedAgent).then((res) => {
          setTxStatus(res.result);
        });
      }
    },
    // enabled: !!params,
    refetchInterval: 1000 * 60,
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
    onSuccess: (data) => {
      console.log('Create wallet client successful:', data);
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
    onSuccess: (data) => {
      console.log('Token approval successful:', data);
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
    onSuccess: (data) => {
      console.log('Deposit request successful:', data);
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
    onSuccess: (data) => {
      console.log('Notify Appic Helper successful:', data);
    },
  });
};

// Step 5: Check Deposit Status
// This function should be called internally until the transaction status is either "Minted" or "Invalid" or "Quarantined"
const useCheckDepositStatus = (params: CheckDepositStatusRequest) => {
  return useQuery({
    queryKey: ['check-deposit-status'],
    queryFn: () => check_deposit_status(params.tx_hash, params.bridgeOption, params.unauthenticatedAgent),
    refetchInterval: 1000 * 30,
    enabled: !!params,
  });
};

// temp
// NOTE: It will be deleted
// export interface GetBridgeHistory {
//   evm_wallet_address: string | undefined;
//   principal_id: Principal | undefined;
//   unauthenticated_agent: HttpAgent;
//   bridge_tokens: (EvmToken | IcpToken)[];
// }
// const useGetHistory = (params: GetBridgeHistory) => {
// console.log(params);
// return useQuery({
//   queryKey: ['bridge-history'],
//   queryFn: () =>
//     get_transaction_history(
//       params.evm_wallet_address,
//       params.principal_id,
//       params.unauthenticated_agent,
//       params.bridge_tokens,
//     ),
//   enabled:
//     !!params.bridge_tokens &&
//     (!!params.evm_wallet_address || !!params.principal_id) &&
//     !!params.unauthenticated_agent,
//   refetchInterval: 1000 * 5,
// });
// };
// temp
export {
  useGetBridgePairs,
  useGetBridgeOptions,
  useCheckWithdrawalStatus,
  useCreateWalletClient,
  useDepositTokenWithApproval,
  useCheckDepositStatus,
  useNotifyAppicHelperDeposit,
  useDepositToken,
  useTokenApproval,
  useSubmitWithdrawRequest,
  useNotifyAppicHelper,
  // useGetHistory,
};
