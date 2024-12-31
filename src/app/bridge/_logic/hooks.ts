import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
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

export const useTokenSelector = () => {
  const { selectedTokenType, fromToken, toToken } = useBridgeStore();
  const { setFromToken, setToToken, setAmount } = useBridgeActions();

  const handleTokenSelection = (token: EvmToken | IcpToken) => {
    const setToken = selectedTokenType === 'from' ? setFromToken : setToToken;
    if (fromToken && toToken) {
      setFromToken(undefined);
      setToToken(undefined);
      setAmount('');
    }
    setToken(token);
  };
  return handleTokenSelection;
};

export const useStepChange = () => {
  const { activeStep } = useBridgeStore();
  const { setActiveStep } = useBridgeActions();

  const handleStepChange = (direction: 'next' | 'prev' | number) => {
    const currentStep = typeof direction === 'number' ? direction : activeStep;
    if (direction === 'next') {
      setActiveStep(currentStep + 1);
    } else if (direction === 'prev') {
      setActiveStep(currentStep - 1);
    } else {
      setActiveStep(direction);
    }
  };
  return handleStepChange;
};

export const useSwapTokens = () => {
  const { fromToken, toToken } = useBridgeStore();
  const { setFromToken, setToToken } = useBridgeActions();
  const swapTokensHandler = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };
  return swapTokensHandler;
};

export const useCheckWalletConnectStatus = () => {
  const { fromToken, toToken } = useBridgeStore();
  const { isEvmConnected, icpIdentity } = useSharedStore();

  const checkWalletConnectStatus = (type: 'from' | 'to') => {
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

  return checkWalletConnectStatus;
};

export const useActionButtonText = () => {
  const { fromToken, toToken, amount, selectedOption } = useBridgeStore();
  const { isEvmConnected, icpIdentity } = useSharedStore();
  const checkIsWalletConnected = useCheckWalletConnectStatus();

  const textHandler = ({
    showWalletAddress,
    toWalletValidationError,
    toWalletAddress,
  }: {
    showWalletAddress: boolean;
    toWalletValidationError: string | null;
    toWalletAddress: string;
  }) => {
    if (!fromToken || !toToken) return 'Select token to bridge';

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

    const isSourceWalletDisconnected =
      (fromToken?.chain_type === 'EVM' && !isEvmConnected) || (fromToken?.chain_type === 'ICP' && !icpIdentity);
    if (isSourceWalletDisconnected) {
      return `Connect ${fromToken.chain_type} Wallet`;
    }

    if (showWalletAddress) {
      return !toWalletAddress || toWalletValidationError ? 'Enter Valid Address' : 'Review Bridge';
    }

    if (!checkIsWalletConnected('to')) {
      return `Connect ${toToken.chain_type} Wallet`;
    }

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    if (isDestWalletValid) {
      return 'Review Bridge';
    }
  };
  return textHandler;
};

export const useIsTokenSelected = () => {
  const { fromToken, toToken, selectedTokenType } = useBridgeStore();
  const checker = (token: TokenType) => {
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
  };
  return checker;
};

// Withdrawal Tx Logic
export const useWithdrawalTx = () => {
  const { selectedOption, toWalletAddress } = useBridgeStore();
  const { authenticatedAgent, icpIdentity, evmAddress } = useSharedStore();
  const { mutateAsync: approveToken } = useGetTokenApproval();
  const { mutateAsync: requestWithdraw } = useGetRequestWithdraw();
  const { mutateAsync: notifyWithdrawal } = useNotifyAppicHelperWithdrawal();
  const { mutateAsync: checkStatus } = useCheckWithdrawalStatus();

  const executeWithdrawalTx = async () => {
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
  };

  return {
    executeWithdrawalTx,
  };
};

// Deposit Tx Logic
export const useDepositTx = () => {
  const { selectedOption, fromToken, toWalletAddress } = useBridgeStore();
  const { icpIdentity, evmAddress, unAuthenticatedAgent } = useSharedStore();
  const { mutateAsync: createWalletClient } = useCreateWalletClient();
  const { mutateAsync: approveDeposit } = useDepositTokenWithApproval();
  const { mutateAsync: requestDeposit } = useDepositToken();
  const { mutateAsync: notifyDeposit } = useNotifyAppicHelperDeposit();
  const { mutateAsync: checkDepositStatus } = useCheckDepositStatus();

  const executeDepositTx = async () => {
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
  };

  return {
    executeDepositTx,
  };
};
