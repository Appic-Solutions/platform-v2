import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/common/helpers/localstorage';
import { TokenType, useBridgeActions, useBridgeStore } from '../_store';
import {
  useCheckDepositStatus,
  useCheckWithdrawalStatus,
  useCreateWalletClient,
  useDepositToken,
  useDepositTokenWithApproval,
  useGetRequestWithdraw,
  useGetTokenApproval,
  useNotifyAppicHelperDeposit,
  useNotifyAppicHelperWithdrawal,
} from '../_api';
import { useSharedStore } from '@/common/state/store';
import { DepositTxStatus, WithdrawalTxStatus } from '@/blockchain_api/functions/icp/bridge_transactions';
import { Response } from '@/blockchain_api/types/response';

export const BridgeLogic = () => {
  // Bridge Store
  const { selectedTokenType, fromToken, toToken, activeStep, amount, selectedOption, toWalletAddress } =
    useBridgeStore();
  // Bridge Actions
  const { setFromToken, setToToken, setAmount, setActiveStep } = useBridgeActions();
  // Shared Store
  const { icpIdentity, isEvmConnected, authenticatedAgent, unAuthenticatedAgent, evmAddress } = useSharedStore();
  // Withdrawal Queries
  const { mutateAsync: approveToken } = useGetTokenApproval();
  const { mutateAsync: requestWithdraw } = useGetRequestWithdraw();
  const { mutateAsync: notifyWithdrawal } = useNotifyAppicHelperWithdrawal();
  const { mutateAsync: checkStatus } = useCheckWithdrawalStatus();
  // Deposit Queries
  const { mutateAsync: createWalletClient } = useCreateWalletClient();
  const { mutateAsync: approveDeposit } = useDepositTokenWithApproval();
  const { mutateAsync: requestDeposit } = useDepositToken();
  const { mutateAsync: notifyDeposit } = useNotifyAppicHelperDeposit();
  const { mutateAsync: checkDepositStatus } = useCheckDepositStatus();

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
      if (mainToken?.chain_type === 'EVM' && isEvmConnected) {
        return true;
      }
      if (mainToken?.chain_type === 'ICP' && icpIdentity) {
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

  async function executeWithdrawal() {
    if (selectedOption && authenticatedAgent && icpIdentity && (evmAddress || toWalletAddress)) {
      try {
        // Step 1: Approve Token
        const approvalResult = await approveToken({
          bridge_option: selectedOption,
          authenticated_agent: authenticatedAgent,
        });

        // Step 2: Request Withdraw
        const withdrawResult = await requestWithdraw({
          bridge_option: selectedOption,
          recipient: evmAddress || toWalletAddress,
          authenticated_agent: authenticatedAgent,
        });

        // Step 3: Notify Appic Helper Withdrawal
        const notifyResult = await notifyWithdrawal({
          bridge_option: selectedOption,
          withdrawal_id: withdrawResult.result,
          recipient: evmAddress || toWalletAddress,
          user_wallet_principal: icpIdentity?.getPrincipal().toString(),
          authenticated_agent: authenticatedAgent,
        });

        // Step 4: Check Withdrawal Status
        let status: Response<WithdrawalTxStatus>;
        do {
          status = await checkStatus({
            withdrawal_id: withdrawResult.result,
            bridge_option: selectedOption,
            authenticated_agent: authenticatedAgent,
          });
          if (status.result === 'Accepted') {
            return status;
          }
          // Wait for 1 minute before checking again
          await new Promise((resolve) => setTimeout(resolve, 60000));
        } while (status.result !== 'Failed');

        return status;
      } catch (error) {
        throw error; // Bubble up error for handling in components
      }
    }
  }

  async function executeDeposit() {
    if (
      selectedOption &&
      fromToken &&
      icpIdentity &&
      (icpIdentity.getPrincipal() || toWalletAddress) &&
      evmAddress &&
      unAuthenticatedAgent
    ) {
      try {
        // Step 1: Create Wallet Client
        const walletClient = await createWalletClient(selectedOption);

        // Step 2: Token Approval (only for ERC20 tokens)
        if (fromToken.tokenType === 'erc20') {
          await approveDeposit({
            wallet_client: walletClient,
            bridge_option: selectedOption,
          });
        }

        // Step 3: Submit Deposit Request
        const depositResult = await requestDeposit({
          wallet_client: walletClient,
          bridge_option: selectedOption,
          recipient: icpIdentity.getPrincipal() || toWalletAddress,
        });

        // Step 4: Notify Appic Helper
        await notifyDeposit({
          bridge_option: selectedOption,
          tx_hash: depositResult.result,
          user_wallet_address: evmAddress,
          recipient_principal: icpIdentity.getPrincipal().toString() || toWalletAddress,
          unauthenticated_agent: unAuthenticatedAgent,
        });

        // Step 5: Monitor Transaction Status
        let status: Response<DepositTxStatus>;
        do {
          status = await checkDepositStatus({
            tx_hash: depositResult.result,
            bridge_option: selectedOption,
            unauthenticated_agent: unAuthenticatedAgent,
          });
          if (status.result === 'Accepted') {
            return status; // Transaction successful
          }
          // Wait for 1 minute before checking again
          await new Promise((resolve) => setTimeout(resolve, 60000));
        } while (status.result !== 'Minted');

        return status;
      } catch (error) {
        throw error; // Bubble up error for handling
      }
    }
  }

  return {
    selectToken,
    changeStep,
    swapTokens,
    isWalletConnected,
    getStatusMessage,
    isTokenSelected,
    executeWithdrawal,
    executeDeposit,
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
  };
};
