'use client';
import SwapSelectTokenPage from './_components/select-token';
import TokenListPage from './_components/chain-token-list';
import { useEffect } from 'react';
import { useSwapActions, useSwapStore } from './_store';
import { StepperContainer } from './_components/bridge-review';
import MinimizeProgressBarWidget from '@/app/_layout/minimize-progress-bar-widget';
import { ParkOutlineBridgeIcon } from '@/components/icons';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { fetchICPQuote } from '@/blockchain_api/quoter/icp';

const SwapPage = () => {
  const { amount, tokenIn, tokenOut, activeStep, pendingTx } = useSwapStore();
  const { setSwapQuote } = useSwapActions();

  const { data: swapQuoteData } = useQuery({
    queryKey: ['swap-quot'],
    // TODO: When Evm to Evm and Evm to Icp swap developed, this type assertions
    queryFn: () => fetchICPQuote(tokenIn as IcpToken, tokenOut as IcpToken, amount),
    enabled: !!tokenIn && !!tokenOut && !!amount,
  });

  useEffect(() => {
    if (swapQuoteData && swapQuoteData.result) {
      console.log('swapQuoteData', swapQuoteData);
      setSwapQuote({ message: '', quote: swapQuoteData.result });
    }
  }, [swapQuoteData, tokenIn, tokenOut, amount]);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <SwapSelectTokenPage />;
      case 2:
        return <TokenListPage />;
      case 3:
        return <StepperContainer />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}
      {pendingTx && (
        <MinimizeProgressBarWidget
          icon={<ParkOutlineBridgeIcon width={24} height={24} className="text-white" />}
        />
      )}
    </>
  );
};

export default SwapPage;
