'use client';
import SwapSelectTokenPage from './_components/select-token';
import TokenListPage from './_components/chain-token-list';
import { useSwapStore } from './_store';
import { StepperContainer } from './_components/swap-review';

const SwapPage = () => {
  const { activeStep } = useSwapStore();

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

export default SwapPage;
