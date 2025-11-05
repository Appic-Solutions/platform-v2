'use client';
import BridgeSelectTokenPage from './_components/select-token';
import TokenListPage from './_components/chain-token-list';
import { useEffect } from 'react';
import { useGetBridgeOptions } from './_api/index';
import { BridgeOptionsListRequest } from './_api/types/request';
import { useBridgeActions, useBridgeStore } from './_store';
import { useSharedStore } from '@/store/store';
import { StepperContainer } from './_components/bridge-review';
import MinimizeProgressBarWidget from '@/app/(panel)/_layout/minimize-progress-bar-widget';
import { ParkOutlineBridgeIcon } from '@/components/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  check_deposit_status,
  check_withdraw_status,
} from '@/blockchain_api/functions/icp/bridge_transactions';
import { BridgeOption } from '@/blockchain_api/functions/icp/get_bridge_options';
import { HttpAgent } from '@dfinity/agent';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { queryKeys } from '@/lib/constants/query-keys';

const BridgeHome = () => {
  const { unAuthenticatedAgent } = useSharedStore();
  const queryClient = useQueryClient();
  const bridgePairs = useTypedQueryData(queryKeys.bridgePairs);
  const {
    amount,
    fromToken,
    toToken,
    activeStep,
    pendingTx,
    selectedOption,
    txHash,
    withdrawalId,
  } = useBridgeStore();
  const { setBridgeOptions, setTxStep, setTxHash, setWithdrawalId } = useBridgeActions();

  const { mutateAsync: getBridgeOptions, isPending: isPendingBridgeOptions } =
    useGetBridgeOptions();

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
            setBridgeOptions({ message: res.message, options: res.result });
          }
        });
      } catch (error) {
        throw new Error(`Error! ${error}`);
      }
    }
  }, [
    amount,
    bridgePairs,
    unAuthenticatedAgent,
    fromToken,
    toToken,
    getBridgeOptions,
    setBridgeOptions,
  ]);

  // check deposit tx status
  useQuery({
    queryKey: ['check-deposit-status'],
    queryFn: async () => {
      const res = await check_deposit_status(
        txHash as `0x${string}`,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );

      if (res.success) {
        if (res.result === 'Minted') {
          setTxStep({
            count: 5,
            status: 'successful',
          });
          setTxHash(undefined);
        } else if (res.result === 'Invalid' || res.result === 'Quarantined') {
          setTxStep({
            count: 5,
            status: 'failed',
          });
          setTxHash(undefined);
        } else {
          setTxStep({
            count: 5,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 5,
          status: 'failed',
        });
        setTxHash(undefined);
      }
      queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] });
      return res;
    },
    refetchInterval: 1000 * 5,
    enabled: !!txHash && !!unAuthenticatedAgent && !!selectedOption,
  });

  // check withdrawal tx status
  useQuery({
    queryKey: ['check-withdrawal-status'],
    queryFn: async () => {
      const res = await check_withdraw_status(
        withdrawalId as string,
        selectedOption as BridgeOption,
        unAuthenticatedAgent as HttpAgent,
      );
      if (res.success) {
        if (res.result === 'Successful') {
          setTxStep({
            count: 4,
            status: 'successful',
          });
          setWithdrawalId(undefined);
        } else if (res.result === 'QuarantinedReimbursement' || res.result === 'Reimbursed') {
          setTxStep({
            count: 4,
            status: 'failed',
          });
          setWithdrawalId(undefined);
        } else {
          setTxStep({
            count: 4,
            status: 'pending',
          });
        }
      } else if (!res.success) {
        setTxStep({
          count: 4,
          status: 'failed',
        });
        setWithdrawalId(undefined);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] }),
        queryClient.invalidateQueries({ queryKey: [queryKeys.evmBalance] }),
      ]);
      return res;
    },
    refetchInterval: 1000 * 5,
    enabled: !!withdrawalId && !!selectedOption && !!unAuthenticatedAgent,
  });

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <BridgeSelectTokenPage isPendingBridgeOptions={isPendingBridgeOptions} />;
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

export default BridgeHome;
