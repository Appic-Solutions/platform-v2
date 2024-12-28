'use client';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import BridgeSelectTokenPage from '@/common/components/pages/bridge/select-token/select-token';
import TokenListPage from '@/common/components/pages/bridge/chain-token-list/token-list';
import { useEffect, useState } from 'react';
import { useUnAuthenticatedAgent } from '@/common/hooks/useUnauthenticatedAgent';
import { BridgeOptionType } from '@/common/components/pages/bridge/select-token/_components/BridgeOptionsList';
import BridgeReview from '@/common/components/pages/bridge/bridge-review/BridgeReview';
import { useGetBridgePairs } from './_api';

type TokenType = EvmToken | IcpToken | null;
type SelectionType = 'from' | 'to';

const BridgeHome = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedType, setSelectedType] = useState<SelectionType>('from');
  const [fromToken, setFromToken] = useState<TokenType>(null);
  const [toToken, setToToken] = useState<TokenType>(null);
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<BridgeOptionType | null>(null);
  const [bridgePairs, setBridgePairs] = useState<(EvmToken | IcpToken)[]>();

  const unauthenticatedAgent = useUnAuthenticatedAgent();

  const { data: bridgePairsData, isPending, isError } = useGetBridgePairs(unauthenticatedAgent);

  useEffect(() => {
    if (bridgePairsData) setBridgePairs(bridgePairsData);
  }, [bridgePairsData]);

  const handleStepChange = (direction: 'next' | 'prev' | number) => {
    setActiveStep((prev) => {
      const newStep = typeof direction === 'number' ? direction : prev + (direction === 'next' ? 1 : -1);
      return Math.min(Math.max(newStep, 1), 4);
    });
  };

  const handleTokenSelection = (token: EvmToken | IcpToken) => {
    const setToken = selectedType === 'from' ? setFromToken : setToToken;
    setToken(token);
  };

  const swapTokensHandler = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleOptionSelect = (option: BridgeOptionType) => {
    if (option.isActive) {
      setSelectedOption(option);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <BridgeSelectTokenPage
            stepHandler={handleStepChange}
            setSelectedType={setSelectedType}
            fromToken={fromToken}
            toToken={toToken}
            swapTokensHandler={swapTokensHandler}
            handleOptionSelect={handleOptionSelect}
            selectedOption={selectedOption}
            amount={amount}
            setAmount={(amount) => setAmount(amount)}
          />
        );
      case 2:
        return (
          <TokenListPage
            prevStepHandler={() => handleStepChange('prev')}
            setTokenHandler={handleTokenSelection}
            selectedType={selectedType}
            fromToken={fromToken}
            toToken={toToken}
            tokens={bridgePairs}
            isPending={isPending}
            isError={isError}
          />
        );
      case 3:
        return <BridgeReview option={selectedOption} prevStepHandler={() => handleStepChange(1)} />;
      default:
        return null;
    }
  };

  return renderStep();
};

export default BridgeHome;
