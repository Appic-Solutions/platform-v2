'use client';
import BridgeSelectTokenPage from './_components/select-token';
import TokenListPage from './_components/chain-token-list';
import { useEffect } from 'react';
import { useGetBridgeOptions, useGetBridgePairs } from './_api/index';
import { BridgeOptionsListRequest } from './_api/types/request';
import { useBridgeActions, useBridgeStore } from './_store';
import { useSharedStore } from '@/store/store';
import { StepperContainer } from './_components/bridge-review';
import MinimizeProgressBarWidget from '@/app/_layout/minimize-progress-bar-widget';
import { ParkOutlineBridgeIcon } from '@/components/icons';

const BridgeHome = () => {
  const { unAuthenticatedAgent } = useSharedStore();
  const { amount, fromToken, toToken, bridgePairs, activeStep, pendingTx } = useBridgeStore();
  const { setBridgePairs, setBridgeOptions } = useBridgeActions();

  const { data: bridgePairsData, isPending, isError } = useGetBridgePairs(unAuthenticatedAgent);
  const { mutateAsync: getBridgeOptions, isPending: isPendingBridgeOptions } = useGetBridgeOptions();

  useEffect(() => {
    if (bridgePairsData) setBridgePairs(bridgePairsData);
  }, [bridgePairsData, setBridgePairs]);

  useEffect(() => {
    if (amount && unAuthenticatedAgent && fromToken && toToken && bridgePairs) {
      const getBridgeOptionsParams: BridgeOptionsListRequest = {
        agent: unAuthenticatedAgent,
        amount: amount,
        bridge_pairs: bridgePairs,
        from_token: fromToken,
        to_token: toToken,
      };
      try {
        getBridgeOptions(getBridgeOptionsParams).then((res) => {
          console.log(res);
          if (res) {
            setBridgeOptions({
              message: res.message,
              options: res.result,
            });
          }
        });
      } catch (error) {
        throw new Error(`Error! ${error}`);
      }
    }
  }, [amount, bridgePairs, unAuthenticatedAgent, fromToken, toToken, getBridgeOptions, setBridgeOptions]);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <BridgeSelectTokenPage isPendingBridgeOptions={isPendingBridgeOptions} />;
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
        <MinimizeProgressBarWidget icon={<ParkOutlineBridgeIcon width={24} height={24} className="text-white" />} />
      )}
    </>
  );
};

export default BridgeHome;
