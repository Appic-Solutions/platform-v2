import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useCreateWalletClient,
  useDepositToken,
  useDepositTokenWithApproval,
  useNotifyAppicHelper,
  useNotifyAppicHelperDeposit,
  useSubmitWithdrawRequest,
  useTokenApproval,
} from '@/app/bridge/_api';
import { FullDepositRequest, FullWithdrawalRequest } from '@/app/bridge/_api/types/request';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import { check_deposit_status, check_withdraw_status } from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { setPendingTransactionToSession } from '@/lib/helpers/session';
import { useSharedStore } from '@/store/store';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Reusable transaction status polling hook
const useTransactionStatus = () => {
  const queryClient = useQueryClient();
  const { txHash, withdrawalId, selectedOption } = useBridgeStore();
  const { setTxStep } = useBridgeActions();
  const { unAuthenticatedAgent } = useSharedStore();

  useQuery({
    queryKey: ['check-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        txHash as `0x${string}`,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        setTxStep({
          count: 5,
          status:
            res.result === 'Minted'
              ? 'successful'
              : res.result === 'Invalid' || res.result === 'Quarantined'
                ? 'failed'
                : 'pending',
        });
      } else {
        setTxStep({ count: 5, status: 'failed' });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled: !!txHash && !!unAuthenticatedAgent && !!selectedOption,
  });

  useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        withdrawalId as string,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        setTxStep({
          count: 4,
          status:
            res.result === 'Successful'
              ? 'successful'
              : res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed'
                ? 'failed'
                : 'pending',
        });
      } else {
        setTxStep({ count: 4, status: 'failed' });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history', 'fetch-wallet-balances'] });
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled: !!withdrawalId && !!selectedOption && !!unAuthenticatedAgent,
  });
};

