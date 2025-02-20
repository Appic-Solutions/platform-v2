import { TokenType, useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import { useSharedStore } from '@/common/state/store';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit } from '@reown/appkit/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

const SelectTokenLogic = () => {
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const { connect: openIcpModal } = useAuth();
  const { open: openEvmModal } = useAppKit();

  const {
    activeStep,
    fromToken,
    toToken,
    amount,
    toWalletAddress,
    selectedOption,
    toWalletValidationError,
    selectedTokenBalance,
    bridgeOptions,
  } = useBridgeStore();
  const { setActiveStep, setFromToken, setToToken } = useBridgeActions();

  const { isEvmBalanceLoading, isIcpBalanceLoading, isEvmConnected, evmBalance, icpBalance, icpIdentity } =
    useSharedStore();

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

  function getActionButtonStatus({ showWalletAddress }: { showWalletAddress: boolean }): {
    isDisable: boolean;
    text: string;
  } {
    if (!fromToken || !toToken) {
      return {
        isDisable: true,
        text: 'Select token to bridge',
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
      (isWalletConnected('to') && isWalletConnected('from') && selectedOption) ||
      (toWalletAddress && !toWalletValidationError && isWalletConnected('from') && selectedOption)
    ) {
      if (BigNumber(amount).isGreaterThan(BigNumber(selectedTokenBalance))) {
        return {
          isDisable: true,
          text: 'INSUFFICIENT Funds',
        };
      }
      if (!selectedOption.is_native) {
        if (fromToken.chain_type === 'EVM') {
          // The native token of the transaction chain that the user holds in his wallet
          const userNativeToken = evmBalance?.tokens.find(
            (token) =>
              token.contractAddress === selectedOption.native_fee_token_id && token.chainId === selectedOption.chain_id,
          );
          if (
            !userNativeToken ||
            Number(userNativeToken.balance) < Number(selectedOption.fees.human_readable_total_native_fee)
          ) {
            return {
              isDisable: true,
              text: `INSUFFICIENT ${selectedOption.fees.native_fee_token_symbol} Balance`,
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
              text: `INSUFFICIENT ${selectedOption.fees.native_fee_token_symbol} Balance`,
            };
          }
        }
      }
    }

    if (showWalletAddress) {
      if (!toWalletAddress || toWalletValidationError) {
        return {
          isDisable: true,
          text: 'Enter Valid Address',
        };
      } else if (!bridgeOptions.options?.length) {
        return {
          isDisable: true,
          text: 'Set token amount to continue',
        };
      } else if (bridgeOptions.options?.length && toWalletAddress && !toWalletValidationError) {
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

    if (bridgeOptions.options && bridgeOptions.options.length > 0 && !selectedOption) {
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

    if (
      toWalletAddress &&
      !toWalletValidationError &&
      isWalletConnected('from') &&
      bridgeOptions.options &&
      bridgeOptions.options?.length > 0
    ) {
      return {
        isDisable: false,
        text: 'Review Bridge',
      };
    }
    if (isWalletConnected('from') && isWalletConnected('to') && bridgeOptions.options?.length) {
      return {
        isDisable: false,
        text: 'Review Bridge',
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
    if (!isWalletConnected('from') && fromToken) {
      openConnectWalletModalHandler(fromToken);
      return;
    }
    if (!isWalletConnected('to') && toToken && !showWalletAddress) {
      openConnectWalletModalHandler(toToken);
      return;
    }

    if (isWalletConnected('from') && (isWalletConnected('to') || (toWalletAddress && !toWalletValidationError))) {
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
  };
};

export default SelectTokenLogic;
