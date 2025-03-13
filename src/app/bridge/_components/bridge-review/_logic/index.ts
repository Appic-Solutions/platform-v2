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
import { setPendingTransactionToSession } from '@/lib/helpers/session';
import { useSharedStore } from '@/store/store';
import { Principal } from '@dfinity/principal';

const BridgeReviewLogic = () => {
  const { fromToken, amount, selectedOption, toWalletAddress, toWalletValidationError } = useBridgeStore();

  // Bridge Actions
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

  // Shared Store
  const { icpIdentity, authenticatedAgent, unAuthenticatedAgent, evmAddress } = useSharedStore();

  // deposit queries ====================>
  const createWalletClient = useCreateWalletClient();
  const depositTokenWithApproval = useDepositTokenWithApproval();
  const depositToken = useDepositToken();
  const notifyAppicHelperDeposit = useNotifyAppicHelperDeposit();

  // withdrawal queries =====================>
  const tokenApproval = useTokenApproval();
  const submitWithdrawRequest = useSubmitWithdrawRequest();
  const notifyAppicHelper = useNotifyAppicHelper();

  async function executeWithdrawal(params: FullWithdrawalRequest) {
    if (selectedOption && authenticatedAgent && unAuthenticatedAgent) {
      // Step 1: Token Approval
      // set step status pending
      const approvalResult = await tokenApproval.mutateAsync({
        bridgeOption: selectedOption,
        authenticatedAgent,
        unAuthenticatedAgent: unAuthenticatedAgent,
      });
      if (!approvalResult.success) {
        // set step status failed
        setTxErrorMessage(approvalResult.message);
        setTxStep({
          count: 1,
          status: 'failed',
        });
        return approvalResult.message;
      }
      // set step status success
      setTxStep({
        count: 2,
        status: 'pending',
      });

      // Step 2: Submit Withdrawal Request
      const withdrawResponse = await submitWithdrawRequest.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
      });
      if (!withdrawResponse.success) {
        setTxErrorMessage(withdrawResponse.message);
        setTxStep({
          count: 2,
          status: 'failed',
        });
        return withdrawResponse.message;
      }
      setPendingTransactionToSession({
        bridge_option: params.bridgeOption,
        id: withdrawResponse.result,
      });
      setPendingTx({
        bridge_option: params.bridgeOption,
        id: withdrawResponse.result,
      });
      setWithdrawalId(withdrawResponse.result);
      setTxStep({
        count: 3,
        status: 'pending',
      });

      // Step 3: Notify Appic Helper
      const notifyResult = await notifyAppicHelper.mutateAsync({
        unAuthenticatedAgent: params.unAuthenticatedAgent,
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
        userWalletPrincipal: params.userWalletPrincipal,
        withdrawalId: withdrawResponse.result,
      });
      if (!notifyResult.success) {
        setTxErrorMessage(notifyResult.message);
        setTxStep({
          count: 3,
          status: 'failed',
        });
        return notifyResult.message;
      }

      setTxStep({
        count: 4,
        status: 'pending',
      });
    }
  }

  async function executeDeposit(params: FullDepositRequest) {
    // Step 1: Create Wallet Client

    const walletClientResult = await createWalletClient.mutateAsync(params.bridgeOption);
    setTxErrorMessage('');
    if (!walletClientResult) {
      setTxStep({
        count: 1,
        status: 'failed',
      });
      return;
    }
    setTxStep({
      count: 2,
      status: 'pending',
    });
    // Step 2: Token Approval
    const approvalResult = await depositTokenWithApproval.mutateAsync({
      bridgeOption: params.bridgeOption,
      wallet_client: walletClientResult,
    });
    if (!approvalResult.success) {
      setTxErrorMessage(approvalResult.message);
      setTxStep({
        count: 2,
        status: 'failed',
      });
      return approvalResult.message;
    }
    setTxStep({
      count: 3,
      status: 'pending',
    });
    // Step 3: Submit Deposit Request
    const depositResponse = await depositToken.mutateAsync({
      bridgeOption: params.bridgeOption,
      recipient: params.recipient,
      wallet_client: walletClientResult,
    });
    if (!depositResponse.success) {
      setTxErrorMessage(depositResponse.message);
      setTxStep({
        count: 3,
        status: 'failed',
      });
      return depositResponse.message;
    }
    setPendingTransactionToSession({
      bridge_option: params.bridgeOption,
      id: depositResponse.result,
    });
    setPendingTx({
      bridge_option: params.bridgeOption,
      id: depositResponse.result,
    });
    setTxHash(depositResponse.result);
    setTxStep({
      count: 4,
      status: 'pending',
    });
    // Step 4: Notify Appic Helper
    const notifyResult = await notifyAppicHelperDeposit.mutateAsync({
      bridgeOption: params.bridgeOption,
      recipientPrincipal: params.recipientPrincipal,
      unauthenticatedAgent: params.unAuthenticatedAgent,
      userWalletAddress: params.userWalletAddress,
      tx_hash: depositResponse.result,
    });
    if (!notifyResult.success) {
      setTxErrorMessage(notifyResult.message);
      setTxStep({
        count: 4,
        status: 'failed',
      });
      return notifyResult.message;
    }

    setTxStep({
      count: 5,
      status: 'pending',
    });
  }

  function executeTransaction() {
    //  1. Withdrawal Transactions (ICP -> EVM)
    // recipient should be evmAddress or toWalletAddress
    //  2. Deposit Transactions (EVM -> ICP)
    // recipient should be icpIdentity.getPrincipal() or toWalletAddress
    setTxErrorMessage('');
    setTxHash(undefined);
    setWithdrawalId(undefined);
    setTxStep({ count: 1, status: 'pending' });

    if (selectedOption && unAuthenticatedAgent && amount) {
      if (fromToken?.chain_type === 'ICP' && authenticatedAgent && icpIdentity) {
        executeWithdrawal({
          bridgeOption: selectedOption,
          authenticatedAgent,
          unAuthenticatedAgent,
          recipient: toWalletAddress || evmAddress || '', // destination wallet EVM address
          userWalletPrincipal: icpIdentity.getPrincipal().toString(), // source wallet Principal ID
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
    }
  }

  function resetTransaction() {
    setTxStep({
      count: 1,
      status: 'pending',
    });
    setTxErrorMessage(undefined);
    setActiveStep(1);
    setAmount('');
    setToWalletAddress('');
    setTxHash(undefined);
    setWithdrawalId(undefined);
  }

  return {
    executeTransaction,
    resetTransaction,
  };
};

export default BridgeReviewLogic;
