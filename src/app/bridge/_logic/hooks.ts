import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { TokenType, useBridgeActions, useBridgeStore } from '../_store';
import {
  useCheckWithdrawalStatus,
  useGetRequestWithdraw,
  useGetTokenApproval,
  useNotifyAppicHelperWithdrawal,
} from '../_api';
import { useSharedStore } from '@/common/state/store';

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
    if (!fromToken || !toToken) return 'Select Tokens';

    if (
      fromToken &&
      toToken &&
      fromToken.contractAddress === toToken.contractAddress &&
      fromToken.chainId === toToken.chainId
    ) {
      return 'Please select different tokens';
    }

    if (!Number(amount)) return 'Fill Amount Field';
    if (!selectedOption) return 'Select Bridge Option';

    const isSourceWalletDisconnected =
      (fromToken?.chain_type === 'EVM' && !isEvmConnected) || (fromToken?.chain_type === 'ICP' && !icpIdentity);
    if (isSourceWalletDisconnected) {
      return `Connect ${fromToken.chain_type} Wallet`;
    }

    if (showWalletAddress) {
      return !toWalletAddress || toWalletValidationError ? 'Enter Valid Address' : 'Confirm';
    }

    if (!checkIsWalletConnected('to')) {
      return `Connect ${toToken.chain_type} Wallet`;
    }

    const isDestWalletValid = toWalletAddress && !toWalletValidationError;
    if (isDestWalletValid) {
      return 'Confirm';
    }
  };
  return textHandler;
};

// Approval Tx Logic
const useApprovalTx = () => {
  const { selectedOption } = useBridgeStore();
  const { authenticatedAgent } = useSharedStore();
  const { mutateAsync: approveToken } = useGetTokenApproval();
  const { mutateAsync: requestWithdraw } = useGetRequestWithdraw();
  const { mutateAsync: notifyWithdrawal } = useNotifyAppicHelperWithdrawal();
  const { mutateAsync: checkStatus } = useCheckWithdrawalStatus();

  const executeApprovalTx = async () => {
    if (selectedOption && authenticatedAgent) {
      try {
        // Step 1: Approve Token
        const approvalResult = await approveToken({
          bridge_option: selectedOption,
          authenticated_agent: authenticatedAgent,
        });

        // Step 2: Request Withdraw
        const withdrawResult = await requestWithdraw({
          bridge_option: bridge_option,
          recipient: recipient,
          authenticated_agent: authenticated_agent,
        });

        // Step 3: Notify Appic Helper Withdrawal
        const notifyResult = await notifyWithdrawal({
          bridge_option: bridge_option,
          withdrawal_id: withdrawResult.withdrawal_id,
          recipient: recipient,
          user_wallet_principal: user_wallet_principal,
          authenticated_agent: authenticated_agent,
        });

        // Step 4: Check Withdrawal Status
        // call every 1 minute for both of withdrawal and deposit
        const statusResult = await checkStatus({
          withdrawal_id: withdrawResult.withdrawal_id,
          bridge_option: bridge_option,
          authenticated_agent: authenticated_agent,
        });

        return statusResult;
      } catch (error) {
        throw error; // Bubble up error for handling in components
      }
    }
  };

  return {
    executeApprovalTx,
  };
};

// Deposit Tx Logic
export const useDepositTx = () => {};
