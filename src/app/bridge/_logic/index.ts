import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/common/helpers/localstorage';
import { TokenType, useBridgeActions, useBridgeStore } from '../_store';
import { useSharedStore } from '@/common/state/store';
import {
  useCreateWalletClient,
  useDepositToken,
  useDepositTokenWithApproval,
  useNotifyAppicHelper,
  useNotifyAppicHelperDeposit,
  useSubmitWithdrawRequest,
  useTokenApproval,
} from '../_api';
import { FullDepositRequest, FullWithdrawalRequest } from '../_api/types/request';
import { useState } from 'react';
import {
  check_deposit_status,
  check_withdraw_status,
  TxHash,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { useQuery } from '@tanstack/react-query';

export const BridgeLogic = () => {
  // Bridge Store
  const { selectedTokenType, fromToken, toToken, activeStep, amount, selectedOption } = useBridgeStore();
  // Bridge Actions
  const { setFromToken, setToToken, setAmount, setActiveStep, setTxStep, setTxStatus } = useBridgeActions();
  // Shared Store
  const {
    icpIdentity,
    isEvmConnected,
    evmBalance,
    icpBalance,
    authenticatedAgent,
    isEvmBalanceLoading,
    isIcpBalanceLoading,
    unAuthenticatedAgent,
  } = useSharedStore();

  // Bridge Transaction states

  const [txHash, setTxHash] = useState<TxHash | undefined>();
  const [withdrawalId, setWithdrawalId] = useState<string | undefined>();
  // deposit queries ====================>
  const createWalletClient = useCreateWalletClient();
  const depositTokenWithApproval = useDepositTokenWithApproval();
  const depositToken = useDepositToken();
  const notifyAppicHelperDeposit = useNotifyAppicHelperDeposit();
  // check withdrawal tx status
  useQuery({
    queryKey: ['check-deposit-status'],
    queryFn: async () => {
      if (txHash && unAuthenticatedAgent && selectedOption) {
        const res = await check_deposit_status(txHash, selectedOption, unAuthenticatedAgent);
        if (res.success) {
          if (res.result === 'Minted') {
            setTxStatus('successful');
          } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
            setTxStatus('failed');
          } else {
            setTxStatus('pending');
          }
          setTxStep({
            count: 4,
            status: 'successful',
          });
        } else if (!res.success) {
          setTxStep({
            count: 4,
            status: 'failed',
          });
        }
        return res;
      }
      return null;
    },
    refetchInterval: 1000 * 30,
  });
  // withdrawal queries =====================>
  const tokenApproval = useTokenApproval();
  const submitWithdrawRequest = useSubmitWithdrawRequest();
  const notifyAppicHelper = useNotifyAppicHelper();
  // check withdrawal tx status
  useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: async () => {
      if (authenticatedAgent && selectedOption && withdrawalId) {
        const res = await check_withdraw_status(withdrawalId, selectedOption, authenticatedAgent);
        if (res.success) {
          if (res.result === 'Successful') {
            setTxStatus('successful');
          } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
            setTxStatus('failed');
          } else {
            setTxStatus('pending');
          }
          setTxStep({
            count: 5,
            status: 'successful',
          });
        } else if (!res.success) {
          setTxStep({
            count: 5,
            status: 'failed',
          });
        }
        return res || null;
      }
      return null;
    },
    refetchInterval: 1000 * 60,
  });

  // select token function in chain token list
  function selectToken(token: EvmToken | IcpToken) {
    const setToken = selectedTokenType === 'from' ? setFromToken : setToToken;
    if (fromToken && toToken) {
      setFromToken(undefined);
      setToToken(undefined);
      setAmount('');
    }
    setToken(token);
  }

  function changeStep(direction: 'next' | 'prev' | number) {
    const currentStep = typeof direction === 'number' ? direction : activeStep;
    if (direction === 'next') {
      setActiveStep(currentStep + 1);
    } else if (direction === 'prev') {
      setActiveStep(currentStep - 1);
    } else {
      setActiveStep(direction);
    }
  }

  function swapTokens() {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  }

  const isWalletConnected = (type: 'from' | 'to') => {
    let mainToken: TokenType | undefined;
    if (type === 'from') mainToken = fromToken;
    if (type === 'to') mainToken = toToken;

    if (mainToken) {
      if (mainToken?.chain_type === 'EVM' && isEvmConnected && evmBalance) {
        return true;
      }
      if (mainToken?.chain_type === 'ICP' && icpIdentity && icpBalance) {
        return true;
      }
      return false;
    }
    return false;
  };

  function getStatusMessage({
    showWalletAddress,
    toWalletValidationError,
    toWalletAddress,
  }: {
    showWalletAddress: boolean;
    toWalletValidationError: string | null;
    toWalletAddress: string;
  }) {
    if (!fromToken || !toToken) return 'Select token to bridge';

    if (isEvmBalanceLoading || isIcpBalanceLoading) return 'Fetching wallet balance';

    // avoid to select same tokens
    if (
      fromToken &&
      toToken &&
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    ) {
      return 'Please select different tokens';
    }

    if (!Number(amount)) return 'Set token amount to continue';

    if (!selectedOption) return 'Select Bridge Option';

    if (!isWalletConnected('from')) {
      return `Connect ${fromToken.chain_type} Wallet`;
    }

    if (showWalletAddress) {
      return !toWalletAddress || toWalletValidationError ? 'Enter Valid Address' : 'Review Bridge';
    }

    if (!showWalletAddress && !isWalletConnected('to')) {
      return `Connect ${toToken.chain_type} Wallet`;
    }

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;

    if (isDestWalletValid && isWalletConnected('from')) {
      return 'Review Bridge';
    }

    if ((isWalletConnected('from'), isWalletConnected('to'))) {
      return 'Review Bridge';
    }
  }

  function isTokenSelected(token: TokenType) {
    if (selectedTokenType === 'from' && fromToken) {
      if (fromToken?.chain_type === 'ICP') {
        return fromToken.canisterId === token.canisterId;
      }
      return fromToken?.contractAddress === token.contractAddress;
    } else if (selectedTokenType === 'to' && toToken) {
      if (toToken?.chain_type === 'ICP') {
        return toToken.canisterId === token.canisterId;
      }
      return toToken?.contractAddress === token.contractAddress;
    }
    return false;
  }

  // set data and last fetch time in localstorage
  const setBridgePairsWithTime = (data: (EvmToken | IcpToken)[]) => {
    const currentTime = new Date().getTime();
    setStorageItem('bridge-pairs', JSON.stringify(data));
    setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
  };

  // get data and last fetch time from localstorage
  const getBridgePairsFromLocalStorage = () => {
    const rawData = getStorageItem('bridge-pairs');
    const lastFetchTime = getStorageItem('bridge-pairs-last-fetch-time');
    let parsedData: (EvmToken | IcpToken)[] | null = null;
    try {
      if (rawData?.length && rawData?.length > 0) {
        const data = JSON.parse(rawData);
        if (Array.isArray(data)) {
          parsedData = data as (EvmToken | IcpToken)[];
        }
      }
    } catch (error) {
      console.error('Invalid data format in localStorage:', error);
    }

    return {
      data: parsedData,
      lastFetchTime: lastFetchTime ? parseInt(lastFetchTime) : null,
    };
  };

  //  1. Withdrawal Transactions (ICP -> EVM)
  //  2. Deposit Transactions (EVM -> ICP)

  const executeWithdrawal = async (params: FullWithdrawalRequest) => {
    if (selectedOption && authenticatedAgent) {
      // Step 1: Token Approval
      // set step status pending
      const approvalResult = await tokenApproval.mutateAsync({
        bridgeOption: selectedOption,
        authenticatedAgent,
      });
      if (!approvalResult.success) {
        // set step status failed
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
        setTxStep({
          count: 2,
          status: 'failed',
        });
        return withdrawResponse.message;
      }
      setWithdrawalId(withdrawResponse.result);
      setTxStep({
        count: 3,
        status: 'pending',
      });

      // Step 3: Notify Appic Helper
      const notifyResult = await notifyAppicHelper.mutateAsync({
        authenticatedAgent: params.authenticatedAgent,
        bridgeOption: params.bridgeOption,
        recipient: params.recipient,
        userWalletPrincipal: params.userWalletPrincipal,
        withdrawalId: withdrawResponse.result,
      });
      if (!notifyResult.success) {
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
  };

  const executeDeposit = async (params: FullDepositRequest) => {
    // Step 1: Create Wallet Client
    // debugger;
    const walletClientResult = await createWalletClient.mutateAsync(params.bridgeOption);
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
      setTxStep({
        count: 3,
        status: 'failed',
      });
      return depositResponse.message;
    }
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
  };

  return {
    selectToken,
    changeStep,
    swapTokens,
    isWalletConnected,
    getStatusMessage,
    isTokenSelected,
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
    executeDeposit,
    executeWithdrawal,
  };
};