export const useBridgeReviewLogic = () => {
  const {
    fromToken,
    amount,
    selectedOption,
    toWalletAddress,
    txHash,
    withdrawalId,
    pendingTx,
    toWalletValidationError,
  } = useBridgeStore();
  const {
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setPendingTx,
    setToWalletAddress,
    setWithdrawalId,
    setTxHash,
  } = useBridgeActions();
  const { icpIdentity, authenticatedAgent, unAuthenticatedAgent, evmAddress } = useSharedStore();

  // Mutations
  const createWalletClient = useCreateWalletClient();
  const depositTokenWithApproval = useDepositTokenWithApproval();
  const depositToken = useDepositToken();
  const notifyAppicHelperDeposit = useNotifyAppicHelperDeposit();
  const tokenApproval = useTokenApproval();
  const submitWithdrawRequest = useSubmitWithdrawRequest();
  const notifyAppicHelper = useNotifyAppicHelper();

  // Poll transaction status
  useTransactionStatus();

  const executeWithdrawal = async (params: FullWithdrawalRequest): Promise<string | void> => {
    if (!selectedOption || !authenticatedAgent || !unAuthenticatedAgent) return;

    setTxStep({ count: 1, status: 'pending' });
    const approvalResult = await tokenApproval.mutateAsync({
      bridgeOption: selectedOption,
      authenticatedAgent,
      unAuthenticatedAgent,
    });
    if (!approvalResult.success) {
      setTxErrorMessage(approvalResult.message);
      setTxStep({ count: 1, status: 'failed' });
      return approvalResult.message;
    }

    setTxStep({ count: 2, status: 'pending' });
    const withdrawResponse = await submitWithdrawRequest.mutateAsync({
      authenticatedAgent: params.authenticatedAgent,
      bridgeOption: params.bridgeOption,
      recipient: params.recipient,
    });
    if (!withdrawResponse.success) {
      setTxErrorMessage(withdrawResponse.message);
      setTxStep({ count: 2, status: 'failed' });
      return withdrawResponse.message;
    }
    setPendingTransactionToSession({ bridge_option: params.bridgeOption, id: withdrawResponse.result });
    setPendingTx({ bridge_option: params.bridgeOption, id: withdrawResponse.result });
    setWithdrawalId(withdrawResponse.result);
    setTxStep({ count: 3, status: 'pending' });

    const notifyResult = await notifyAppicHelper.mutateAsync({
      unAuthenticatedAgent: params.unAuthenticatedAgent,
      bridgeOption: params.bridgeOption,
      recipient: params.recipient,
      userWalletPrincipal: params.userWalletPrincipal,
      withdrawalId: withdrawResponse.result,
    });
    if (!notifyResult.success) {
      setTxErrorMessage(notifyResult.message);
      setTxStep({ count: 3, status: 'failed' });
      return notifyResult.message;
    }
    setTxStep({ count: 4, status: 'pending' });
  };

  const executeDeposit = async (params: FullDepositRequest): Promise<string | void> => {
    setTxStep({ count: 1, status: 'pending' });
    const walletClientResult = await createWalletClient.mutateAsync(params.bridgeOption);
    if (!walletClientResult) {
      setTxStep({ count: 1, status: 'failed' });
      return 'Wallet client creation failed';
    }

    setTxStep({ count: 2, status: 'pending' });
    const approvalResult = await depositTokenWithApproval.mutateAsync({
      bridgeOption: params.bridgeOption,
      wallet_client: walletClientResult,
    });
    if (!approvalResult.success) {
      setTxErrorMessage(approvalResult.message);
      setTxStep({ count: 2, status: 'failed' });
      return approvalResult.message;
    }

    setTxStep({ count: 3, status: 'pending' });
    const depositResponse = await depositToken.mutateAsync({
      bridgeOption: params.bridgeOption,
      recipient: params.recipient,
      wallet_client: walletClientResult,
    });
    if (!depositResponse.success) {
      setTxErrorMessage(depositResponse.message);
      setTxStep({ count: 3, status: 'failed' });
      return depositResponse.message;
    }
    setPendingTransactionToSession({ bridge_option: params.bridgeOption, id: depositResponse.result });
    setPendingTx({ bridge_option: params.bridgeOption, id: depositResponse.result });
    setTxHash(depositResponse.result);
    setTxStep({ count: 4, status: 'pending' });

    const notifyResult = await notifyAppicHelperDeposit.mutateAsync({
      bridgeOption: params.bridgeOption,
      recipientPrincipal: params.recipientPrincipal,
      unauthenticatedAgent: params.unAuthenticatedAgent,
      userWalletAddress: params.userWalletAddress,
      tx_hash: depositResponse.result,
    });
    if (!notifyResult.success) {
      setTxErrorMessage(notifyResult.message);
      setTxStep({ count: 4, status: 'failed' });
      return notifyResult.message;
    }
    setTxStep({ count: 5, status: 'pending' });
  };

  const executeTransaction = () => {
    setTxErrorMessage('');
    setTxHash(undefined);
    setTxStep({ count: 1, status: 'pending' });

    if (!selectedOption || !unAuthenticatedAgent || !amount) return;

    if (fromToken?.chain_type === 'ICP' && authenticatedAgent && icpIdentity) {
      executeWithdrawal({
        bridgeOption: selectedOption,
        authenticatedAgent,
        unAuthenticatedAgent,
        recipient: toWalletAddress || evmAddress || '',
        userWalletPrincipal: icpIdentity.getPrincipal().toString(),
      });
    } else if (fromToken?.chain_type === 'EVM') {
      if (toWalletAddress.length > 0 && !toWalletValidationError) {
        executeDeposit({
          bridgeOption: selectedOption,
          unAuthenticatedAgent,
          recipient: Principal.fromText(toWalletAddress), // destination wallet Principal
          recipientPrincipal: toWalletAddress || icpIdentity?.getPrincipal().toString() || '', // destination wallet principal ID
          userWalletAddress: evmAddress || '', // source wallet EVM address
        });
      } else if (icpIdentity) {
        executeDeposit({
          bridgeOption: selectedOption,
          unAuthenticatedAgent,
          recipient: icpIdentity?.getPrincipal(), // destination wallet Principal
          recipientPrincipal: toWalletAddress || icpIdentity?.getPrincipal().toString() || '', // destination wallet principal ID
          userWalletAddress: evmAddress || '', // source wallet EVM address
        });
      }
    }
  };

  const resetTransaction = () => {
    setTxStep({ count: 1, status: 'pending' });
    setTxErrorMessage(undefined);
    setActiveStep(1);
    setAmount('');
    setToWalletAddress('');
  };

  return { executeTransaction, resetTransaction, txHash, withdrawalId, pendingTx };
};

export default useBridgeReviewLogic;
