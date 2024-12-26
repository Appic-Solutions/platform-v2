'use client';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import BridgeSelectTokenPage from '@/components/pages/bridge/select-token/select-token';
import TokenListPage from '@/components/pages/bridge/chain-token-list/token-list';
import { useEffect, useState } from 'react';
import { useUnAuthenticatedAgent } from '@/hooks/useUnauthenticatedAgent';
import BridgeReview from '@/components/pages/bridge/bridge-review/BridgeReview';
import { useGetBridgeOptions, useGetBridgePairs } from './_api/bridge-hooks';
import { useQuery } from '@tanstack/react-query';
import { get_icp_tokens } from '@/blockchain_api/functions/icp/get_all_icp_tokens';
import { setStorageItem } from '@/lib/localstorage';
import { BridgeOptionsListRequest } from './_api/types/request';
import { BridgeOption as BridgeOptionType } from '@/blockchain_api/functions/icp/get_bridge_options';

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
  const [bridgeOptions, setBridgeOptions] = useState<BridgeOptionType[]>();

  const unauthenticatedAgent = useUnAuthenticatedAgent();

  useQuery({
    queryKey: ['IcpTokens'],
    queryFn: async () => {
      if (!unauthenticatedAgent) return [];
      const res = await get_icp_tokens(unauthenticatedAgent);
      if (!res) return [];
      setStorageItem('icpTokens', JSON.stringify(res.result));

      return res;
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  const { data: bridgePairsData, isPending, isError } = useGetBridgePairs(unauthenticatedAgent);
  const {
    mutateAsync: getBridgeOptions,
    isPending: isPendingBridgeOptions,
    isError: isErrorBridgeOptions,
  } = useGetBridgeOptions();

  useEffect(() => {
    if (bridgePairsData) setBridgePairs(bridgePairsData);
  }, [bridgePairsData]);

  useEffect(() => {
    if (amount && unauthenticatedAgent && fromToken && toToken && bridgePairs) {
      const getBridgeOptionsParams: BridgeOptionsListRequest = {
        agent: unauthenticatedAgent,
        amount: amount,
        bridge_pairs: bridgePairs,
        from_token: fromToken,
        to_token: toToken,
      };
      try {
        getBridgeOptions(getBridgeOptionsParams).then((res) => {
          if (res.success) {
            console.log(res);
            setBridgeOptions(res.result);
          }
        });
      } catch (error) {
        throw new Error(`Error! ${error}`);
      }
    }
  }, [amount, bridgePairs, unauthenticatedAgent, fromToken, toToken, getBridgeOptions]);

  const handleStepChange = (direction: 'next' | 'prev' | number) => {
    setActiveStep((prev) => {
      const newStep = typeof direction === 'number' ? direction : prev + (direction === 'next' ? 1 : -1);
      return Math.min(Math.max(newStep, 1), 4);
    });
  };

  const handleTokenSelection = (token: EvmToken | IcpToken) => {
    const setToken = selectedType === 'from' ? setFromToken : setToToken;
    if (fromToken && toToken) {
      setFromToken(null);
      setToToken(null);
    }
    setToken(token);
  };

  const swapTokensHandler = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
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
            handleOptionSelect={(option) => setSelectedOption(option)}
            selectedOption={selectedOption}
            amount={amount}
            setAmount={(amount) => setAmount(amount)}
            bridgeOptions={bridgeOptions}
            isErrorBridgeOptions={isErrorBridgeOptions}
            isPendingBridgeOptions={isPendingBridgeOptions}
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
