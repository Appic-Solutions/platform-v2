import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { getStorageItem, setStorageItem } from '@/common/helpers/localstorage';
import { TokenType, useBridgeActions, useBridgeStore } from '../_store';
import { useSharedStore } from '@/common/state/store';

export const BridgeLogic = () => {
  // Bridge Store
  const { selectedTokenType, fromToken, toToken, activeStep, amount, selectedOption } = useBridgeStore();
  // Bridge Actions
  const { setFromToken, setToToken, setAmount, setActiveStep } = useBridgeActions();
  // Shared Store
  const { icpIdentity, isEvmConnected, evmBalance, icpBalance } = useSharedStore();

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

  return {
    selectToken,
    changeStep,
    swapTokens,
    isWalletConnected,
    getStatusMessage,
    isTokenSelected,
    setBridgePairsWithTime,
    getBridgePairsFromLocalStorage,
  };
};
