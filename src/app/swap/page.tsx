'use client';
import SwapSelectTokenPage from './_components/select-token';
import TokenListPage from './_components/chain-token-list';
import { useEffect } from 'react';
import { useGetBridgeOptions, useGetBridgePairs } from './_api/index';
import { BridgeOptionsListRequest } from './_api/types/request';
import { useSwapActions, useSwapStore } from './_store';
import { useSharedStore } from '@/store/store';
import { StepperContainer } from './_components/bridge-review';
import MinimizeProgressBarWidget from '@/app/_layout/minimize-progress-bar-widget';
import { ParkOutlineBridgeIcon } from '@/components/icons';

const SwapPage = () => {
  const { unAuthenticatedAgent } = useSharedStore();
  const { amount, fromToken, toToken, swapPairs, activeStep, pendingTx } = useSwapStore();
  const { setSwapPairs, setSwapOptions } = useSwapActions();

  const { data: swapPairsData, isPending, isError } = useGetBridgePairs(unAuthenticatedAgent);
  const { mutateAsync: getBridgeOptions, isPending: isPendingBridgeOptions } =
    useGetBridgeOptions();

  useEffect(() => {
    if (swapPairsData) setSwapPairs(swapPairsData);
  }, [swapPairsData, setSwapPairs]);

  useEffect(() => {
    if (amount && unAuthenticatedAgent && fromToken && toToken && swapPairs) {
      const getBridgeOptionsParams: BridgeOptionsListRequest = {
        agent: unAuthenticatedAgent,
        amount: amount,
        bridge_pairs: swapPairs,
        from_token: fromToken,
        to_token: toToken,
      };
      try {
        getBridgeOptions(getBridgeOptionsParams).then((res) => {
          console.log(res);
          if (res) {
            setSwapOptions({ message: res.message, options: res.result });
          }
        });
      } catch (error) {
        throw new Error(`Error! ${error}`);
      }
    }
  }, [
    amount,
    swapPairs,
    unAuthenticatedAgent,
    fromToken,
    toToken,
    getBridgeOptions,
    setSwapOptions,
  ]);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <SwapSelectTokenPage isPendingSwapOptions={isPendingBridgeOptions} />;
      case 2:
        return <TokenListPage isPending={isPending} isError={isError} />;
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
