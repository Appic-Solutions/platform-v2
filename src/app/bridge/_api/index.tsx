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
  FullDepositRequest,
  FullWithdrawalRequest,
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
  DepositTxStatus,
  icrc2_approve,
  notify_appic_helper_deposit,
  notify_appic_helper_withdrawal,
  request_deposit,
  request_withdraw,
  WithdrawalTxStatus,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeLogic } from '../_logic';
import { Response } from '@/blockchain_api/types/response';

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
const useCheckWithdrawalStatus = () => {
  return useMutation({
    mutationFn: (params: CheckWithdrawalStatusRequest) =>
      check_withdraw_status(params.withdrawalId, params.bridgeOption, params.authenticatedAgent),
    onError: (error) => {
      console.error('Check withdrawal status failed:', error);
    },
    onSuccess: (data) => {
      console.log('Check withdrawal status successful:', data);
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
const useCheckDepositStatus = () => {
  return useMutation({
    mutationFn: (params: CheckDepositStatusRequest) =>
      check_deposit_status(params.tx_hash, params.bridgeOption, params.unauthenticatedAgent),
    onError: (error) => {
      console.error('Check deposit status failed:', error);
    },
    onSuccess: (data) => {
      console.log('Check deposit status successful:', data);
    },
  });
};

// Main function to handle the entire withdrawal process
const useHandleWithdrawal = () => {
  const tokenApproval = useTokenApproval();
  const submitWithdrawRequest = useSubmitWithdrawRequest();
  const notifyAppicHelper = useNotifyAppicHelper();
  const checkWithdrawalStatus = useCheckWithdrawalStatus();

  return useMutation<Response<WithdrawalTxStatus>, Error, FullWithdrawalRequest>({
    mutationFn: async (params: FullWithdrawalRequest) => {
      // Step 1: Token Approval
      const approvalResult = await tokenApproval.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
      });
      if (!approvalResult.success) throw new Error('Token approval failed');

      // Step 2: Submit Withdrawal Request
      const withdrawResponse = await submitWithdrawRequest.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
      });
      if (!withdrawResponse.success) throw new Error('Withdrawal request failed');

      // Step 3: Notify Appic Helper
      const notifyResult = await notifyAppicHelper.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
        userWalletPrincipal: params.userWalletPrincipal,
        withdrawalId: withdrawResponse.result,
      });
      if (!notifyResult.success) throw new Error('Notify Appic Helper failed');

      // Step 4: Check Withdrawal Status
      const statusResult = await checkWithdrawalStatus.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
        withdrawalId: withdrawResponse.result,
      });
      if (!statusResult.success) throw new Error('Check withdrawal status failed');

      return statusResult;
    },
  });
};

// Main function to handle the entire deposit process
const useHandleDeposit = () => {
  const createWalletClient = useCreateWalletClient();
  const depositTokenWithApproval = useDepositTokenWithApproval();
  const depositToken = useDepositToken();
  const notifyAppicHelperDeposit = useNotifyAppicHelperDeposit();
  const checkDepositStatus = useCheckDepositStatus();

  return useMutation<Response<DepositTxStatus>, Error, FullDepositRequest>({
    mutationFn: async (params: FullDepositRequest) => {
      // Step 1: Create Wallet Client
      const walletClientResult = await createWalletClient.mutateAsync(params.bridgeOption);
      if (!walletClientResult) throw new Error('Create wallet client failed');

      // Step 2: Token Approval
      const approvalResult = await depositTokenWithApproval.mutateAsync({
        bridgeOption: params.bridgeOption,
        wallet_client: walletClientResult,
      });
      if (!approvalResult.success) throw new Error('Token approval failed');

      // Step 3: Submit Deposit Request
      const depositResponse = await depositToken.mutateAsync({
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
        wallet_client: walletClientResult,
      });
      if (!depositResponse.success) throw new Error('Deposit request failed');

      // Step 4: Notify Appic Helper
      const notifyResult = await notifyAppicHelperDeposit.mutateAsync({
        bridgeOption: params.bridgeOption,
        recipientPrincipal: params.recipientPrincipal,
        unauthenticatedAgent: params.unAuthenticatedAgent,
        userWalletAddress: params.userWalletAddress,
        tx_hash: depositResponse.result,
      });
      if (!notifyResult.success) throw new Error('Notify Appic Helper failed');

      // Step 5: Check Deposit Status
      const statusResult = await checkDepositStatus.mutateAsync({
        bridgeOption: params.bridgeOption,
        unauthenticatedAgent: params.unAuthenticatedAgent,
        tx_hash: depositResponse.result,
      });
      if (!statusResult.success) throw new Error('Check deposit status failed');

      return statusResult;
    },
  });
};

export {
  useGetBridgePairs,
  useGetBridgeOptions,
  useCheckWithdrawalStatus,
  useCreateWalletClient,
  useDepositTokenWithApproval,
  useCheckDepositStatus,
  useNotifyAppicHelperDeposit,
  useDepositToken,
  useHandleWithdrawal,
  useHandleDeposit,
};
