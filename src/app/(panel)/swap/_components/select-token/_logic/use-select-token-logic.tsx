import { TokenType, useSwapActions, useSwapStore } from '@/app/(panel)/swap/_store';
import { NATIVE_TOKEN_ADDRESS } from '@/blockchain_api/functions/icp/get_bridge_options';
import { EvmToken } from '@/blockchain_api/types/tokens';
import { queryKeys } from '@/lib/constants/query-keys';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { useSharedStore } from '@/store/store';
import { useAuth } from '@nfid/identitykit/react';
import { useAppKit } from '@reown/appkit/react';
import { useIsFetching } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useSwapSelectTokenLogic = () => {
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [userNativeToken, setUserNativeToken] = useState<EvmToken>();
  const [nativeToken, setNativeToken] = useState<EvmToken>();

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
  const { setActiveStep, setTokenIn, setTokenOut, setUsdPrice, setSelectedTokenBalance } =
    useSwapActions();

  const { isEvmConnected, icpIdentity } = useSharedStore();

  const icpBalance = useTypedQueryData(queryKeys.icpBalance);
  const evmBalance = useTypedQueryData(queryKeys.evmBalance);
  const isIcpBalanceFetching = useIsFetching({ queryKey: [queryKeys.icpBalance] });
  const isEvmBalanceFetching = useIsFetching({ queryKey: [queryKeys.evmBalance] });
  const bridgePairs = useTypedQueryData(queryKeys.bridgePairs);

  const isSwapQuoteFetching = useIsFetching({ queryKey: [queryKeys.swapQuote] });

  useEffect(() => {
    if (tokenIn?.chain_type === 'EVM' && evmBalance) {
      const mainToken = evmBalance.tokens.find(
        (t) =>
          t.contractAddress.toLocaleLowerCase() === tokenIn.contractAddress?.toLocaleLowerCase() &&
          t.chainId === tokenIn.chainId,
      );
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }

    if (tokenIn?.chain_type === 'ICP' && icpBalance) {
      const mainToken = icpBalance.tokens.find((t) => t.canisterId === tokenIn?.canisterId);
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }
  }, [isEvmConnected, icpIdentity, tokenIn, evmBalance, icpBalance, setSelectedTokenBalance]);

  useEffect(() => {
    if (nativeToken) {
      const userToken = evmBalance?.tokens.find(
        (token) =>
          token.contractAddress === nativeToken.contractAddress &&
          token.chainId === nativeToken.chainId,
      );
      if (userToken) {
        setUserNativeToken(userToken);
      } else {
        setUserNativeToken(undefined);
      }
    }
  }, [tokenIn, nativeToken]);

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
    const usdPrice = new BigNumber(amount == '' ? '0' : amount)
      .multipliedBy(tokenOut?.usdPrice || 0)
      .toFixed(2);
    setUsdPrice(usdPrice);
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

  const areSameEvmTokens = (token1: EvmToken, token2: EvmToken) => {
    if (token1.canisterId === token2.canisterId && token1.chainId === token2.chainId) {
      return true;
    }
    return false;
  };

  const getActionButtonStatus = useCallback(
    ({
      showWalletAddress,
    }: {
      showWalletAddress: boolean;
    }): { isDisable: boolean; text: string } => {
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

      if (isEvmBalanceFetching || isIcpBalanceFetching) {
        return {
          isDisable: true,
          text: 'Fetching wallet balance',
        };
      }

      if (!swapQuote || isSwapQuoteFetching) {
        return {
          isDisable: true,
          text: 'Confirm',
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

        if (
          tokenIn.contractAddress &&
          (!userNativeToken ||
            !userNativeToken.balance ||
            ('nativeTokenFees' in swapQuote &&
              swapQuote.nativeTokenFees?.totalNativeTokenfee &&
              new BigNumber(swapQuote.nativeTokenFees?.totalNativeTokenfee).isGreaterThan(
                userNativeToken.balanceRawInteger || '0',
              )))
        ) {
          return {
            isDisable: true,
            text: `INSUFFICIENT ${nativeToken?.symbol} Balance`,
          };
        }

        if (
          tokenIn.contractAddress &&
          nativeToken &&
          userNativeToken?.balance &&
          areSameEvmTokens(tokenIn, nativeToken) &&
          'nativeTokenFees' in swapQuote &&
          swapQuote.nativeTokenFees?.totalNativeTokenfee &&
          new BigNumber(swapQuote.nativeTokenFees?.totalNativeTokenfee)
            .plus(new BigNumber(amount))
            .isGreaterThan(userNativeToken.balanceRawInteger || '0')
        ) {
          return {
            isDisable: true,
            text: `INSUFFICIENT ${nativeToken.symbol} Balance`,
          };
        }
      }

      if (showWalletAddress) {
        if (!toWalletAddress || toWalletValidationError) {
          return {
            isDisable: true,
            text: 'Enter Valid Address',
          };
        } else if (!swapQuote) {
          return {
            isDisable: true,
            text: 'Set token amount to continue',
          };
        } else if (!isWalletConnected('from')) {
          return {
            isDisable: false,
            text: `Connect ${tokenIn.chain_type} Wallet`,
          };
        } else if (swapQuote && toWalletAddress && !toWalletValidationError) {
          return {
            isDisable: false,
            text: 'Review Swap',
          };
        }
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

      if (toWalletAddress && !toWalletValidationError && isWalletConnected('from') && swapQuote) {
        return {
          isDisable: false,
          text: 'Review Swap',
        };
      }

      if (isWalletConnected('from') && isWalletConnected('to') && swapQuote) {
        return {
          isDisable: false,
          text: 'Review Swap',
        };
      }

      return {
        isDisable: true,
        text: 'Confirm',
      };
    },
    [
      tokenIn,
      tokenOut,
      amount,
      isEvmBalanceFetching,
      isIcpBalanceFetching,
      swapQuote,
      selectedTokenBalance,
      userNativeToken,
      nativeToken,
      toWalletAddress,
      toWalletValidationError,
      isWalletConnected,
    ],
  );

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

  const findNativeToken = useMemo(() => {
    if (bridgePairs && tokenIn) {
      const nativeToken = bridgePairs.find(
        (t) => t.contractAddress === NATIVE_TOKEN_ADDRESS && t.chainId === tokenIn.chainId,
      );
      if (nativeToken) {
        setNativeToken(nativeToken as EvmToken);
      }
    }
  }, [tokenIn, bridgePairs]);

  return {
    changeStep,
    swapTokens,
    getActionButtonStatus,
    actionButtonHandler,
    setShowWalletAddress,
    showWalletAddress,
    actionButtonStatus,
    isWalletConnected,
    nativeToken,
  };
};
