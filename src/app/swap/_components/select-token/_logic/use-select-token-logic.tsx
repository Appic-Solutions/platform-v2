import { TokenType, useSwapActions, useSwapStore } from '@/app/swap/_store';
import { useSharedStore } from '@/store/store';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit } from '@reown/appkit/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

export const useSwapSelectTokenLogic = () => {
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const { connect: openIcpModal } = useAuth();
  const { open: openEvmModal } = useAppKit();

  const {
    activeStep,
    tokenIn,
    tokenOut,
    amount,
    toWalletAddress,
    toWalletValidationError,
    selectedTokenBalance,
    swapQuote,
  } = useSwapStore();
  const { setActiveStep, setTokenIn, setTokenOut } = useSwapActions();

  const {
    isEvmBalanceLoading,
    isIcpBalanceLoading,
    isEvmConnected,
    evmBalance,
    icpBalance,
    icpIdentity,
  } = useSharedStore();

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
    if (!tokenIn || !tokenOut) return;
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
  }

  function isWalletConnected(type: 'from' | 'to') {
    let mainToken: TokenType | undefined;
    if (type === 'from') mainToken = tokenIn;
    if (type === 'to') mainToken = tokenOut;

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

  function getActionButtonStatus({ showWalletAddress }: { showWalletAddress: boolean }): {
    isDisable: boolean;
    text: string;
  } {
    if (!tokenIn || !tokenOut) {
      return {
        isDisable: true,
        text: 'Select token to swap',
      };
    }

    if (!Number(amount) || Number(amount) === 0) {
      return {
        isDisable: true,
        text: 'Set token amount to continue',
      };
    }

    if (isEvmBalanceLoading || isIcpBalanceLoading) {
      return {
        isDisable: true,
        text: 'Fetching wallet balance',
      };
    }

    if (
      (isWalletConnected('to') && isWalletConnected('from')) ||
      (toWalletAddress && !toWalletValidationError && isWalletConnected('from'))
    ) {
      if (new BigNumber(amount).isGreaterThan(new BigNumber(selectedTokenBalance))) {
        return {
          isDisable: true,
          text: 'INSUFFICIENT Funds',
        };
      }
    }

    if (showWalletAddress) {
      if (!toWalletAddress || toWalletValidationError) {
        return {
          isDisable: true,
          text: 'Enter Valid Address',
        };
      } else if (!swapQuote.quote) {
        return {
          isDisable: true,
          text: 'Set token amount to continue',
        };
      } else if (!isWalletConnected('from')) {
        return {
          isDisable: false,
          text: `Connect ${tokenIn.chain_type} Wallet`,
        };
      } else if (swapQuote.quote && toWalletAddress && !toWalletValidationError) {
        return {
          isDisable: false,
          text: 'Review Swap',
        };
      }
    }

    if (swapQuote.quote && !swapQuote.quote) {
      return {
        isDisable: true,
        text: 'Select Swap Option',
      };
    }

    if (!isWalletConnected('from')) {
      return {
        isDisable: false,
        text: `Connect ${tokenIn.chain_type} Wallet`,
      };
    }

    if (!showWalletAddress && !isWalletConnected('to')) {
      return {
        isDisable: false,
        text: `Connect ${tokenOut.chain_type} Wallet`,
      };
    }

    if (
      toWalletAddress &&
      !toWalletValidationError &&
      isWalletConnected('from') &&
      swapQuote.quote
    ) {
      return {
        isDisable: false,
        text: 'Review Swap',
      };
    }
    if (isWalletConnected('from') && isWalletConnected('to') && swapQuote.quote) {
      return {
        isDisable: false,
        text: 'Review Swap',
      };
    }

    return {
      isDisable: true,
      text: 'Confirm',
    };
  }

  const openConnectWalletModalHandler = (token: TokenType) => {
    if (token?.chain_type === 'ICP') {
      return openIcpModal();
    }
    if (token?.chain_type === 'EVM') {
      return openEvmModal();
    }
  };

  const actionButtonHandler = () => {
    if (!isWalletConnected('from') && tokenIn) {
      openConnectWalletModalHandler(tokenIn);
      return;
    }
    if (!isWalletConnected('to') && tokenOut && !showWalletAddress) {
      openConnectWalletModalHandler(tokenOut);
      return;
    }

    if (
      isWalletConnected('from') &&
      (isWalletConnected('to') || (toWalletAddress && !toWalletValidationError))
    ) {
      changeStep(3);
    }
  };

  const actionButtonStatus = getActionButtonStatus({
    showWalletAddress,
  });

  return {
    changeStep,
    swapTokens,
    getActionButtonStatus,
    actionButtonHandler,
    setShowWalletAddress,
    showWalletAddress,
    actionButtonStatus,
    isWalletConnected,
  };
};
