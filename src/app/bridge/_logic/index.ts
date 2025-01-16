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
  const { selectedTokenType, fromToken, toToken, activeStep, amount, selectedOption, selectedTokenBalance } =
    useBridgeStore();
  // Bridge Actions
  const { setFromToken, setToToken, setAmount, setActiveStep, setTxStep, setTxStatus, setTxErrorMessage } =
    useBridgeActions();
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
    evmAddress,
  } = useSharedStore();

  // Bridge Transaction states

  const [txHash, setTxHash] = useState<TxHash | undefined>();
  const [withdrawalId, setWithdrawalId] = useState<string | undefined>();
  // deposit queries ====================>
  const createWalletClient = useCreateWalletClient();
  const depositTokenWithApproval = useDepositTokenWithApproval();
  const depositToken = useDepositToken();
  const notifyAppicHelperDeposit = useNotifyAppicHelperDeposit();
  // check deposit tx status
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
            count: 5,
            status: 'successful',
          });
        } else if (!res.success) {
          setTxStep({
            count: 5,
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
            count: 4,
            status: 'successful',
          });
        } else if (!res.success) {
          setTxStep({
            count: 4,
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

  function isWalletConnected(type: 'from' | 'to') {
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
  }

  function getActionButtonStatus({
    showWalletAddress,
    toWalletValidationError,
    toWalletAddress,
  }: {
    showWalletAddress: boolean;
    toWalletValidationError: string | null;
    toWalletAddress: string;
  }): {
    isDisable: boolean;
    text: string;
  } {
    if (isEvmBalanceLoading || isIcpBalanceLoading) {
      return {
        isDisable: true,
        text: 'Fetching wallet balance',
      };
    }

    if (!fromToken || !toToken) {
      return {
        isDisable: true,
        text: 'Select token to bridge',
      };
    }

    if (showWalletAddress) {
      if (!toWalletAddress || toWalletValidationError) {
        return {
          isDisable: true,
          text: 'Enter Valid Address',
        };
      } else {
        return {
          isDisable: false,
          text: 'Review Bridge',
        };
      }
    }

    if (
      fromToken &&
      toToken &&
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    ) {
      return {
        isDisable: true,
        text: 'Please select different tokens',
      };
    }

    if (!Number(amount)) {
      return {
        isDisable: true,
        text: 'Set token amount to continue',
      };
    }

    if (!selectedOption) {
      return {
        isDisable: true,
        text: 'Select Bridge Option',
      };
    }

    if (!isWalletConnected('from')) {
      return {
        isDisable: false,
        text: `Connect ${fromToken.chain_type} Wallet`,
      };
    }

    if (!showWalletAddress && !isWalletConnected('to')) {
      return {
        isDisable: false,
        text: `Connect ${toToken.chain_type} Wallet`,
      };
    }

    if ((isWalletConnected('from'), isWalletConnected('to'))) {
      // TODO: the condition should be this way:
      // * for regular tokens
      //  wallet balance for native token should be greater than max_network_fee
      // * for native tokens
      // wallet balance for token should be greater than amount
      console.log('selected option:', selectedOption);
      if (selectedOption.is_native) {
        console.log('is native:', selectedOption.is_native);
        if (Number(amount) > Number(selectedTokenBalance)) {
          return {
            isDisable: true,
            text: 'INSUFFICIENT Funds',
          };
        }
      } else {
        console.log('is note native:', selectedOption.is_native);
        if (fromToken.chain_type === 'EVM') {
          const userNativeToken = evmBalance?.tokens.find(
            (token) =>
              token.contractAddress === selectedOption.native_fee_token_id && token.chainId === selectedOption.chain_id,
          );
          console.log(userNativeToken);
          if (
            !userNativeToken ||
            Number(userNativeToken.balance) < Number(selectedOption.fees.human_readable_total_native_fee)
          ) {
            return {
              isDisable: true,
              text: `INSUFFICIENT Token Balance`,
            };
          }
        } else if (fromToken.chain_type === 'ICP') {
          const userNativeToken = icpBalance?.tokens.find(
            (token) => token.canisterId === selectedOption.native_fee_token_id,
          );
          if (
            !userNativeToken ||
            Number(userNativeToken.balance) < Number(selectedOption.fees.human_readable_total_native_fee)
          ) {
            return {
              isDisable: true,
              text: `INSUFFICIENT Token Balance`,
            };
          }
        }
      }
    }

    if (toWalletAddress && !toWalletValidationError && isWalletConnected('from')) {
      return {
        isDisable: false,
        text: 'Review Bridge',
      };
    }

    if (isWalletConnected('from') && isWalletConnected('to')) {
      return {
        isDisable: false,
        text: 'Review Bridge',
      };
    }

    return {
      isDisable: true,
      text: 'Error',
    };
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
  function setBridgePairsWithTime(data: (EvmToken | IcpToken)[]) {
    const currentTime = new Date().getTime();
    setStorageItem('bridge-pairs', JSON.stringify(data));
    setStorageItem('bridge-pairs-last-fetch-time', currentTime.toString());
  }

  // get data and last fetch time from localstorage
  function getBridgePairsFromLocalStorage() {
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
  }

  //  1. Withdrawal Transactions (ICP -> EVM)
  //  2. Deposit Transactions (EVM -> ICP)

  async function executeWithdrawal(params: FullWithdrawalRequest) {
    if (selectedOption && authenticatedAgent) {
      // Step 1: Token Approval
      // set step status pending
      const approvalResult = await tokenApproval.mutateAsync({
        bridgeOption: selectedOption,
        authenticatedAgent,
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
    if (authenticatedAgent && selectedOption && evmAddress && icpIdentity && unAuthenticatedAgent && amount) {
      setTxStep({
        count: 1,
        status: 'pending',
      });
      setTxErrorMessage('');
      setTxStatus(undefined);
      setTxHash(undefined);
      if (fromToken?.chain_type === 'ICP') {
        executeWithdrawal({
          authenticatedAgent,
          bridgeOption: selectedOption,
          recipient: evmAddress,
          userWalletPrincipal: icpIdentity.getPrincipal().toString(),
        });
      } else if (fromToken?.chain_type === 'EVM') {
        executeDeposit({
          bridgeOption: selectedOption,
          recipient: icpIdentity.getPrincipal(),
          recipientPrincipal: icpIdentity.getPrincipal().toString(),
          unAuthenticatedAgent,
          userWalletAddress: evmAddress,
        });
      }
    }
  }

  function resetTransaction() {
    setTxStep({
      count: 1,
      status: 'pending',
    });
    setTxStatus(undefined);
    setTxErrorMessage(undefined);
    setActiveStep(1);
    setAmount('');
  }

  return {
    selectToken,
    changeStep,
    swapTokens,
    isWalletConnected,
    isTokenSelected,
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
    executeDeposit,
    executeWithdrawal,
    executeTransaction,
    resetTransaction,
    getActionButtonStatus,
  };
};
