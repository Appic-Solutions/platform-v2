export const dynamic = 'force-static';

import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/common/helpers/localstorage';
import { TokenType, useBridgeActions, useBridgeStore } from '../_store';
import { useSharedStore, useSharedStoreActions } from '@/common/state/store';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { fetchEvmBalances, fetchIcpBalances } from '@/common/helpers/wallet';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { HttpAgent } from '@dfinity/agent';
import { setPendingTransactionToSession } from '@/common/helpers/session';

export const BridgeLogic = () => {
  const queryClient = useQueryClient();
  // Bridge Store
  const {
    selectedTokenType,
    fromToken,
    toToken,
    activeStep,
    amount,
    selectedOption,
    selectedTokenBalance,
    bridgeOptions,
    toWalletAddress,
    toWalletValidationError,
  } = useBridgeStore();
  // Bridge Actions
  const {
    setFromToken,
    setToToken,
    setAmount,
    setActiveStep,
    setTxStep,
    setTxErrorMessage,
    setPendingTx,
    setToWalletAddress,
  } = useBridgeActions();
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

  const { setIcpBalance, setEvmBalance } = useSharedStoreActions();

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
      const res = await check_deposit_status(
        txHash as `0x${string}`,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (res.success) {
        if (res.result === 'Minted') {
          setTxStep({
            count: 5,
            status: 'successful',
          });
        } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
          setTxStep({
            count: 5,
            status: 'failed',
          });
        } else {
          setTxStep({
            count: 5,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 5,
          status: 'failed',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchWalletBalances();
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled: !!txHash && !!unAuthenticatedAgent && !!selectedOption,
  });
  // withdrawal queries =====================>
  const tokenApproval = useTokenApproval();
  const submitWithdrawRequest = useSubmitWithdrawRequest();
  const notifyAppicHelper = useNotifyAppicHelper();
  // check withdrawal tx status
  useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        withdrawalId as string,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        if (res.result === 'Successful') {
          setTxStep({
            count: 4,
            status: 'successful',
          });
        } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
          setTxStep({
            count: 4,
            status: 'failed',
          });
        } else {
          setTxStep({
            count: 4,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 4,
          status: 'failed',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['bridge-history'] });
      fetchWalletBalances();
      return res;
    },
    refetchInterval: 1000 * 30,
    enabled: !!withdrawalId && !!selectedOption && !!unAuthenticatedAgent,
  });

  function fetchWalletBalances() {
    if (evmAddress && unAuthenticatedAgent) {
      fetchEvmBalances({
        evmAddress,
      }).then((res) => {
        setEvmBalance(res);
      });
    }
    if (unAuthenticatedAgent && icpIdentity) {
      fetchIcpBalances({
        unAuthenticatedAgent,
        icpIdentity,
      }).then((res) => {
        setIcpBalance(res);
      });
    }
  }

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
  }

  return {
    selectToken,
    isWalletConnected,
    isTokenSelected,
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
    executeDeposit,
    executeWithdrawal,
    executeTransaction,
    resetTransaction,
  };
};
