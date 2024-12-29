import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useBridgeActions, useBridgeStore } from '../_store';

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
